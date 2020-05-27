var getBtnClass = function getBtnClass(i, tabi) {
	var r = "button button-large tabbutton"
	if (i != tabi) r += " button-outline"
	return r;
}

class AdminView extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            cat: null,
            stale: 0
        };


        this.onChange = this.onChange.bind(this)
    }


    onChange() {

        this.props.onChange()

        this.setState({
            ...this.state,
            stale: this.state.stale + 1
        })
    }

    
    render() {
        return (<div><AdminTabs tickets={this.props.tickets} classes={this.props.classes} onChange={this.onChange} stale={this.state.stale} cat={this.state.cat}/></div>);
    }
}

window.AdminView = AdminView