class Schedule extends React.Component {
	render() {
		if (this.props.tickets.length == 0) return "Not registered for any classes";
		return <table>
			{this.props.tickets.map((t, i) => {
				return <tr key={i}>{JSON.stringify(t)}</tr>
			})}
			</table>;
	}
}
window.Schedule = Schedule;


