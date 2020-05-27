var WaitlistsWarning = function WaitlistsWarning(props) {
	var n = props.n;
	return <li className="navigation-item waitlists-warning">
		<i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
		Waitlisted for {n} {n  == 1 ? "class" : "classes"}
	</li>;
}

window.WaitlistsWarning = WaitlistsWarning;
