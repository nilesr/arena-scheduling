#!/usr/bin/env python3
import os, sys,time
from bottle import request, response, route, static_file, post, run, abort, error
sys.path.insert(0, ".")
import auth
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
		return fn(db, user, *args, **kwargs)
	return newfn

def time_checked(fn):
	@authenticated
	def newfn(db, user, *args, **kwargs):
		time_allowed = query(db, "select time_allowed_in from students where student_id = ?", user)[0].time_allowed_in
		if time_allowed < time.time():
			abort(403, {"error": "Too early", "time_allowed_in": time_allowed})
		return fn(db, user, *args, **kwargs)
	return newfn

@route("/")
def index():
	return static_file("/index.html", root=root)

@route("/<filename:path>")
def static(filename):
	return static_file(filename, root=root)

@post("/login")
def login():
	time.sleep(0.5) # simulate network conditions - TODO remove me
	succ, stat = auth.try_login(request.forms.get("user"), request.forms.get("pass"))
	if not succ:
		abort(403, stat)
	response.set_cookie("auth", stat)
	return {"auth": stat}

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
	time.sleep(0.5) # simulate network conditions - TODO remove me
	tickets = query(db, "select * from student_schedules where student_id = ?", user, symbolize_names=False)
	name = query(db, "select student_username from students where student_id = ?", user)[0].student_username
	return {"tickets": tickets, "name": name}

@route("/classes")
@with_db
def get_classes(db):
	return {"classes": query(db, "select * from classes", symbolize_names=False)}

@error(403)
def error403(err):
	return err.body

init_db()
run(host="127.0.0.1", port="8080", debug=True)
