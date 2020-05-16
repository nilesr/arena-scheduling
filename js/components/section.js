var schedule = function schedule(c, oc) {
	var obj = {
		block: c.block,
		name: c.name,
		subsection: c.subsection,
		teacher: c.teacher
	}
	put("/tickets", obj, oc, e => { window.alert(e); oc(); })
}

var Section = (props) => {
	var blocks = groupBy(props.classes, c => c.block)
	return <table style={{margin: "10px 2.5%", width: "95%"}}>
		<thead>
			<tr>
				<th>Class</th>
				{props.classes[0].subsection == "" ? null : <th>Section</th>}
				<th>Block</th>
				<th>Remaining Seats</th>
				<th className="center">Add To Schedule</th>
			</tr>
		</thead>
		<tbody>
			{Object.keys(blocks).map(block => {
				var classes = blocks[block];
				if (classes.length != 1) {
					alert("fuck");
				}
				var c = classes[0];
				var used = props.used_blocks.indexOf(block) >= 0
				var filled = c.remaining_slots <= 0;
				var allowed = !used && !filled
				return <tr key={block}>
					<td>{c.name}</td>
					{c.subsection == "" ? null : <td>{c.subsection}</td>}
					<td>{c.block}</td>
					<td className={filled ? "red" : (c.remaining_slots <= 5 ? "gold" : "")} style={{fontWeight: "bold"}}>{c.remaining_slots}</td>
					<td className="center"><a className="button button-outline" disabled={allowed ? null : "disabled"} onClick={() => schedule(c, props.onChange)}>Add To Schedule ({c.block} Block)</a></td>
				</tr>;
			})}
		</tbody>
	</table>
}
window.Section = Section;

