class Schedule extends React.Component {
	render() {
		if (this.props.tickets.length == 0) return "Not registered for any classes";
		var tickets = this.props.tickets
		tickets.sort(((a, b) => a.block.localeCompare(b.block)))
		return <table>
			<thead>
				<th>Block</th>
				<th>Course Code</th>
				<th>Name</th>
				<th>Teacher</th>
				<th>Room</th>
			</thead>
			<tbody>
				{this.props.tickets.map((t, i) => {
					var c = this.props.classes.filter(c => c.name == t.class_name && c.teacher == t.teacher && c.block == t.block)[0]
					return <tr key={i}>
							<td>{t.block}</td>
							<td>{c.course_code}</td>
							<td>{t.class_name + (t.subsection != "" ? " (" + t.subsection + ")" : "")}</td>
							<td>{t.teacher}</td>
							<td>{c.room}</td>
						</tr>
				})}
			</tbody>
			</table>;
	}
}
window.Schedule = Schedule;


