var Login = (props) => {
	var onsubmit = function(event) {
		props.onSubmit(document.getElementById("username").value, document.getElementById("password").value)
		event.preventDefault();
	}
	return (
		<div>
			{props.err ?
				<blockquote>{props.err}</blockquote>
			: null}
			<form onSubmit={onsubmit} style={{paddingTop: "20px"}}>
				<fieldset>
					<label htmlFor="username">Student ID number</label>
					<input placeholder="941590" name="username" id="username" />
					<label htmlFor="password">School Password</label>
					<input type="password" name="password" id="password" />
					<input className="button-primary" type="submit" value="Login" />
				</fieldset>
			</form>
		</div>
	);
}
window.Login = Login
