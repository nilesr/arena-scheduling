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

class Classes extends React.Component {
	render() {
		var used_blocks = this.props.tickets.map(t => t.block);
		var cats = groupBy(this.props.classes, e => e.category)
		var catkeys = Object.keys(cats)
		//catkeys.sort();
		return <div className="classes">
			{catkeys.map((cat) => {
				return <div key={cat}>
					<h3>Category {cat}</h3>
					{renderCat(cats[cat], this.props.onChange, used_blocks, this.props.tickets)}
				</div>;
			})}
		</div>;
	}
}
window.Classes = Classes;

