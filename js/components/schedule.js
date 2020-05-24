var rows = [
	["6AM to 9:15", "*", "*Planning", "Staff Meeting", "*Planning", "*Planning"],
	["", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
	["9:24  to 10:15", "A", "Town Meeting", "A", "A", "A"],
	["10:20 to 11:15", "B", "B", "B", "TA", "B"],
	["11:10 to 11:55", "C", "D", "C", "C", "C"],
	["12:35 to 1:25", "D", "E", "E", "D", "D"],
	["1:30 to 2:15", "F", "F", "F", "E", "E"],
	["2:20 to 3:15", "G", "G", "G", "F", "G"],
	["SPORTS BUS"], // .sport
	["3:15 to 4:06", "TA", "H", "H", "H", "H"]
]
var colors = [
	"#FFF3CF", // A
	"#FECB2F",
	/*"#FD28FC",*/ "#ff89fe", // C block
	"#CC9CFD",
	"#76E0FE",
	"#FFCC9C",
	"#9ACB28",
	"#EEECE2", // H
	"#FFFE9F", // Planning, index 8
	"#4FADC5", // TA & TM, index 9
]

class Schedule extends React.Component {
	render() {
		var tickets = this.props.tickets
		tickets.sort(((a, b) => a.block.localeCompare(b.block)))
		return <div className="schedule">
			{rows.map((r, i) => r.map((cell, j) => {
				var bi = (cell == "") ? -1 : "ABCDEFGH".indexOf(cell); // No PM block
				var color = bi >= 0
					? colors[bi]
					: (cell[0] == "*"
						? colors[8]
						: (cell == "TA" || cell == "Town Meeting" ? colors[9] : null))
				var style = color ? { backgroundColor: color } : {};
				var t = bi >= 0 ? tickets.filter(t => t.block == cell)[0] : null;
				return <div key={i + "-" + j} className={cell == "SPORTS BUS" ? "sport" : ""} style={style}>
					{cell}
					{t
						? [
							<div key={0} className="schedule-classname">{t.subsection == "" ? t.class_name : t.subsection}</div>,
							<a key={1} className="button schedule-killbtn" onClick={() => killTicket(t.id, this.props.onChange)}>&times;</a>
						]
					 	: null}
				</div>
			}))}
		</div>;
	}
}
window.Schedule = Schedule;
