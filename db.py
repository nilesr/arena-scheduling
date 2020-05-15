#!/usr/bin/env python3
import os, sqlite3, collections, string

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
	db.commit()

def get_db():
	return sqlite3.connect(root + "/schedule.db")

def init_db():
	db = get_db()
	c = db.cursor()
	c.execute("""
	create table if not exists classes (
		name text not null,
		block char not null,
		subsection text not null default '',
		teacher text not null default 'Staff',
		cap int not null,
		unique(name, block, subsection),
		check(cap > 0)
	);
	""")
	c.execute("""
	create trigger if not exists classes_same_cap
	before insert on classes
	begin
		select raise(fail, "Classes with the same name and block must have the same cap") from classes where block = NEW.block and name = NEW.name and cap != NEW.cap;
	end;
	""")
	c.execute("create index if not exists classes_name_block on classes (name, block);")
	c.execute("""
	create table if not exists students (
		student_id int unique, -- PK
		student_username text,
		time_allowed_in int
	);
	""")
	c.execute("create index if not exists students_student_id on students (student_id);")
	c.execute("""
	create table if not exists student_schedules (
		stamp_id int primary key, -- for bryan
		student_id int, -- FK to students
		class_name text, -- composite FK to classes
		subsection text, -- composite FK to classes
		block char, -- composite FK to classes
		foreign key(student_id) references students(student_id)
	);
	""")
	c.execute("""
	create trigger if not exists student_schedules_fk
	before insert on student_schedules
	begin
		select (case when (select 1 from classes where block = NEW.block and name = NEW.class_name and subsection = NEW.subsection) is null
			then raise(fail, "Attempt to add a row to student_schedules that does not reference a row in classes")
			else 1 end);
		select (case when (select cap from classes where block = NEW.block and name = NEW.class_name limit 1) = (select count(*) from student_schedules where block = NEW.block and class_name = NEW.class_name)
			then raise(fail, "Adding a new row would exceed the cap for the class")
			else 1 end);
		select (case when (select 1 from student_schedules where student_id = NEW.student_id and block = NEW.block and class_name = NEW.class_name) is not null
			then raise(fail, "Attempt to add a new ticket for a class you already have a ticket for")
			else 1 end);
	end;
	""")
	c.execute("create index if not exists student_schedules_student_id on student_schedules (student_id);")
	c.execute("create index if not exists student_schedules_class_name_block on student_schedules (class_name, block);")
	c.execute("""
	create table if not exists sessions (
		session_id text unique not null, -- PK
		student_id int not null, -- FK to students
		foreign key(student_id) references students(student_id)
	);
	""")
	c.execute("create index if not exists sessions_session_id on sessions (session_id);")
	if len(c.execute("select 1 from students where student_id = ?", [941590]).fetchall()) == 0:
		c.execute("insert into students (student_id, student_username, time_allowed_in) values (?, ?, ?)", [941590, "Niles Rogoff", 0])
	db.commit()
	db.close()
