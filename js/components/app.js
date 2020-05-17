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
	fetchClasses() {
		get("/classes",
			(t) => this.setState(s => { return {...s, loading: false, classes: t.classes}; }),
			window.alert
		)
	}
	componentDidMount() {
		this.checkTickets();
		this.fetchClasses()
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
				{this.state.loading || !this.state.classes ? <Loading /> : null}
				{this.state.loggedIn
						? this.state.tickets !== false && this.state.classes !== false
							? <Tabs tickets={this.state.tickets} classes={this.state.classes} onChange={() => { this.checkTickets(); this.fetchClasses(); }} />
							: "Loading your tickets..."
						: <Login onSubmit={this.tryLogin.bind(this)} err={this.state.loginErr} />}
			</main>
		)
	}
};

window.App = App;
