class StudentsList extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return JSON.stringify(this.props.students)
    }
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
                students: t['students']
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

        return <div className="admin-student-list"><ExpandoScroll type="dark" preview="Find a Student" open={true}>
            <div>
			<input className="search" style={{marginTop: '1%', marginBottom: '2%'}} placeholder="Search for a student" value={this.state.i} onChange={(evt) => this.setState({i: evt.target.value})} />
			</div>
            <div className="linebreak"></div>
            <div style={{overflowY: 'auto'}}>
                {this.state.loading
                    ? "Loading..."
                    : this.state.errMsg
                        ? this.state.errMsg
                        : <StudentsList students={this.state.students} />}
            </div>
            </ExpandoScroll>
            </div>
    }
}

window.AdminStudentSearch = AdminStudentSearch