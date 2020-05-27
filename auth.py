#!/usr/bin/env python3
import os, base64, sys, re
sys.path.insert(0, ".")
from db import get_db, query, commit
sys.path.remove(".")


def try_login(email, name):
	db = get_db()
	if email in ["nilesrogoff@gmail.com", "mcdasethan2@gmail.com"]:
		email = "niles.rogoff@apsva.us"
	if email in ["ethan_sattler@brown.edu", "nilesr@vt.edu"]:
		email = "985764@apsva.us"
	if email.endswith("@apsva.us"):
		student_id = email.replace("@apsva.us", "")
	else:
		return False, "The email address does not end in @apsva.us"
	username_query = query(db, "select student_username from students where student_id = ?", student_id)
	if len(username_query) == 0:
		if is_admin(student_id):
			commit(db, "insert into students (student_id, student_username, time_allowed_in, num) values (?, ?, 0, NULL)", student_id, name)
		else:
			db.close()
			return False, "No user exists with the student ID " + student_id
	elif not username_query[0].student_username:
		commit(db, "update students set student_username = ? where student_id = ?", name, student_id)
	r = query(db, "select session_id from sessions where student_id = ?", student_id)
	if len(r) > 0:
		return True, r[0].session_id.decode("utf-8")
	cookie = base64.b64encode(os.urandom(128))
	commit(db, "insert into sessions (session_id, student_id) values (?, ?)", cookie, student_id)
	db.close()
	return True, cookie.decode("utf-8")

def try_auth(request, db):
	c = request.get_cookie("auth")
	if not c: return False
	r = query(db, "select student_id from sessions where session_id = ?", c.encode("utf-8"))
	if len(r) == 0: return False
	return r[0].student_id

def is_admin(user):
	return not user.isnumeric()
