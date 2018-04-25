const leftTable = {
  float:'left',
  width:'49%'
};

const rightTable = {
  float:'right',
  width:'49%'
};

const saveButton = {
  position: 'static',
  width:'100%'
};



class ManageEmployeePage extends React.Component{

	constructor(props){
		super(props);
		this.state = { 
			subordinates: [],
			subordinatesOriginal: [],
			available: [],
			availableOriginal: []
		}
	}

	change(table, teacherCode){

		if (table == "manageEmployeeTableOne") {

			let selectedTeacher = this.state.available.find((teacher) => { return teacher.userCode === sessionStorage.getItem('username'); });
			let index = this.state.available.indexOf(selectedTeacher);

			let tempSubordinates = this.state.subordinates.slice();
			tempSubordinates.push(selectedTeacher);

			let tempAvailable = this.state.available;
			tempAvailable.splice(index, 1)

			this.setState({ 
				subordinates: tempSubordinates,
				available: tempAvailable
			});

		} else {

			let selectedTeacher = this.state.subordinates.find((teacher) => { return teacher.userCode === sessionStorage.getItem('username'); });
			let index = this.state.subordinates.indexOf(selectedTeacher);


			let tempAvailable = this.state.available.slice();
			tempAvailable.push(selectedTeacher);

			let tempSubordinates = this.state.subordinates;
			tempSubordinates.splice(index, 1)

			this.setState({ 
				subordinates: tempSubordinates,
				available: tempAvailable
			});

		}

		this.forceUpdate();

	}

	componentDidMount(){

		let logedInUserCode = sessionStorage.getItem('username');
		let urlGetLogedInUser = "/api/users/" + logedInUserCode;

		//TODO: Add jwt headers to all API calls.

		const self = this;
		$.ajax({
            type : 'GET',
            url : urlGetLogedInUser,
            contentType : 'application/json',
            success : self.logInSuccess,
            error : function(jqhr, textStatus, error){
            	let err = textStatus + ',' + error
				console.log(err);
            }
        });
        
	}

	logInSuccess = (res) => {

		if(!res){
			return;
		}

		const educationalID = res.user.educationalPrograms[0].id;
		const urlSubordinates = "/api/supervisorUsers/" + sessionStorage.getItem('username');

		const self = this;
		$.ajax({
	        type : 'GET',
	        url : urlSubordinates,
	        contentType : 'application/json',
	        success : (res) => {
	        	if(!res){
	        		return;
	        	}
	        	self.setState({subordinates: res.users, subordinatesOriginal: res.users});
	        	self.getSubordinatesSuccess(res, educationalID);
	        },
	        error : function(jqhr, textStatus, error){
	        	let err = textStatus + ',' + error
				console.log(err);
	        }
	    });

    }

    getSubordinatesSuccess = (res, educationalID) => {
	    
	    const self = this;
	    $.ajax({
	        type : 'GET',
	        url : "/api/educationalProgramWithoutSuperVisors/" + educationalID,
	        contentType : 'application/json',
	        success : function(res){

	            if(!res){
	            	return;
	            }

            	let tempAvailable = res.users;

            	let selectedTeacher = tempAvailable.find((teacher) => { return teacher.userCode === sessionStorage.getItem('username'); });
				let index = tempAvailable.indexOf(selectedTeacher);

            	tempAvailable.splice(index, 1)

                self.setState({available : tempAvailable, availableOriginal: tempAvailable});

	        },
	        error : function(jqhr, textStatus, error){
	        	let err = textStatus + ',' + error
				console.log(err);
	        }
	    });

    }

	save(){

		let succes = true;

		for(var i = 0; i < this.state.subordinates.length; i++){
			var teacherCode = this.state.subordinates[i].userCode;
			function findTeacher(teacher) {
			    return teacher.userCode === teacherCode;
			}

			var bl = (this.state.subordinatesOriginal.find(findTeacher) == null);
			if(bl){

				//api call for seting supervisorCode of to this supervisor
				var urlForSupCode = "/api/users/" + this.state.subordinates[i].userCode;
				const myUserCode = sessionStorage.getItem('username');

				$.ajax({
		            type : 'PUT',
		            url : urlForSupCode,
		            data: `{"supervisorCode": ${myUserCode}}`,
		            contentType : 'application/json',
		            error : function(jqhr, textStatus, error){
		                let err = textStatus + ',' + error
		                console.log(err);
		                succes = false;
		            }
		        });

				//api call for adding teacher role
				var urlForRole = "/api/users/role/" + this.state.subordinates[i].userCode;

				$.ajax({
		            type : 'POST',
		            url : urlForRole,
		            data: "{\"id\":\"1\"}",
		            contentType : 'application/json',
		            error : function(jqhr, textStatus, error){
		                let err = textStatus + ',' + error
		                console.log(err);
		                succes = false;
		            }
		        });

			}
		}


		for(var i = 0; i < this.state.available.length; i++){
			var teacherCode = this.state.available[i].userCode;
			function findTeacher(teacher) {
			    return teacher.userCode === teacherCode;
			}

			var bl = (this.state.availableOriginal.find(findTeacher) == null);
			if(bl){

				//api call for seting supervisorCode of to ""
				var urlForSupCode = "/api/users/" + this.state.available[i].userCode;

				$.ajax({
		            type : 'PUT',
		            url : urlForSupCode,
		            data: "{\"supervisorCode\": \"\"}",
		            contentType : 'application/json',
		            error : function(jqhr, textStatus, error){
		                let err = textStatus + ',' + error
		                console.log(err);
		                succes = false;
		            }
		        });

				//api call for deleting teacher role
				var urlForRole = "/api/users/role/" + this.state.available[i].userCode;

				$.ajax({
		            type : 'DELETE',
		            url : urlForRole,
		            data: "{\"id\":\"1\"}",
		            contentType : 'application/json',
		            error : function(jqhr, textStatus, error){
		                let err = textStatus + ',' + error
		                console.log(err);
		                succes = false;
		            }
		        });

			}
		}













		// for (let i = 0; i < suboordinates.length; i++) {
		// 	let teacher = suboordinates[i]
		// 	let url = `/api/users/${teacher.username}`
		// 	let data = { supervisorUserCode: sessionStorage.getItem('username') }

		// 	$.ajax(
		// 			{
		// 			type: 'PUT',
		// 			contentType: 'application/json',
		// 			url: url, 
		// 			data: data,
		// 			dataType: 'json',
		// 			error: function(){
		// 				succes = false;
		// 			}
		// 		}
		// 	);
		// }

		// if (succes) {
		// 	alert('Something went wrong updating');
		// }
	}

 	render(){
		return (
			<div >
				<div className="panel panel-default panel-warning" style={leftTable}>
					<div className="panel-heading ">
						<h3 className="panel-title">{translationStrings[sessionStorage.getItem('languagePack')].availableEmployees}</h3>
					</div>
					<div className="panel-body">
					    <ManageEmployeeTable data={this.state.available} tableId="manageEmployeeTableOne" onSelect={this.change.bind(this)} buttonName={translationStrings[sessionStorage.getItem('languagePack')].add}/>
					</div>
				</div>

				<div className="panel panel-default panel-success" style={rightTable}>
					<div className="panel-heading ">
						<h3 className="panel-title">{translationStrings[sessionStorage.getItem('languagePack')].subordinates}</h3>
					</div>
					<div className="panel-body">
					    <ManageEmployeeTable data={this.state.subordinates} tableId="manageEmployeeTableTwo" onSelect={this.change.bind(this)} buttonName={translationStrings[sessionStorage.getItem('languagePack')].remove}/>
					</div>
				</div>

				<button style={saveButton} onClick={this.save.bind(this)}>{translationStrings[sessionStorage.getItem('languagePack')].save}</button>
			</div>
		);
	}
}
