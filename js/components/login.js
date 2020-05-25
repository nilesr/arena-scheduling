var Login = (props) => {
	var onsubmit = function(event) {
		props.onSubmit(document.getElementById("username").value, document.getElementById("password").value)
		event.preventDefault();
	}
	return (
		<section className="container">
			<blockquote>Login with your apsva.us Google account. For example, 941590@apsva.us</blockquote>
			<button onClick={() => window.location.href = "/login"}>Login</button>
		</section>
	);
}
window.Login = Login
