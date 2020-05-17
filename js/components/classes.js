var renderClass = function renderClass(name, classes, oc, used_blocks, tickets) {
	return <ClassRow key={name}
	                 classes={classes}
					 used_blocks={used_blocks}
					 onChange={oc}
					 tickets={tickets}
		   />;
}

var renderCat = function renderCat(classes, oc, used_blocks, tickets) {
	var names = groupBy(classes, c => c.name + c.teacher)
	var namkeys = Object.keys(names)
	//namkeys.sort();
	return <div key={classes[0].category}>
		{namkeys.map((name) => {
			return renderClass(name, names[name], oc, used_blocks, tickets);
		})}
	</div>;
}

var replaceAll = function replaceAll(s, b, a) {
	while (s.indexOf(b) >= 0) {
		s = s.replace(b, a)
	}
	return s;
}

var filterClasses = function filterClasses(cs, i) {
	i = replaceAll(i, "/", " ").toLowerCase().split(" ")
	cs = cs.filter(c => {
		var ck = replaceAll(((c.subsection == "" ? c.name : c.subsection) + " " + c.teacher + " " + c.course_code).toLowerCase(), "/", " ")
		for (let j = 0; j < i.length; j++) {
			if (ck.indexOf(i[j]) < 0) return false;
		}
		return true;
	})
	cs.sort((a, b) => {
		var an = a.subsection == "" ? a.name : a.subsection
		var bn = b.subsection == "" ? b.name : b.subsection
		var c1 = an.localeCompare(bn)
		if (c1 != 0) return c1;
		var c2 = a.teacher.localeCompare(b.teacher)
		if (c2 != 0) return c2;
		return a.block.localeCompare(b.block)
	})
	return cs
}

class Classes extends React.Component {
	constructor(props) {
		super(props)
		this.state = {i: ""};
	}
	render() {
		var used_blocks = this.props.tickets.map(t => t.block);
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
							{renderCat(cats[cat], this.props.onChange, used_blocks, this.props.tickets)}
						</div>;
					})
				: <SectionList tickets={this.props.tickets}
							   classes={filterClasses(this.props.classes, this.state.i)}
							   used_blocks={used_blocks}
							   onChange={this.props.onChange}
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
window.Classes = Classes;

