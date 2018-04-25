const language = ["English", "Dutch"];

class AppManDetails extends React.Component{

	constructor(props) {
	    super(props);
	    this.state = {
	    	selectedTeacher: null
	    };
	}

	changeRole(){

		var teacherObject = this.state.selectedTeacher;
		var metSu = false;
		var metPl = false;

		if(teacherObject.roles.length > 0){

			teacherObject.roles.map(function(item) {
				switch(item.id){
					case "2":
						metSu = true;
						break;
					case "3":
						metPl = true;
						break;
				}
			});

		}

		const selectedUserCode = this.state.selectedTeacher.userCode;
		var urlForRole = "/api/users/role/" + selectedUserCode;

		if($("#supervisor").is(':checked') && !metSu){
			$.ajax({
	            type : 'POST',
	            url : urlForRole,
	            data: JSON.stringify({
					id: '2',
					supervisorCode: selectedUserCode
				}),
	            contentType : 'application/json',
	            error : function(jqhr, textStatus, error){
	                let err = textStatus + ',' + error
	                console.log(err);
	            }
	        });
		}else{
			$.ajax({
	            type : 'DELETE',
	            url : urlForRole,
	            data: "{\"id\":\"2\"}",
	            contentType : 'application/json',
	            error : function(jqhr, textStatus, error){
	                let err = textStatus + ',' + error
	                console.log(err);
	            }
	        });
		}

		if($("#planner").is(':checked') && !metPl){
			$.ajax({
	            type : 'POST',
	            url : urlForRole,
	            data: "{\"id\":\"3\"}",
	            contentType : 'application/json',
	            error : function(jqhr, textStatus, error){
	                let err = textStatus + ',' + error
	                console.log(err);
	            }
	        });
		}else{
			$.ajax({
	            type : 'DELETE',
	            url : urlForRole,
	            data: "{\"id\":\"3\"}",
	            contentType : 'application/json',
	          	error : function(jqhr, textStatus, error){
	                let err = textStatus + ',' + error
	                console.log(err);
	            }
	        });
		}




	}

	componentWillReceiveProps(nextProps) {
	  	var selectedTeacherObject = nextProps.selectedUser;
		this.setState({
			selectedTeacher: selectedTeacherObject
		});
	}

	componentDidUpdate(prevProps, prevState){
		var teacherObject = this.state.selectedTeacher;
		var metSu = false;
		var metPl = false;
		if(teacherObject.roles.length > 0){

			teacherObject.roles.map(function(item) {
				switch(item.id){
					case "2":
						metSu = true;
						$("#supervisor").prop('checked', true);
						break;
					case "3":
						metPl = true;
						$("#planner").prop('checked', true);
						break;
					default:
						break;
				}
			})

		}

		if(!metSu){
			$("#supervisor").prop('checked', false);
		}

		if(!metPl){
			$("#planner").prop('checked', false);
		}

	}

	proccessEducations(array){
		if(array.length > 0){
			return (<div className="panel panel-default panel-success">
				<div className="panel-heading ">
					<h3 className="panel-title">{translationStrings[sessionStorage.getItem('languagePack')].education}</h3>
				</div>
				<div className="panel-body">
				    <div className="list-group">
					  <a href="#" className="list-group-item active">
					    {array[0].academyName}
					  </a>
					  {array.map(function(item) {
						return (
								<a href="#" className="list-group-item" key={item._id}>{item.name}</a>
							)
					  	})}
					</div>
				</div>
			</div>);
		}

	}


 	render(){
 		if(this.state.selectedTeacher != null){
			return (
				<div id="AppManDetails">

					<div >
						<div className="panel panel-default panel-success">
							<div className="panel-heading">
								<h3 className="panel-title">{translationStrings[sessionStorage.getItem('languagePack')].firstname}</h3>
							</div>
							<div className="panel-body">
							    {this.state.selectedTeacher.firstName}
							</div>
						</div>

						<div className="panel panel-default panel-success">
							<div className="panel-heading ">
								<h3 className="panel-title">{translationStrings[sessionStorage.getItem('languagePack')].surname}</h3>
							</div>
							<div className="panel-body">
							    {this.state.selectedTeacher.secondName}
							</div>
						</div>

						<div className="panel panel-default panel-success">
							<div className="panel-heading ">
								<h3 className="panel-title">{translationStrings[sessionStorage.getItem('languagePack')].usercode}</h3>
							</div>
							<div className="panel-body">
							    {this.state.selectedTeacher.userCode}
							</div>
						</div>

					</div>
					{this.proccessEducations(this.state.selectedTeacher.educationalPrograms)}
					<div>
						<div className="panel panel-default panel-success">
							<div className="panel-heading ">
								<h3 className="panel-title">{translationStrings[sessionStorage.getItem('languagePack')].roles}</h3>
							</div>
							<div className="panel-body">
							    <div className="checkbox">
								  	<label ><input type="checkbox" value="" id="supervisor"/>{translationStrings[sessionStorage.getItem('languagePack')].supervisor}</label>
								</div>
								<div className="checkbox">
								  	<label><input type="checkbox" value="" id="planner" />{translationStrings[sessionStorage.getItem('languagePack')].planner}</label>
								</div>
							</div>
						</div>
						<button onClick={this.changeRole.bind(this)}>{translationStrings[sessionStorage.getItem('languagePack')].save}</button>
					</div>
				</div>
			);
		}else{
			return(<div></div>);
		}
	}
}
