var ScheduleTable = (props) =>
   <table>
	   <thead>
		   <tr>
			   <th>Block</th>
			   <th>Course Code</th>
			   <th>Name</th>
			   <th>Teacher</th>
			   <th>Room</th>
			   <th className="printhide"></th>
		   </tr>
	   </thead>
	   <tbody>
			   {props.tickets.map((t, i) => {
				   var c = props.classes.filter(c => c.name == t.class_name && c.teacher == t.teacher && c.block == t.block)[0]
				   return <tr key={i}>
							   <td>{t.block}</td>
							   <td>{c.course_code}</td>
							   <td><ClassName ticket={t} display_subsection={true} /></td>
							   <td>{t.teacher}</td>
							   <td>{c.room}</td>
							   <td className="printhide">
									   <a className="button" onClick={() => killTicket(t.id, props.onChange)}>
											   <i className="fa fa-trash" aria-hidden="true" />
									   </a>
							   </td>
					   </tr>;
			   })}
	   </tbody>
	</table>

window.ScheduleTable = ScheduleTable;
