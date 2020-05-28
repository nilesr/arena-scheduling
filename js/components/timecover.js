var pad = function pad(r) {
	return r.toString().padStart(2, "0")
}

var hr = function hr(t) {
	var r = [];
	var units = [3600*24, 3600, 60, 1]
	for (var i = 0; i < units.length; i++) {
		var usec = units[i]
		var us = Math.floor(t / usec);
		r.push(us)
		t = t - (us * usec)
	}
	var rr = ""
	if (r[0] > 0) {
		rr += r[0] + " days, "
	}
	rr += pad(r[1]) + ":" + pad(r[2]) + ":" + pad(r[3])
	return rr;
}
var now = function now() {
	return new Date()/1000;
}
var hrt = function hrt(t) {
	return new Date(t*1000).toLocaleString()
}
var easternp = function easternp() {
	return (new Date().getTimezoneOffset()/60) == 4;
}

class Timecover extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: props.time_left > 0,
			enter_time: props.time_left + now(),
			time_left: props.time_left,
		}
	}
	componentDidMount() {
		this.ihndl = setInterval((function() {
			this.setState(s => { return {...s, time_left: s.enter_time - now()}; });
		}).bind(this), 1000);
	}
	componentWillUnmount() {
		clearInterval(this.ihndl);
	}
	make_warning() {
		return <div className="timecover-warning">
			<section className="container">
				<h2>Welcome to Arena Scheduling, {this.props.name}</h2>
				<h3>Your number is {this.props.num + 1}</h3>
				<h3>You can schedule on {hrt(this.state.enter_time)}, which is in {hr(this.state.time_left)}{easternp() ? null : <span> <mark>Local Time</mark> (not Eastern)</span>}</h3>
				<a className="button" onClick={() => this.setState(s => { return {...s, open: false}; })}>Browse Course Catalog (read-only)</a>
			</section>
		</div>;
	}
	render() {
		return (this.state.time_left > 0
			? <li className="navigation-item">
				<span onClick={() => this.setState(s => { return {...s, open: true}; })} style={{cursor: "pointer"}}>{hr(this.state.time_left)} remaining</span>
				{this.state.open ? this.make_warning() : null}
			  </li>
			: null);
	}
}

window.Timecover = Timecover;
