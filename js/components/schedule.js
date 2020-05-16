var killTicket = function killTicket(id, oc) {
	if (!confirm("Are you ABSOLUTELY sure you would like to remove this class from your schedule? Your spot will be released and may be taken by someone else.")) return;
	netDelete("/tickets/" + id, oc, (e) => { window.alert("There was an error deleting your ticket: " + e); })
}

class Schedule extends React.Component {
	render() {
		if (this.props.tickets.length == 0) return "Not registered for any classes";
		var tickets = this.props.tickets
		tickets.sort(((a, b) => a.block.localeCompare(b.block)))
		return <table>
			<thead>
				<tr>
					<th>Block</th>
					<th>Course Code</th>
					<th>Name</th>
					<th>Teacher</th>
					<th>Room</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{this.props.tickets.map((t, i) => {
					var c = this.props.classes.filter(c => c.name == t.class_name && c.teacher == t.teacher && c.block == t.block)[0]
					return <tr key={i}>
							<td>{t.block}</td>
							<td>{c.course_code}</td>
							<td>{t.subsection == "" ? t.class_name : <span>{t.subsection}<span className="light"> ({t.class_name})</span></span>}</td>
							<td>{t.teacher}</td>
							<td>{c.room}</td>
							<td>
								<a className="button" onClick={() => killTicket(t.id, this.props.onChange)}>
									<i className="fa fa-trash" aria-hidden="true" />
								</a>
							</td>
						</tr>
				})}
			</tbody>
			</table>;
	}
}
window.Schedule = Schedule;


