#!/usr/bin/env python3
import csv, sqlite3, sys, random
sys.path.insert(0, ".")
from db import get_db, init_db, query
init_db()
db = get_db()

base_time = 1591624800
tdeltasec = 60 * 3

grades = {8: [], 9: [], 10: [], 11: []}
for row in csv.reader(open("/home/niles/students.csv")):
	grades[int(row[1])].append(row[0])

students = []
for grade in range(8, 12):
	days = 11-grade
	dsec = days * 3600 * 24
	random.shuffle(grades[grade])
	for i, student in enumerate(grades[grade]):
		time_allowed_in = base_time + dsec + (i * tdeltasec)
		students.append([student, time_allowed_in, i])

c = db.cursor()
for student in students:
	print(student)
	c.execute("insert into students (student_id, student_username, time_allowed_in, num) values (?, NULL, ?, ?)", student)

db.commit()
db.close()
