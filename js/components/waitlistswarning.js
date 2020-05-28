var killWaitlist = function killWaitlist(w, oc) {
	if (!confirm("Are you sure you want to remove yourself from the waitlist for this class?")) return;
	var args = {
		block: w.block,
		name: w.name,
		subsection: w.subsection,
		teacher: w.teacher
	}
	netDelete("/waitlist", args, oc, (e) => { window.alert("There was an error deleting your waitlist entry: " + e); oc() })
}

var WaitlistsWarning = function WaitlistsWarning(props) {
	var n = props.waitlists.length
	var [open, setOpen] = React.useState(false);
	return <li className="navigation-item">
		<Alert variant="danger" static={true}>
			<div style={{cursor: "pointer"}} onClick={() => setOpen(true)}>
				<i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
				Waitlisted for {n} {n  == 1 ? "class" : "classes"}
			</div>
		</Alert>
		<Modal open={open} onClose={() => setOpen(false)}>
			<table style={{lineHeight: "initial"}}>
				<thead>
					<tr>
						<th>Name</th>
						<th>Block</th>
						<th>Teacher</th>
						<th>Note</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{props.waitlists.map((w, i) => {
						return <tr key={i}>
							<td>{w.subsection == "" ? w.name : w.subsection}</td>
							<td>{w.block}</td>
							<td>{w.teacher}</td>
							<td>{w.note}</td>
							<td><a className="button" onClick={() => killWaitlist(w, props.onChange)}>Delete</a></td>
						</tr>;
					})}
				</tbody>
			</table>
		  </Modal>
	</li>;
}

window.WaitlistsWarning = WaitlistsWarning;
