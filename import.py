#!/usr/bin/env python3
import csv, sqlite3, sys, random, os
sys.path.insert(0, ".")
from db import get_db, init_db, query
init_db()
db = get_db()

root = os.path.dirname(os.path.realpath(__file__))

c = db.cursor()
def esc(t):
	return t.replace("US/VA", "US_VA").replace("VA/US", "VA_US").replace("Film/Video", "Film_Video")
def unesc(t):
	return t.replace("US_VA", "US/VA").replace("VA_US", "VA/US").replace("Film_Video", "Film/Video")
category = 0
for row in csv.reader(open(root + "/schedule.csv")):
	if row[1].strip() == "" or row[3].strip() == "":
		category += 1
		continue
	blocks = row[3].replace(" ", "").replace(":", "").replace(";", "").replace("PM", "P")
	for block in blocks:
		title = esc(row[1])
		teacher = row[2]
		room = row[4]
		titles = title.split("/")
		if len(titles) != len(row[0].split("/")):
			titles = [title]
		cap = int(row[5]) if row[5] != "" else 999
		for i, subsection in enumerate(titles):
			if subsection == title:
				subsection = ""
				cc = row[0]
			else:
				cc = row[0].split("/")[i]
			n = [cc, block, unesc(title), unesc(subsection), teacher, room, category, cap]
			print(n)
			c.execute("insert into classes (course_code, block, name, subsection, teacher, room, category, cap) values (?, ?, ?, ?, ?, ?, ?, ?)", n)

db.commit()
db.close()
