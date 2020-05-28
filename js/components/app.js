class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			tickets: false,
			classes: false,
			loading: true,
			name: false,
			isAdmin: false,
			time_left: -1,
			num: -1,
			waitlists: false,
		};
	}
	checkTickets() {
		this.setState(s => {return {...s, loading: true}; })
		get("/tickets", {},
			(t) => this.setState(s => { return {...s, loading: false, loggedIn: true,
													  tickets: t.tickets, name: t.name, time_left: t.time_left,
													  isAdmin: t.admin, num: t.num, waitlists: t.waitlists}; }),
			(e) => this.setState(s => { return {...s, loading: false, loggedIn: false} }),
		)
	}
	fetchClasses() {
		get("/classes", {},
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
							<ul className="navigation-list float-right" style={{marginBottom: 0}}>
								<li className="navigation-item">Welcome {this.state.name}</li>
								{this.state.waitlists.length > 0 ? <WaitlistsWarning waitlists={this.state.waitlists} onChange={() => { this.checkTickets(); this.fetchClasses(); }} /> : null}
								<Timecover time_left={this.state.time_left} name={this.state.name} num={this.state.num} />
								<Logout />
							</ul>
							: null }
					</section>
				</nav>
				{this.state.loading || !this.state.classes ? <Loading /> : null}
				{this.state.loggedIn
						? (this.state.tickets === false || this.state.classes === false)
							? "Loading..."
							: this.state.isAdmin
								? <AdminView classes={this.state.classes} onChange={() => { this.checkTickets(); this.fetchClasses(); }}  />
								: <Tabs tickets={this.state.tickets} classes={this.state.classes} onChange={() => { this.checkTickets(); this.fetchClasses(); }} />
						: <Login />}
			</main>
		)
	}
};

window.App = App;
