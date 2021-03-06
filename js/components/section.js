var schedule = function schedule(c, oc) {
	var obj = {
		block: c.block,
		name: c.name,
		subsection: c.subsection,
		teacher: c.teacher
	}
	put("/tickets", obj, oc, e => { window.alert(e); oc(); })
}

var waitlist = function waitlist(c, oc) {
	if (!confirm("Waitlisting a class should only be done when you cannot make your schedule work yourself. There is no guarentee that you will be admitted to this class. Are you sure you want to add yourself to the waitlist?")) return;
	do {
		var p = prompt("Please enter a description of why you cannot add the class. " + (p === undefined ? "" : " Your response must be at least 30 characters."), p)
	} while (p.length < 30);
	var obj = {
		block: c.block,
		name: c.name,
		subsection: c.subsection,
		teacher: c.teacher,
		note: p,
	}
	put("/waitlist", obj, oc, e => { window.alert(e); oc(); })
}

var SectionList = (props) => {
	return <table style={{margin: "10px 2.5%", width: "95%"}}>
		<thead>
			<tr>
				<th>Class</th>
				<th>Block</th>
				<th>Remaining Seats</th>
				<th className="center">Add To Schedule</th>
			</tr>
		</thead>
		<tbody>
			{props.classes.map(c => {
				var used = props.used_blocks.indexOf(c.block) >= 0
				var filled = c.remaining_slots <= 0 || c.locked == 1;
				var in_a_section = props.tickets.filter(t => t.class_name == c.name && t.teacher == c.teacher && t.subsection == c.subsection).length > 0;
				var in_this_section = props.tickets.filter(t => t.class_name == c.name && t.teacher == c.teacher && t.subsection == c.subsection && t.block == c.block).length > 0;
				var allowed = !used && !filled && !in_a_section;
				return <tr key={c.name + c.subsection + c.teacher + c.block}>
					<td><ClassName cls={c} /></td>
					<td>{c.block == "P" ? "PM" : c.block}</td>
					<td className={filled ? "red" : (c.remaining_slots <= 5 ? "gold" : "")} style={{fontWeight: "bold"}}>{(c.locked == 1) ? 0 : c.remaining_slots}</td>
					<td className="center">
						<a className="button button-outline" disabled={allowed ? null : "disabled"} onClick={() => schedule(c, props.onChange)}>
							{
								in_this_section
									? "You are in this section"
									: "Add To Schedule (" + (c.block == "P" ? "PM" : c.block) + " Block)"
							}
						</a>
						<a title="Waitlist" className="button button-outline waitlist-button" onClick={() => waitlist(c, props.onChange)}>
							<i className="fa fa-exclamation-triangle" />
						</a>
					</td>
				</tr>;
			})}
		</tbody>
	</table>
}
window.SectionList = SectionList;
