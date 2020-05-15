#!/usr/bin/env python3
import os, base64, sys
sys.path.insert(0, ".")
from db import get_db, query, commit
sys.path.remove(".")

def try_login(student_id, password):
	db = get_db()
	if len(query(db, "select * from students where student_id = ?", student_id)) == 0:
		db.close()
		return False, "No user exists with the student ID " + student_id
	if password != "pass":
		db.close()
		return False, "Password is incorrect"
	r = query(db, "select session_id from sessions where student_id = ?", student_id)
	if len(r) > 0:
		return True, r[0].session_id.decode("utf-8")
	cookie = base64.b64encode(os.urandom(128))
	commit(db, "insert into sessions (session_id, student_id) values (?, ?)", cookie, student_id)
	db.close()
	return True, cookie.decode("utf-8")

def try_auth(request):
	db = get_db()
	r = query(db, "select student_id from sessions where session_id = ?", request.get_cookie("auth").encode("utf-8"))
	if len(r) == 0: return False
	db.close()
	return r[0].student_id

