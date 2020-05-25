class Student extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return "ayyy"
    }
}

class AdminStudentView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            errMsg: null,
            curStudent: props.curStudent
        }
    }

    render() {
        return (
        <div className="admin-student-view">
            <ExpandoScroll type="dark" preview="Student Schedule" open={true}>
                {this.state.curStudent
                    ? <Student student={this.state.curStudent} />
                    : "Please select a student from the list"}
            </ExpandoScroll>
        </div>)
    }
}


window.AdminStudentView = AdminStudentView