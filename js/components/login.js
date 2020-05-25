var Login = (props) => {
	var onsubmit = function(event) {
		props.onSubmit(document.getElementById("username").value, document.getElementById("password").value)
		event.preventDefault();
	}
	return (
		<section className="container">
			<blockquote>Login with your apsva.us Google account. For example, 941590@apsva.us</blockquote>
			<a href="/login" className="button button-outline login-button"><i className="fa fa-google login-icon" aria-hidden="true"></i> Login</a>
		</section>
	);
}
window.Login = Login
