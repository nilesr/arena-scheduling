class Student extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return JSON.stringify(this.props.student) +  JSON.stringify(this.props.schedule)
    }
}

class AdminStudentView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            errMsg: null,
            curStudent: null
        }

        this.fetchStudentSched = this.fetchStudentSched.bind(this)
    }

    fetchStudentSched() {

        let s = this.props.curStudent
        this.setState({
            ...this.state,
            loading: true,
            curStudent: s
        })


        get("/teacher/getstudentschedule", {
            student_id: s.student_id
        },
        (t) => {

            if (this.props.curStudent != s) {
                return
            }

            if (t['schedule'] == undefined) {
                this.setState({
                    ...this.state,
                    loading: false,
                    errMsg: 'Failed to load student schedule. Please try again later'
                })
                return
            }

            this.setState({
                ...this.state,
                loading: false,
                errMsg: null,
                schedule: t['schedule']
            })
        },
        (e) => {
            if (this.props.curStudent != s) {
                return
            }

            this.setState({
                ...this.state,
                loading: false,
                errMsg: 'Failed to student schedule. Please try again later'
            })
        })
    }

    componentDidUpdate() {
        if (this.state.curStudent != this.props.curStudent && this.props.curStudent != null) {
            this.fetchStudentSched()
        }
    }


    render() {
        return (
        <div className="admin-student-view">
            <ExpandoScroll type="dark" preview="Student Schedule" open={true}>
                {this.state.curStudent
                    ? this.state.load
                        ? 'Loading...'
                        : this.state.errMsg
                            ? this.state.errMsg
                            : <Student student={this.state.curStudent} schedule={this.state.schedule} />
                    : "Please select a student from the list"}
            </ExpandoScroll>
        </div>)
    }
}


window.AdminStudentView = AdminStudentView