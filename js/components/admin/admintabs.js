var getBtnClass = function getBtnClass(i, tabi) {
	var r = "button button-large tabbutton"
	if (i != tabi) r += " button-outline"
	return r;
}
var wrapSection = (s) => <section className="container" id="mainSection">{s}</section>

class AdminTabs extends React.Component
{
    constructor(props) {
        super(props)

        this.state = {
            cat: null,
            tab: 0,
            curClass: null,
            curStudent: null
        }

        this.setTab = this.setTab.bind(this)
        this.setCat = this.setCat.bind(this)
        this.setCurClass = this.setCurClass.bind(this)
        this.setCurStudent = this.setCurStudent.bind(this)

    }

    setTab(tab) {
        this.setState({...this.state, tab: tab})
    }

    setCat(cat) {
        this.setState({...this.state, cat: cat})
    }

    setCurClass(c) {
        this.setState({...this.state, curClass: c})
    }

    setCurStudent(student) {
        this.setState({...this.state, curStudent: student})
    }

    render() {
        let tabs  = [
            ["Class Rosters",
                [<AdminClassRoster key="admin-class-roster" curClass={this.state.curClass} onChange={this.props.onChange} />,
                 <AdminClasses key="admin-classes" classes={this.props.classes} setCurClass={this.setCurClass}  onChange={this.props.onChange} />]],
            ["Students", 
                [<AdminStudentView key="admin-student-view" classes={this.props.classes} curStudent={this.state.curStudent} onChange={this.props.onChange} />,
                 <AdminStudentSearch key="admin-student-search" setCurStudent={this.setCurStudent} onChange={this.props.onChange} />]],
            ["Export", <AdminExport />]
        ]
        return <div>
            <section className="container tabs-container">
                {tabs.map((tab, i) => {
                    return <a key={i} className={getBtnClass(i, this.state.tab)} onClick={() => { this.setCat(null); this.setTab(i); }}>{tabs[i][0]}</a>
                })}
            </section>
            {tabs.map((tab, i) => {
                return <div key={"tab" + i} style={{display: (i == this.state.tab) ? "initial" : "none"}}>{tabs[i][1]}</div>
            })}
        </div>;
    }
}

window.AdminTabs = AdminTabs;
