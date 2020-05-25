var renderClass = function renderClass(name, classes, oc, setCurClass) {
	return <AdminClassRow key={name}
	                 classes={classes}
                     onChange={oc}
                     setCurClass={setCurClass}
		   />;
}

var renderCat = function renderCat(classes, oc, setCurClass) {
	var names = groupBy(classes, c => c.name + c.teacher)
	var namkeys = Object.keys(names)
	//namkeys.sort();
	return <div key={classes[0].category}>
		{namkeys.map((name) => {
			return renderClass(name, names[name], oc, setCurClass);
		})}
	</div>;
}


class AdminClasses extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
            i: ""
        };
	}
	render() {
        
        console.log(this.props)
        var cats = groupBy(this.props.classes, e => e.category)
        var catkeys = Object.keys(cats)
        
		return <div className="classes">
			<input className="search" placeholder="Search for classes" value={this.state.i} onChange={(evt) => this.setState({i: evt.target.value})} />
			{this.state.i == ""
				? catkeys.map((cat) => {
						return <div key={cat}>
							<h3 id={"cat-" + cat}>
							{
								this.props.cat == cat
								? <mark>{catnames[cat]}</mark>
								: catnames[cat]
							}
							</h3>
							{renderCat(cats[cat], this.props.onChange, this.props.setCurClass)}
						</div>;
					})
				: <SectionList classes={filterClasses(this.props.classes, this.state.i)}
							   onChange={this.props.onChange} setCurClass={this.props.setCurClass}
					/>
			}
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
