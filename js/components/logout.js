var Logout = () => {
	var req = () => {
		post("/logout",
			{},
			s => window.location.reload(),
			e => { console.log(e); alert("An error occured while logging out.") });
	}
	return <li className="navigation-item"><a className="navigation-link button button-clear" onClick={req}>Log Out</a></li>
}

window.Logout = Logout;

