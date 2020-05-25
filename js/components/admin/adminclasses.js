class AdminClasses extends React.Component {
	constructor(props) {
		super(props)
		this.state = {i: ""};
	}
	render() {
		var cats = groupBy(this.props.classes, e => e.category)
		var catkeys = Object.keys(cats)
		return <div className="classes">
			<input className="search" placeholder="Search for classes" value={this.state.i} onChange={(evt) => this.setState({i: evt.target.value})} />
			
		</div>;
	}
	componentDidMount() {
		if (this.props.cat) {
			var ch = document.getElementById("cat-" + this.props.cat);
			window.scrollTo(0, ch.offsetTop)
		}
	}
}
window.AdminClasses = AdminClasses;
