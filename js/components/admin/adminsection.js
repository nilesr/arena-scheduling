var AdminSectionList = (props) => {
	return <table style={{margin: "10px 2.5%", width: "95%"}}>
		<thead>
			<tr>
				<th>Class</th>
                <th>Teacher</th>
				<th>Block</th>
				<th>Enrollment</th>
				<th className="center">Class Roster</th>
			</tr>
		</thead>
		<tbody>
			{props.classes.map(c => {
				var filled = c.remaining_slots <= 0;
				return <tr key={c.name + c.subsection + c.teacher + c.block}>
					<td><ClassName cls={c} /></td>
                    <td>{c.teacher}</td>
					<td>{c.block == "P" ? "PM" : c.block}</td>
					<td className={filled ? "red" : (c.remaining_slots <= 5 ? "gold" : "")} style={{fontWeight: "bold"}}>({c.cap - c.remaining_slots}/{c.cap})</td>
                    <td className="center">
						<a className="button button-outline" key={"button-" + (c.name + c.subsection + c.teacher + c.block)} onClick={() => props.setCurClass(c) }>View Class Roster</a>
					</td>
				</tr>;
			})}
		</tbody>
	</table>
}
window.AdminSectionList = AdminSectionList;
