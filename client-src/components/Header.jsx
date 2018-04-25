class Header extends React.Component {

	constructor(props) {
	  super(props);
	}


	render() {
		return (
			<div className="header-content">
				<nav className="navbar navbar-default">
				  <div className="container-fluid">
				    <div className="navbar-header">
				      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav_sidebar">
				        <span className="sr-only">Toggle navigation</span>
				        <span className="icon-bar"></span>
				        <span className="icon-bar"></span>
				        <span className="icon-bar"></span>
				      </button>
				      <a className="navbar-brand" href="#"><bold>De Pot</bold></a>
				      <LogoutButton style={{float: 'right'}} onLogout={this.props.onLogout}/>
				    </div>
				    <div>
				    </div>
				  </div>
				</nav>
			</div>
		);
	}

}
