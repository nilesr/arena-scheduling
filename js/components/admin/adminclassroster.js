class AdminClassRosterTable extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        
        console.log(this.props)
        let c = this.props.class
        let className = "{0} ({1} block) - {2}".format((c.subsection ? c.subsection : c.name), (c.block == "P" ? "PM" : c.block), c.teacher)

        let body = <tr><td colSpan="3" style={{textAlign: "center"}}>No students enrolled</td></tr>
        if (this.props.roster.length != 0)
        {
            body = this.props.roster.map((student) => 
                <tr key={student.student_id}>
                    <td>{student.student_username}</td>
                    <td>{student.student_id}</td>
                    <td>remove</td>
                </tr>)
        }
        
        console.log(body)
        return (
        <div>
        <div className="class-roster-title">{className}</div>
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
	</table></div>)
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
        if (c && 0) {
            preview = "Class Roster: " + c.name + c.subsection + c.teacher + (c.block == "P" ? "PM" : c.block)
        }

        console.log(this.props)
        return (
        <div className="class-roster" style={{position: "absolute"}}>
            <Expando type="dark" preview={preview} open={true}>
                {this.state.curClass 
                    ? this.state.loading
                        ? 'Loading...'
                        : this.state.errMsg != null
                            ? this.state.errMsg
                            : <AdminClassRosterTable roster={this.state.roster} class={this.state.curClass} />
                    : "Please select a class from the list"}
            </Expando>
        </div>)
    }
}

window.AdminClassRoster = AdminClassRoster;
