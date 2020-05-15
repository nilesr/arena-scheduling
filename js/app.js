class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			tickets: false,
			classes: false,
			loading: true,
			loginErr: false,
			name: false,
		};
		this.tryLogin = this.tryLogin.bind(this)
	}
	checkTickets() {
		this.setState(s => {return {...s, loading: true}; })
		get("/tickets",
			(t) => this.setState(s => { return {...s, loading: false, loggedIn: true, tickets: t.tickets, name: t.name}; }),
			(e) => this.setState(s => { return {...s, loading: false, loggedIn: false} }),
		)
	}
	tryLogin(user, pass) {
		this.setState(s => {return {...s, loading: true}; })
		post("/login",
			{user: user, pass: pass},
			(t) => {
				this.setState(s => { return {...s, loading: true, loggedIn: true, loginErr: false}; });
				this.checkTickets();
			},
			(e) => this.setState(s => { return {...s, loading: false, loggedIn: false, loginErr: e} }),
		)
	}
	componentDidMount() {
		this.checkTickets();
	}
	render() {
		return (
			<main className="wrapper">
				<nav className="navigation">
					<section className="container">
						<span className="navigation-title">Arena Scheduling</span>
						{this.state.loggedIn ? 
							<ul className="navigation-list float-right">
								<li className="navigation-item">Welcome {this.state.name}</li>
								<Logout />
							</ul>
							: null }
					</section>
				</nav>
				<section className="container" id="mainContainer">
					{this.state.loading ? <Loading /> : null}
					{this.state.loggedIn
							? this.state.tickets !== false
								? "You are logged in. You have " + this.state.tickets.length + " tickets"
								: "Loading your tickets..."
							: <Login onSubmit={this.tryLogin} err={this.state.loginErr} />}
				</section>
			</main>
		)
	}
};

ReactDOM.render(<App />, document.getElementById("root"));

