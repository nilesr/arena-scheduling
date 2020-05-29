#!/usr/bin/env python3
import os, sys, time, io, csv
from bottle import request, response, route, static_file, post, run, abort, error, put, delete, redirect
sys.path.insert(0, ".")
import auth, oauth
from db import get_db, init_db, query, commit
sys.path.remove(".")

root = os.path.dirname(os.path.realpath(__file__))

def with_db(fn):
	def newfn(*args, **kwargs):
		db = get_db()
		try:
			r = fn(db, *args, **kwargs)
			return r
		finally:
			db.close()
	return newfn

def authenticated(fn):
	@with_db
	def newfn(db, *args, **kwargs):
		user = auth.try_auth(request, db)
		if not user: abort(403, "Permission denied")
		return fn(db, str(user), *args, **kwargs)
	return newfn

def time_checked(fn):
	@authenticated
	def newfn(db, user, *args, **kwargs):
		time_allowed = query(db, "select time_allowed_in from students where student_id = ?", user)[0].time_allowed_in
		if time.time() < time_allowed:
			abort(403, "Too early. You are allowed to begin scheduling on " + time.strftime("%A, %B %e, %H:%M:%S %Z", time.localtime(time_allowed)))
		return fn(db, user, *args, **kwargs)
	return newfn

def require_admin(fn):
	@authenticated
	def newfn(db, user, *args, **kwargs):
		if not auth.is_admin(user):
			abort(400, "You are not an administrator")
		return fn(db, user, *args, **kwargs)
	return newfn


def clear_block(db, block, student_id):
	r = query(db, "select * from student_schedules where block = ? and student_id = ?", block, student_id)

	if len(r) > 0:
		query(db, "delete from student_schedules where block = ? and student_id = ?", block, student_id)
		return r[0]

	return None

def get_class(db, block, name, subsection, teacher):
	
	c = query(db, "select * from classes where block = ? and name = ? and subsection = ? and teacher = ?", block, name, subsection, teacher)
	
	if len(c) > 0:
		return c[0]
	
	return None


@route("/")
def index():
	return static_file("/index.html", root=root)

@route("/login")
def login():
	redirect(oauth.make_url())

@route("/authn")
def authn():
	email, name = oauth.get_email(request)
	succ, stat = auth.try_login(email, name)
	if not succ:
		abort(400, stat)
	response.set_cookie("auth", stat)
	redirect("/")

@post("/logout")
@with_db
def logout(db):
	c = request.get_cookie("auth")
	if not c: return False
	commit(db, "delete from sessions where session_id = ?", c.encode("utf-8"))
	return {}

@route("/tickets")
@authenticated
def get_tickets(db, user):
	tickets = query(db, "select * from student_schedules where student_id = ?", user, symbolize_names=False)
	student = query(db, "select student_username, time_allowed_in, num from students where student_id = ?", user)[0]
	name = student.student_username
	time_allowed_in = student.time_allowed_in
	num = student.num
	waitlists = query(db, "select * from waitlist where student_id = ?", user, symbolize_names=False)
	return {
		"tickets": tickets,
		"name": name,
		"admin": auth.is_admin(user),
		"time_left": time_allowed_in - time.time(),
		"num": num,
		"waitlists": waitlists,
	}

@put("/tickets")
@time_checked
def put_ticket(db, user):
	# Check valid block
	block = request.forms.get("block")
	if len(block) != 1 or block not in "ABCDEFGHP":
		abort(400, "Invalid Block")

	# Check that they're not already taking a class at that block
	existing_block = query(db, "select class_name from student_schedules where student_id = ? and block = ?", user, block)
	if len(existing_block) > 0:
		abort(400, "You are already taking a class at that block: " + existing_block[0].class_name)

	name = request.forms.get("name")
	subsection = request.forms.get("subsection")
	teacher = request.forms.get("teacher")

	# Check that the class exists
	r = query(db, "select * from classes where block = ? and name = ? and subsection = ? and teacher = ?", block, name, subsection, teacher)
	if len(r) == 0:
		abort(400, "That class doesn't exist")
	if len(r) > 1:
		abort(500, "Database invariant violated")
	
	# Check that the user isn't already taking that class at a different block
	r = query(db, "select block from student_schedules where class_name = ? and teacher = ? and student_id = ?", name, teacher, user)
	if len(r) > 0:
		abort(400, "You are already in that class at another block: " + r[0].block)

	# Check if the user isn't in the maximum number of classes
	r = query(db, "select count(*) as count from student_schedules where student_id = ?", user)[0].count
	if r >= 11:
		abort(400, "You are already in the maximum number of classes")

	# Check if adding the block would exceed the limit for the class
	r = query(db, "select remaining_slots, locked, waitlist from classes_avail where name = ? and teacher = ? and block = ?", name, teacher, block)[0]
	
	if r.remaining_slots <= 0:
		abort(400, "That class is full. Please use the waitlist.")
	
	if r.locked == 1:
		abort(400, "That class is closed to enrollment. It has {} remaining slot{} which will be taken from the waitlist".format(r.remaining_slots, '' if r.remaining_slots == 1 else 's'))

	row = query(db, "insert into student_schedules (student_id, block, class_name, subsection, teacher) values (?, ?, ?, ?, ?)", user, block, name, subsection, teacher)
	
	# We're now out of slots
	if r.remaining_slots == 1:
		query(db, "update classes set locked = 1 where name = ? and teacher = ? and block = ?", name, teacher, block)
	
	db.commit()

	return {"ticket": row}

@delete("/tickets/<id>")
@time_checked
def delete_ticket(db, user, id):
	# Check that the ticket exists and is owned by the currently logged in user
	r = query(db, "select * from student_schedules where student_id = ? and id = ?", user, id)
	if len(r) != 1:
		abort(400, "Bad ticket ID specified - either the ticket does not exist, or you don't own it")
	

	commit(db, "delete from student_schedules where student_id = ? and id = ?", user, id)

	return {}

@put("/waitlist")
@time_checked
def waitlist(db, user):
	# Check valid block
	block = request.forms.get("block")
	if len(block) != 1 or block not in "ABCDEFGHP":
		abort(400, "Invalid Block")

	name = request.forms.get("name")
	subsection = request.forms.get("subsection")
	teacher = request.forms.get("teacher")

	# Check that the class exists
	r = query(db, "select * from classes where block = ? and name = ? and subsection = ? and teacher = ?", block, name, subsection, teacher)
	if len(r) == 0:
		abort(400, "That class doesn't exist")
	if len(r) > 1:
		abort(500, "Database invariant violated")

	note = request.forms.get("note")

	# Check the length of the note
	if len(note) < 30:
		abort(400, "Your note must be longer (minimum 30 characters)")


	# TODO: prevent duplicate waitlist entries

	row = query(db, "insert into waitlist (student_id, block, name, subsection, teacher, note) values (?, ?, ?, ?, ?, ?)", user, block, name, subsection, teacher, note)
	db.commit()

	return {"waitlist": row}

@delete("/waitlist")
@time_checked
def student_delete_waitlist(db, user):
	q = dict(request.query)

	block = q['block']
	name = q['name']
	subsection = q['subsection'] if q['subsection'] else ""
	teacher = q['teacher']
	student_id = user

	if not block or not name or not teacher or not student_id:
		abort(400, "Invalid deletion request")

	r = query(db, "select 1 from waitlist where block = ? and name = ? and subsection = ? and teacher = ? and student_id = ?", block, name, subsection, teacher, student_id)
	if len(r) == 0:
		abort(400, "Bad waitlist entry specified")

	commit(db, "delete from waitlist where block = ? and name = ? and subsection = ? and teacher = ? and student_id = ?", block, name, subsection, teacher, student_id)
	return {}


@route("/classes")
@with_db
def get_classes(db):
	return {"classes": query(db, "select * from classes_avail", symbolize_names=False)}

@route("/roster")
@require_admin
def get_class_roster(db, user):
	q = dict(request.query)

	block = q['block']
	name = q['name']
	subsection = q['subsection'] if q['subsection'] else ""
	teacher = q['teacher']

	if not block or not name or not teacher:
		abort(400, "Invalid Query")

	return {
		"roster": query(db, "select * from student_schedules join students ON student_schedules.student_id = students.student_id where block = ? and class_name = ? and subsection = ? and teacher = ?", block, name, subsection, teacher, symbolize_names=False),
		"waitlist": query(db, "select * from waitlist join students ON waitlist.student_id = students.student_id where block = ? and name = ? and subsection = ? and teacher = ?", block, name, subsection, teacher, symbolize_names=False),
		"class": query(db, "select * from classes_avail where block = ? and name = ? and subsection = ? and teacher = ?", block, name, subsection, teacher, symbolize_names=False)[0],
	}

@delete("/teacher/remove/<id>")
@require_admin
def teacher_delete_ticket(db, user, id):
	# Check that the ticket exists and is owned by the currently logged in user
	r = query(db, "select * from student_schedules where id = ?", id)
	if len(r) == 0:
		abort(400, "Bad ticket ID specified - either the ticket does not exist")
		
	query(db, "delete from student_schedules where id = ?", id)

	db.commit()
	return {}

@route("/teacher/allstudents")
@require_admin
def get_all_students(db, user):
	return {"students": query(db, "select * from students order by student_username", symbolize_names=False)}

@route("/teacher/getstudentschedule")
@require_admin
def get_student_schedule(db, user):
	q = dict(request.query)

	student_id = q['student_id']
	if not student_id:
		abort(400, "Invalid Query")

	return {
		"schedule": query(db, "select * from student_schedules where student_id = ?", student_id, symbolize_names=False),
		"waitlist": query(db, "select * from waitlist where student_id = ?", student_id, symbolize_names=False),
	}

@delete("/teacher/waitlist")
@require_admin
def teacher_delete_waitlist(db, user):
	q = dict(request.query)

	block = q['block']
	name = q['name']
	subsection = q['subsection'] if q['subsection'] else ""
	teacher = q['teacher']
	student_id = q['student_id']

	if not block or not name or not teacher or not student_id:
		abort(400, "Invalid deletion request")

	r = query(db, "select 1 from waitlist where block = ? and name = ? and subsection = ? and teacher = ? and student_id = ?", block, name, subsection, teacher, student_id)
	if len(r) == 0:
		abort(400, "Bad waitlist entry specified")

	commit(db, "delete from waitlist where block = ? and name = ? and subsection = ? and teacher = ? and student_id = ?", block, name, subsection, teacher, student_id)
	return {}

@route("/teacher/export")
@require_admin
def export(db, user):
	f = io.StringIO()
	c = csv.DictWriter(f, fieldnames=["block", "class_name", "subsection", "teacher", "course_code", "student_id", "student_name", "waitlisted", "waitlist_reason"])
	q = query(db, """
	select t.block, t.class_name, t.subsection, t.teacher, c.course_code, t.student_id, s.student_username as student_name,
				 "" as waitlisted, "" as waitlist_reason
			from student_schedules t
			left join classes c
					on  c.block = t.block
					and c.name = t.class_name
					and c.subsection = t.subsection
					and c.teacher = t.teacher
			left join students s
					on  s.student_id = t.student_id
	""", symbolize_names = False)
	c.writeheader()
	for r in q:
		c.writerow(r)
	q = query(db, """
	select w.block, w.name as class_name, w.subsection, w.teacher, c.course_code, w.student_id, s.student_username as student_name, "WAITLISTED" as waitlisted, note as waitlist_reason
			from waitlist w
			left join classes c
					on  c.block = w.block
					and c.name = w.name
					and c.subsection = w.subsection
					and c.teacher = w.teacher
			left join students s
					on  s.student_id = w.student_id
	""", symbolize_names = False)
	for r in q:
		c.writerow(r)
	f.seek(0)
	response.content_type = 'application/csv'
	response.set_header("content-disposition", "attachment; filename=\"export.csv\"")
	return f.read()


@route("/<filename:path>")
def static(filename):
	if "client_secret.txt" in filename or "schedule.db" in filename:
		abort(403, "Permission denied")
	return static_file(filename, root=root)

@error(403)
def error403(err):
	return err.body

@error(400)
def error400(err):
	return err.body 

init_db()
run(host="127.0.0.1", port="8080", debug=True)
