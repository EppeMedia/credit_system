
const userSSupervisorRev = {
 float:'left',
 width:'26%'
}

const editCSupervisorRev = {
 float:'right',
 width:'74%'
}

class SupervisorReviewPage extends React.Component{

	constructor(props) {
	    super(props);
	    this.state = {currentTeacher: null};
  	}


	showDetails(teacherObject){
		
		this.setState({
      		currentTeacher: teacherObject.userCode
    	});
		
		this.forceUpdate();

	
	}

 	render(){
		return (
			<div>
				<div style={userSSupervisorRev}><UserSeletor type="1" onSelectedUser={this.showDetails.bind(this)}/></div>
				<div style={editCSupervisorRev}><EditFormComponent selectedUser={this.state.currentTeacher}/></div>
			</div>
		);
	}
}