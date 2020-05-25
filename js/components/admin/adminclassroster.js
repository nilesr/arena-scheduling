class AdminClassRosterTable extends React.Component {
    
    constructor(props) {
        super(props);

        this.removeStudent = this.removeStudent.bind(this)
    }

    removeStudent(student) {
        
        let c = this.props.class
        let className = "{0} ({1} block) - {2}".format((c.subsection ? c.subsection : c.name), (c.block == "P" ? "PM" : c.block), c.teacher)

        if (!confirm("Are you ABSOLUTELY sure you would like to remove " + student.student_username + " (" + student.student_id +  ") from " + className + "?")) return;
	    netDelete("/teacher/remove/" + student.id, () => {console.log('removed')}, (e) => { window.alert("There was an error deleting your ticket: " + e); })

    }

    render() {
        
        let c = this.props.class
        let className = "{0} ({1} block) - {2}".format((c.subsection ? c.subsection : c.name), (c.block == "P" ? "PM" : c.block), c.teacher)

        let body = <tr><td colSpan="3" style={{textAlign: "center"}}>No students enrolled</td></tr>
        if (this.props.roster.length != 0)
        {
            body = this.props.roster.map((student) => 
                <tr key={student.id}>
                    <td>{student.student_username}</td>
                    <td>{student.student_id}</td>
                    <td><a className="button button-outline"  key={"button-" + (c.name + c.subsection + c.teacher + c.block)} onClick={() => this.removeStudent(student) }>Remove</a></td>
                </tr>)
        }
        
        return (
        [
        <div key="class-roster-title" className="class-roster-title">{className}</div>,
        <div key="linebreak" className="linebreak"></div>,
        <div key="table" style={{overflowY: 'auto'}}>
            <table style={{margin: "10px 2.5%", width: "95%"}}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody>
                {body}
            </tbody>
	        </table>
        </div>])
    }
}


class AdminClassRoster extends React.Component {

    constructor(props) {
        super(props);
        
        this.queryClass = this.queryClass.bind(this);

        this.state = {
            loading: false,
            curClass: null,
            errMsg: null
        };
    }

    queryClass() {

        this.setState({
            ...this.state,
            curClass: this.props.curClass,
            loading: true
        })

        let c = this.props.curClass
        get("/roster", {
            'name': c.name,
            'subsection': c.subsection,
            'teacher': c.teacher,
            'block': c.block
        }, 
        (t) => {

            /* discard */
            if (c != this.props.curClass) {
                return
            }

            if (t['roster'] == undefined) {
                this.setState({
                    ...this.state,
                    loading: false,
                    errMsg: 'Failed to load class. Please try again later'
                })
                return
            }

            this.setState({
                ...this.state,
                loading: false,
                errMsg: null,
                roster: t['roster']
            })
        },
        (e) => {

            /* discard */
            if (c != this.props.curClass) {
                return
            }

            this.setState({
                ...this.state,
                loading: false,
                errMsg: 'Failed to load class. Please try again later'
            })
        })
    }

    componentDidUpdate() {
        if (this.state.curClass != this.props.curClass) {
            this.queryClass()
        }
    }

    render() {

        let c = this.state.curClass
        let preview = "Class Roster"

        return (
        <div className="class-roster">
            <ExpandoScroll type="dark" preview={preview} open={true}>
                {this.state.curClass 
                    ? this.state.loading
                        ? 'Loading...'
                        : this.state.errMsg != null
                            ? this.state.errMsg
                            : <AdminClassRosterTable roster={this.state.roster} class={this.state.curClass} />
                    : "Please select a class from the list"}
            </ExpandoScroll>
        </div>)
    }
}

window.AdminClassRoster = AdminClassRoster;
