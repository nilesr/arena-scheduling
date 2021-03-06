class AdminClassRosterTable extends React.Component {
    
    constructor(props) {
        super(props);

        this.removeStudent = this.removeStudent.bind(this)
    }

    removeStudent(student) {
        
        let c = this.props.class
        let className = "{0} ({1} block) - {2}".format((c.subsection ? c.subsection : c.name), (c.block == "P" ? "PM" : c.block), c.teacher)

        if (!confirm("Are you ABSOLUTELY sure you would like to remove " + student.student_username + " (" + student.student_id +  ") from " + className + "?")) return;

	netDelete("/teacher/remove/" + student.id, undefined, this.props.onChange, (e) => { window.alert("There was an error deleting your ticket: " + e); })

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
                    <td><a className="button button-outline" onClick={() => this.removeStudent(student) }>Remove</a></td>
                </tr>)
        }
        
        return (
        [
        <div key="class-roster-title" className="class-roster-title">{className}</div>,
        (c.course_code != "" ? <div key="class-roster-cc" className="class-roster-title">Course code: {c.course_code}</div> : null),
        (c.waitlist > 0 ? <div className="class-roster-title" style={{color: "red"}} key="class-roster-waitlist-warning">{c.waitlist} waitlisted</div> : null),
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

class AdminClassRosterWaitlistTable extends React.Component {
    constructor(props) {
        super(props);
        this.removeWaitlist = this.removeWaitlist.bind(this)
    }
    removeWaitlist(student) {
        let c = this.props.class
        let className = "{0} ({1} block) - {2}".format((c.subsection ? c.subsection : c.name), (c.block == "P" ? "PM" : c.block), c.teacher)
        if (!confirm("Are you ABSOLUTELY sure you would like to remove " + student.student_username + " (" + student.student_id +  ") from the waitlist for " + className + "?")) return;
        var args = {
            block: c.block,
            name: c.name,
            subsection: c.subsection,
            teacher: c.teacher,
            student_id: student.student_id,
        }
	netDelete("/teacher/waitlist", args, this.props.onChange, (e) => { window.alert("There was an error deleting your ticket: " + e); })

    }

    render() {
        
        let c = this.props.class

        var body = this.props.waitlist.map((w) => 
                <tr key={w.student_id}>
                    <td>{w.student_username}</td>
                    <td>{w.student_id}</td>
                    <td>{w.note}</td>
                    <td><a className="button button-outline" onClick={() => this.removeWaitlist(w) }>Remove</a></td>
                </tr>)
        
        return (
        [
        <div key="table" style={{overflowY: 'auto'}}>
            <table style={{margin: "10px 2.5%", width: "95%"}}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Waitlist Reason</th>
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
            errMsg: null,
            stale: props.stale
        };
    }

    queryClass() {

        this.setState({
            ...this.state,
            curClass: this.props.curClass,
            loading: true
        })

        let c = this.props.curClass
        if (!c) {
            return
        }

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

            if (t.roster == undefined) {
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
                roster: t.roster,
                waitlist: t.waitlist,
                curClass: t.class,
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
        if (this.props.curClass != null
            && ((this.state.curClass == null && this.props.curClass != null)
                || this.state.curClass.block != this.props.curClass.block
                || this.state.curClass.name != this.props.curClass.name
                || this.state.curClass.subsection != this.props.curClass.subsection
                || this.state.curClass.teacher != this.props.curClass.teacher
                || this.props.stale != this.state.stale)
            ) {

            if (this.props.stale != this.state.stale) {
                this.setState({
                    ...this.state,
                    stale: this.state.stale + 1
                }, () => {
                    this.queryClass()
                })

                return
            }

            this.queryClass()
        }
    }

    render() {

        let c = this.state.curClass
        let preview = "Class Roster"

        return (
        <div className="class-roster">
            <ExpandoScroll type="dark" preview={preview} icon="id-card-o">
                {this.state.curClass 
                    ? this.state.loading
                        ? 'Loading...'
                        : this.state.errMsg != null
                            ? this.state.errMsg
                            : [
                                <AdminClassRosterTable key={0} roster={this.state.roster} class={this.state.curClass} onChange={this.props.onChange} />,
                                (this.state.waitlist.length > 0
                                    ? <AdminClassRosterWaitlistTable key={1} waitlist={this.state.waitlist} class={this.state.curClass} onChange={this.props.onChange} />
                                    : null)
                              ]
                    : "Please select a class from the list"}
            </ExpandoScroll>
        </div>)
    }
}

window.AdminClassRoster = AdminClassRoster;
