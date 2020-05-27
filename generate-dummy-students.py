#!/usr/bin/env python3
import os, sqlite3, collections, string, random, names

root = os.path.dirname(os.path.realpath(__file__))

def _make_valid_ident(i):
	if i[0] not in (string.ascii_letters + "_"):
		i = "sql_" + i[0]
	return "".join([c if c in (string.ascii_letters + string.digits + "_") else "_" for c in i])

def _try_symbolize_names_for_sql(l):
	l = {_make_valid_ident(k): v for k, v in l.items()}
	cls = collections.namedtuple("t", l.keys())
	old_getitem = cls.__getitem__
	cls.__getitem__ = lambda self, k: l[k] if isinstance(k, str) else old_getitem(self, k)
	return cls(**l)


def query(db, q, *args, symbolize_names =  True):
	c = db.cursor()
	c.execute(q, args) # no splat!
	return [(_try_symbolize_names_for_sql if symbolize_names else lambda i: i)({c.description[i][0]: v for i, v in enumerate(row)}) for row in c.fetchall()]

def commit(db, q, *args, symbolize_names =  True):
	c = db.cursor()
	c.execute(q, args) # no splat!
	r = c.lastrowid
	db.commit()
	return r

def get_db():
	return sqlite3.connect(root + "/schedule.db")

db = get_db()
c = db.cursor()

for i in range(15):

    student_id = random.randint(1000000, 2000000)
    c.execute("""
    INSERT INTO `students`(`student_id`,`student_username`,`time_allowed_in`) VALUES (?,?,?);
    """, (names.get_full_name(), student_id, 0))

    c.execute("""
    INSERT INTO `student_schedules`(`student_id`,`block`,`class_name`,`subsection`,`teacher`) VALUES (?,?,?,?,?);
    """, (student_id, "B", "AP Modern Europe", "", "David"))

    db.commit()
    db.close()