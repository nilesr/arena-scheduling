#!/usr/bin/env python3
import csv, sqlite3, sys, random, os
random.seed(0x1032547698badcfe) # sleeveless
sys.path.insert(0, ".")
from db import get_db, init_db, query
init_db()
db = get_db()

root = os.path.dirname(os.path.realpath(__file__))

base_time = 1591624800 #remember to update
tdeltasec = 60 * 3

grades = {8: [], 9: [], 10: [], 11: []}
for row in csv.reader(open(root + "/students.csv")):
	grades[int(row[1])].append(row[0])

students = []
for grade in range(8, 12):

    if grade == 11 or grade == 10:
        days = 0
    else if grades == 9  or grades == 8:
        days = 1
    else:
        days = 2

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
