const lp_bodyStyle = {
	backgroundColor: 'gray',
	position: 'fixed',
	width: '100%',
	height: '100%',
	top: '0',
	left: '0',
	padding: '16px'
};

const lp_panelStyle = {
	width: '100%',
	height: '100%'
};

class LoginPage extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = { username: '', password: '' };
	}
	
	handleLogin = (event) => {
		//console.log(event.target);
		if (this.state.username && this.state.password) {
			this.props.onLogin(this.state.username, this.state.password);
		}
	}
	
	handleInputChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	}

	render() {
		
		
		return(


			<div style={lp_bodyStyle}>
				<div className="panel panel-default" style={lp_panelStyle}>
				  <div className="panel-heading">
				    <h3 className="panel-title">Please log in</h3>
				  </div>
				  <div className="panel-body">
				    <input type="text" name="username" onChange={this.handleInputChange} className="form-control" placeholder="Username"></input><br/>
				    <input type="password" name="password" onChange={this.handleInputChange} className="form-control" placeholder="********"></input><br/>
				    <button type="button" className="btn btn-success" style={{float: 'right'}} onClick={this.handleLogin}>Log in</button>
				  </div>
				</div>
			</div>
		);
	}

	// const outer_style = {
	// 		backgroundImage: 'url("/css/resources/header.png")',
	// 		backgroundSize: 'cover',
	// 		height: '100vh',
	// 	};
	// 	const box_style = {
	// 		width: '20%',
	// 		margin: 'auto',
	// 		backgroundColor: 'white',
	// 		padding: '40px',
	// 		position: 'absolute',
	// 		top: '50%',
	// 		left: '50%',
	// 		transform: 'translate(-50%, -50%)',
	// 		boxShadow: '0px 0px 30px 0px rgba(0,0,0,0.42)',
	// 	};

// <div style={outer_style}>
// 				<div style={box_style}>
// 					<h1 style={{  }}>Login</h1>
// 					<table style={{ width: '100%' }}><tbody>
// 						<tr>
// 							<td style={{ width: '40%' }}>Username:</td>
// 							<td style={{ width: '60%' }}><input
// 								style={{ width: '100%' }}
// 								onChange={this.handleInputChange}
// 								name="username"
// 								type="text"
// 								value={this.state.username}
// 							/></td>
// 						</tr>
// 						<tr>
// 							<td style={{ width: '40%' }}>Password:</td>
// 							<td style={{ width: '60%' }}><input
// 								style={{ width: '100%' }}
// 								onChange={this.handleInputChange}
// 								name="password"
// 								type="password"
// 								value={this.state.password}
// 							/></td>
// 						</tr>
// 					</tbody></table>
// 					<button
// 						style={{ margin: '20px auto 0 auto', width: '30%' }}
// 						onClick={this.handleLogin} >
// 						Log in
// 					</button>
// 				</div>
// 			</div>

}
