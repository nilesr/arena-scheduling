class AdminClassRoster extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
        };
    }
    
    render() {
        return this.props.curClass ? JSON.stringify(this.props.curClass) : "please select a class";
    }
}

window.AdminClassRoster = AdminClassRoster;
