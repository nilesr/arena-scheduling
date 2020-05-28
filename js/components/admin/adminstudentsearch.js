class StudentRow extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let c = this.props.student
        return <tr key={c.student_id}>
            <td>{c.student_username ? c.student_username : "TBD"}</td>
            <td>{c.student_id}</td>
            <td><a className="button button-outline"  key={"button-student-" + (c.student_id)} onClick={() => this.props.setCurStudent(c) }>View Schedule</a></td>
        </tr>
    }
}


class StudentsList extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let body = <tr><td colSpan="3" style={{textAlign: "center"}}>No students</td></tr>
        if (this.props.students.length > 0) {
            body = this.props.students.map(s => {
                return <StudentRow key={"row-" + s.student_id} id={s.student_id} student={s} setCurStudent={this.props.setCurStudent} />
            })
        }

        return <table style={{margin: "10px 2.5%", width: "95%"}}>
		<thead>
			<tr>
				<th>Name</th>
				<th>Student ID</th>
				<th className="center">View Schedule</th>
			</tr>
		</thead>
		<tbody>
            {body}
        </tbody>
        </table>
    }
}

var replaceAll = function replaceAll(s, b, a) {
	while (s.indexOf(b) >= 0) {
		s = s.replace(b, a);
	}
	return s;
}

var filterStudents = function filterStudents(cs, i) {
    
    if (i == "") {
        return cs
    }

	i = replaceAll(i, "/", " ").toLowerCase().split(" ")
	cs = cs.filter(c => {
		var ck = replaceAll(((c.student_username ? c.student_username : '') + c.student_id).toLowerCase(), "/", " ")
		for (let j = 0; j < i.length; j++) {
			if (ck.indexOf(i[j]) < 0) return false;
		}
		return true;
	})
	cs.sort((a, b) => {
		var an = (a.student_username ? a.student_username : 'TBD') 
		var bn = (b.student_username ? b.student_username : 'TBD') 
		var c1 = an.localeCompare(bn)
        if (c1 != 0) return c1;
        
		return a.student_id.toString().localeCompare(b.toString().student_id)
	})
	return cs
}



class AdminStudentSearch extends React.Component {

    constructor(props) {
        super(props)
		this.state = {
            i: "",
            loading: true,
            errMsg: null,
            students: []
        };

        this.fetchStudents = this.fetchStudents.bind(this)

    }

    componentDidMount() {
        this.fetchStudents()
    }

    fetchStudents() {
        
        get("/teacher/allstudents", {},
        (t) => {

            if (t['students'] == undefined) {
                this.setState({
                    ...this.state,
                    loading: false,
                    errMsg: 'Failed to load students. Please try again later'
                })
                return
            }

            this.setState({
                ...this.state,
                loading: false,
                errMsg: null,
                students: t['students'].filter(s => Number.isInteger(s.student_id))
            })
        },
        (e) => {
            this.setState({
                ...this.state,
                loading: false,
                errMsg: 'Failed to load students. Please try again later'
            })
        })
    }

    render() {

        return <div className="admin-student-list"><ExpandoScroll type="dark" preview="Find a Student" icon="address-card-o">
            <div>
			<input className="search" style={{marginTop: '1%', marginBottom: '2%'}} placeholder="Search for a student" value={this.state.i} onChange={(evt) => this.setState({i: evt.target.value})} />
			</div>
            <div className="linebreak"></div>
            <Alert variant="warning" children="The names of students who have never logged in will show up as 'TBD'" />
            <div style={{overflowY: 'auto'}}>
                {this.state.loading
                    ? "Loading..."
                    : this.state.errMsg
                        ? this.state.errMsg
                        : <StudentsList students={filterStudents(this.state.students, this.state.i)} setCurStudent={this.props.setCurStudent} />}
            </div>
            </ExpandoScroll>
            </div>
    }
}

window.AdminStudentSearch = AdminStudentSearch
