'use strict';
const { PropTypes } = React;
const { BrowserRouter, Route, Link, NavLink } = ReactRouterDOM;


class App extends React.Component {

	constructor(props) {
		super(props);


		const tokenExpire = sessionStorage.getItem('token-exp');
		if (!tokenExpire || tokenExpire < Date.now() / 1000) {
			this.state = {
				username: null,
				token: null,
				tokenExpire: null,
			};
		} else {
			this.state = {
				username: sessionStorage.getItem('username'),
				token: sessionStorage.getItem('token'),
				tokenExpire,
			};
		}
	}

	handleLogin = (username, password) => {
		
		const requestBody = {
			username: username,
			password: password
		};

		const that = this;
		$.ajax({
      'method': 'POST',
      'url': '/auth',
      'contentType': 'application/json',
      'processData': false,
      'data': JSON.stringify(requestBody),
      success : function(res){

        if(!res.success){
          return;
        }

        const tokenContents = jwt_decode(res.token);
		that.setState({
			username: username,
			token: res.token,
			tokenExpire: tokenContents.exp,
		});

      },
      error : function(jqhr, textStatus, error){
          let err = textStatus + ',' + error
          console.log(err);
      }
    });

	}

	handleLogout = () => {
		this.setState({username: null, token: null });
		window.location = "/";
	}

	checkAndUpdateSessionData() {
		if (this.state.username && this.state.token && this.state.tokenExpire) {
			sessionStorage.setItem('username', this.state.username);
			sessionStorage.setItem('token', this.state.token);
			sessionStorage.setItem('token-exp', this.state.tokenExpire);
			return true;
		} else {
			sessionStorage.removeItem('username');
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('token-exp');
			return false;
		}
	}

	render() {
		const authenticated = this.checkAndUpdateSessionData();
		if (authenticated) {
			return (
				<RoutingWrapper onLogout={this.handleLogout} username={this.state.username} jwt={this.state.token} />
			);
		} else {
			return (
				<LoginPage onLogin={this.handleLogin} />
			);
		}
	}
}

class RoutingWrapper extends React.Component {

// <Route exact path="/" component={HomePage} />
// 				<Route exact path="/overview.html" component={()=>
// 					<RootComponent contentComponent={<Overview tableID="overViewTab"/>} />
// 				} />
// 				<Route exact path="/edit_form.html" component={()=>
// 					<RootComponent contentComponent={<EditFormComponent />} />
// 				} />

// <Route path="/" component={()=>
// 					<Sidebar roles="1 2 3 4"/>
// 				}/>
// 				<Route path="/" component={()=>
// 					<Header
// 					username="Cage"
// 					programme="Programme"
// 					academy="Academy"
// 					clickAccount="function()"
// 					clickLogout="function()"/>
// 				}/>
// 				<Route exact path="/" component={HomePage} />
// 				<Route exact path="/overview.html" component={()=>
// 					<Overview tableID="overViewTab"/>
// 				} />
// 				<Route exact path="/form.html" component={()=>
// 					<EditFormComponent/>
// 				} />

	render() {

		//Routing option 1:

		// <Route path="/" component={()=>
		// 	<Sidebar roles="1 2 3 4"/>
		// }/>
		// <Route path="/" component={()=>
		// 	<Header
		// 	username="Cage"
		// 	programme="Programme"
		// 	academy="Academy"
		// 	clickAccount="function()"
		// 	clickLogout="function()"/>
		// }/>
		// <Route exact path="/" component={HomePage} />
		// <Route exact path="/overview.html" component={()=>
		// 	<Overview tableID="overViewTab"/>
		// } />
		// <Route exact path="/form.html" component={()=>
		// 	<EditFormComponent/>
		// } />

		//Routing option 2:

		// <Route exact path="/" component={HomePage} />
		// <Route exact path="/overview.html" component={()=>
			// <RootComponent contentComponent={<Overview tableID="overViewTab"/>} />
		// } />
		// <Route exact path="/edit_form.html" component={()=>
			// <RootComponent contentComponent={<EditFormComponent />} />
		// } />

		// function getUser(userCode){
		// 	superagent
		// 	.get('/api/users/'+userCode)
		// 	.end((error, response) => {
		// 		if (!error && response.body.success) {
		// 			var body = response.body;
		// 			console.log(body);
		// 			console.log(sessionStorage.getItem('username'));
		// 		} else {
		// 			console.log(response.body);
		// 		}
		// 	});
		// }

		return (
			<div>
				<Route exact path="/" component={()=>
					<RootComponent
						onLogout={this.props.onLogout}
						contentComponent={<TransactionListComponent username={this.props.username} jwt={this.props.jwt}/>} />
				} />
				<Route exact path="/transactions.html" component={()=>
					<RootComponent
						onLogout={this.props.onLogout}
						contentComponent={<TransactionListComponent username={this.props.username} jwt={this.props.jwt}/>} />
				} />
				<Route exact path="/transaction_details.html" component={()=>
					<RootComponent
						onLogout={this.props.onLogout}
						contentComponent={<TransactionDetailsComponent username={this.props.username} jwt={this.props.jwt}/>} />
				} />
				<Route exact path="/de_pot.html" component={()=>
					<RootComponent
						onLogout={this.props.onLogout}
						contentComponent={<TransactionListComponent username="admin" jwt={this.props.jwt}/>} />
				} />
				<Route exact path="/new_transaction.html" component={()=>
					<RootComponent
						onLogout={this.props.onLogout}
						contentComponent={<TransactionFormComponent jwt={this.props.jwt} />} />
				} />
				<Route exact path="/inflow.html" component={()=>
					<RootComponent
						onLogout={this.props.onLogout}
						contentComponent={<AttributeComponent jwt={this.props.jwt} />} />
				} />
				<Route exact path="/roles.html" component={()=>
					<RootComponent
						onLogout={this.props.onLogout}
						contentComponent={<ApplicationManagerPage/>} />
				} />
				<Route exact path="/account.html" component={()=>
					<RootComponent
						onLogout={this.props.onLogout}
						contentComponent={<UserInfo/>} />
				} />
				<Route exact path="/form.html" component={()=>
					<RootComponent
						onLogout={this.props.onLogout}
						leftComponent={<FormComponent userCode={sessionStorage.getItem('username')} />}
						rightComponent={<HistoryListComponent />}/>
					} />
				<Route exact path="/export.html" component={()=>
					<RootComponent
						onLogout={this.props.onLogout}
						contentComponent={<ExportFormsPage/>} />
				} />
			</div>
		);
	}
}

class LogoutButton extends React.Component {

	handleLogout = () => {
		this.props.onLogout();
	}

	render() {
		// <button onClick={this.handleLogout}>Log out</button>
		return (
			<a style={{marginTop: '14px', display: 'inline-block'}} onClick={this.handleLogout} className="al" href="#">Logout</a>
		);
	}
}

// const TopBar = props =>
// 	<div>
// 		<h1>Top bar</h1>
// 		<LogoutButton onLogout={props.onLogout} />
// 	</div>

// const SideBar = props =>
// 	<div>
// 		<h1>Side bar</h1>
// 	</div>

// const HomePage = props =>
// 	<div>
// 		<h1>Home page</h1>
// 	</div>

// const FooPage = props =>
// 	<div>
// 		<h1>Foo page</h1>
// 	</div>

// const BarPage = props =>
// 	<div>
// 		<h1>Bar page</h1>
// 	</div>

ReactDOM.render((
	<BrowserRouter>
		<App/>
	</BrowserRouter>
	), document.getElementById('root')
);
