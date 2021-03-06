function removeStudent(c, student, tid, cbs, cbf) {
    let className = "{0} ({1} block) - {2}".format((c.subsection ? c.subsection : c.name), (c.block == "P" ? "PM" : c.block), c.teacher)

    if (!confirm("Are you ABSOLUTELY sure you would like to remove " + student.student_username + " (" + student.student_id +  ") from " + className + "?")) return;
    netDelete("/teacher/remove/" + tid, undefined, cbs, cbf);

}

var AdminScheduleTable = (props) => {
    let body = <tr><td colSpan="6">No classes</td></tr>
    if (props.schedule.length > 0) {
        body = props.schedule.map((t, i) => {
            var c = props.classes.filter(c => c.name == t.class_name && c.teacher == t.teacher && c.block == t.block)[0]
            return <tr key={i}>
                        <td>{t.block == "P" ? "PM" : t.block}</td>
                        <td>{c.course_code}</td>
                        <td><ClassName ticket={t} display_subsection={true} /></td>
                        <td>{t.teacher}</td>
                        <td>{c.room}</td>
                        <td className="printhide">
                                <a className="button" onClick={() => removeStudent(c, props.student, t.id, props.onChange,
                                    (e) => { window.alert("There was an error deleting your ticket: " + e)})}>
                                        <i className="fa fa-trash" aria-hidden="true" />
                                </a>
                        </td>
                </tr>;
        })
    }

    return <div>
            <div className="class-roster-title">{props.student.student_username} ({props.student.student_id})</div>
            {props.wl > 0 ? <div className="class-roster-title" style={{color: "red"}}>Waitlisted for {props.wl} class{props.wl > 1 ? "es" : ""}</div> : null}
            <table style={{margin: "10px 2.5%", width: "95%"}}>
               <thead>
                       <tr>
                               <th>Block</th>
                               <th>Course Code</th>
                               <th>Name</th>
                               <th>Teacher</th>
                               <th>Room</th>
                               <th className="printhide"></th>
                       </tr>
               </thead>
               <tbody>
                               {body}
               </tbody>
            </table>
        </div>;
}

class AdminStudentViewWaitlistTable extends React.Component {
    constructor(props) {
        super(props);
        this.removeWaitlist = this.removeWaitlist.bind(this)
    }
    removeWaitlist(c) {
        let className = "{0} ({1} block) - {2}".format((c.subsection ? c.subsection : c.name), (c.block == "P" ? "PM" : c.block), c.teacher)
        if (!confirm("Are you ABSOLUTELY sure you would like to remove " + this.props.student_username + " (" + c.student_id +  ") from the waitlist for " + className + "?")) return;
        var args = {
            block: c.block,
            name: c.name,
            subsection: c.subsection,
            teacher: c.teacher,
            student_id: c.student_id,
        }
	    netDelete("/teacher/waitlist", args, this.props.onChange, (e) => { window.alert("There was an error deleting your ticket: " + e); })
    }

    render() {
        
        var body = this.props.waitlist.map((w) => 
                <tr key={w.name + "-" + w.subsection + "-" + w.teacher + "-" + w.block}>
                    <td>{w.subsection == "" ? w.name : w.subsection}</td>
                    <td>{w.block}</td>
                    <td>{w.teacher}</td>
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
                    <th>Block</th>
                    <th>Teacher</th>
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


class Student extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <div style={{overflowY: 'auto'}}>
            <AdminScheduleTable classes={this.props.classes} schedule={this.props.schedule} student={this.props.student} onChange={this.props.onChange} wl={this.props.waitlist.length} />
            {this.props.waitlist.length > 0 
                ? <AdminStudentViewWaitlistTable waitlist={this.props.waitlist} schedule={this.props.schedule} student={this.props.student} onChange={this.props.onChange} />
                : null}
        </div>
    }
}

class AdminStudentView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            errMsg: null,
            curStudent: null,
            stale: props.stale
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

        if (!s) {
            return
        }


        get("/teacher/getstudentschedule", {
            student_id: s.student_id
        },
        (t) => {

            if (this.props.curStudent != s) {
                return
            }

            if (t.schedule == undefined) {
                this.setState({
                    ...this.state,
                    loading: false,
                    errMsg: 'Failed to load student schedule. Please try again later'
                })
                return
            }
            
            t.schedule.sort((a, b) => a.block.localeCompare(b.block));
            this.setState({
                ...this.state,
                loading: false,
                errMsg: null,
                schedule: t.schedule,
                waitlist: t.waitlist,
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

        if ((this.state.curStudent != this.props.curStudent && this.props.curStudent != null) || this.props.stale != this.state.stale) {

            if (this.props.stale != this.state.stale) {
                this.setState({
                    ...this.state,
                    stale: this.state.stale + 1
                }, () => {
                    this.fetchStudentSched()
                })

                return
            }

            this.fetchStudentSched()
        }
    }


    render() {
        return (
        <div className="admin-student-view">
            <ExpandoScroll type="dark" preview="Student Schedule" icon="user-circle-o">
                {this.state.curStudent
                    ? this.state.loading
                        ? 'Loading...'
                        : this.state.errMsg
                            ? this.state.errMsg
                            : <Student classes={this.props.classes} student={this.state.curStudent} schedule={this.state.schedule} onChange={this.props.onChange} waitlist={this.state.waitlist} />
                    : "Please select a student from the list"}
            </ExpandoScroll>
        </div>)
    }
}


window.AdminStudentView = AdminStudentView
