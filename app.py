#!/usr/bin/env python3
import os, sys
from bottle import request, response, route, static_file, post, run
sys.path.insert(0, ".")
import auth
from db import get_db, init_db, query
sys.path.remove(".")

root = os.path.dirname(os.path.realpath(__file__))

def authenticated(fn):
	def newfn(*args, **kwargs):
		user = auth.try_auth(request)
		if not user: return "Permission denied"
		return fn(user, *args, **kwargs)
	return newfn

def with_db(fn):
	def newfn(*args, **kwargs):
		db = get_db()
		r = fn(db, *args, **kwargs)
		db.close()
		return r
	return newfn

@route("/")
def index():
	return static_file("/index.html", root=root)

@route("/<filename:path>")
def static(filename):
	return static_file(filename, root=root)

@post("/login")
def login():
	succ, stat = auth.try_login(request.forms.get("user"), request.forms.get("pass"))
	if not succ:
		return stat
	response.set_cookie("auth", stat)
	return "OK"

@route("/tickets")
@authenticated
@with_db
def get_tickets(db, user):
	tickets = query(db, "select * from student_schedules where student_id = ?", user, symbolize_names=False)
	return {"tickets": tickets}

@route("/classes")
@with_db
def get_classes(db):
	return {"classes": query(db, "select * from classes")}


init_db()
run(host="127.0.0.1", port="8080", debug=True)
