class Sidebar extends React.Component {

    constructor(props){
      super(props);
    }

 	render(){
 		const username = sessionStorage.getItem('username');
 		let adminContent = <a href="/de_pot.html"><button type="button" className="btn btn-default btn-block manageTeachers">De Pot<i className="material-icons cr">group_add</i></button></a>;
 		if(username === 'admin'){
 			adminContent = <a href="/inflow.html"><button type="button" className="btn btn-default btn-block manageTeachers">Deposit<i className="material-icons cr">group_add</i></button></a>;
 		}
	    return (
	    	<div className="sidebar collapse navbar-collapse" id="nav_sidebar" style={{zIndex: '100', padding: '0', position: 'absolute', top: '0', bottom: '0'}}>
	    		<div className="buttons nav navbar-nav navbar-left" style={{width:'100%', margin: '0'}}>
	    			<a href="/transactions.html"><button type="button" className="btn btn-default btn-block manageTeachers">Transactions<i className="material-icons cr">group_add</i></button></a>
	    			{adminContent}
	    		</div>
	    	</div>
	    );
  	}
}