var getBtnClass = function getBtnClass(i, tabi) {
	var r = "button button-large tabbutton"
	if (i != tabi) r += " button-outline"
	return r;
}

class AdminView extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            cat: null
        };
    }
    
    render() {
        return (<div><AdminTabs tickets={this.props.tickets} classes={this.props.classes} onChange={this.props.onChange} cat={this.state.cat}/></div>);
    }
}

window.AdminView = AdminView