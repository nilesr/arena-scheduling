#!/usr/bin/env python3
import csv, sqlite3, sys, random, os
random.seed(0x1032547698badcfe) # sleeveless
sys.path.insert(0, ".")
from db import get_db, init_db, query
init_db()
db = get_db()

root = os.path.dirname(os.path.realpath(__file__))

base_time = 1654695000 #remember to update. current: wed jun 08 2022
tdeltasec = 30 * 3  #180 for daily, 90 for half day blocks

grades = {8: [], 9: [], 10: [], 11: []}
for row in csv.reader(open(root + "/students.csv")):
    grades[int(row[0])].append(row[1])

students = []
for grade in range(8, 12):		#TODO fix :D
    offset = 0
    days = 0
    if grade == 9  or grade == 8:
        days = 1
    if grade == 8 or grade == 10:
        offset = 9000    #+2.5 hours from 930 to 12

    dsec = days * 3600 * 24
    random.shuffle(grades[grade])
    for i, student in enumerate(grades[grade]):
        time_allowed_in = base_time + dsec + (i * tdeltasec) + offset  #unix time lowkey stupid
        students.append([student, time_allowed_in, i])

c = db.cursor()
i = 0
for student in students:
    i += 1
    print(student)
    c.execute("insert into students (student_id, student_username, time_allowed_in, num) values (?, NULL, ?, ?)", student)

print(i)
db.commit()
db.close()
