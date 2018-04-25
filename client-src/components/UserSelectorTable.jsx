class UserSelectorTable extends React.Component{
	constructor(props) {
	    super(props);
	    this.state =   {
	    	initialized: false,
	    	dataList: [],
			headerForAppMan: ["First Name", "Last Name", "Code", "Roles"],
			headerForNormalUserSelector: ["First Name", "Last Name", "Code"]};
	}

	componentWillMount(){


	}

	componentWillUpdate(nextProps, nextState){

	}

	componentDidUpdate(prevProps, prevState){

		//need to fix this. works but can be improved
		if(!this.state.initialized){
			$("#" + this.props.tableId).DataTable({
				"info": false,
				"scrollY": "500px",
				"scrollX": true,
				"scrollCollapse": true,
				"dom":"lfrtip",
				"paging": false
			});
			$( ".dataTables_empty" ).hide();
			this.setState({initialized: true});
		}
	}

  	componentDidMount(){

    	var ctx = this;

		$.ajax({
            type : 'GET',
            url : '/api/users',
            contentType : 'application/json',
            success : function(res){
                console.log(res.users);
                ctx.setState({dataList: res.users});


            },
            error : function(jqhr, textStatus, error){
                let err = textStatus + ',' + error
                console.log(err);
            }
        });

		$("#" +  this.props.tableId + " tbody").on('click', 'tr', function () {

			$('tr').removeClass('clicked');
			$( this ).toggleClass('clicked');

			var curCtx = this;

			function findTeacher(teacher) {
			    return teacher.userCode === curCtx.id;
			}
			var selectedTeacher = ctx.state.dataList.find(findTeacher);
			ctx.props.onSelect(selectedTeacher);

		});

		var languagePack = translationStrings[sessionStorage.getItem('languagePack')];
		if(this.props.type == 1){
			this.setState({
				headerForNormalUserSelector: [languagePack.firstname, languagePack.surname, languagePack.usercode ]
			});
		}else{
			this.setState({
				headerForAppMan: [languagePack.firstname, languagePack.surname, languagePack.usercode, languagePack.roles ]
			});
		}
  	}

  	proccessRoles(teacherObject){


  		var rolesString = "";
  		if(teacherObject.roles.length > 0){
	  		teacherObject.roles.map(function(item) {
				rolesString = rolesString + " " + item.name.substring(0, 2).toUpperCase();
			})
  		}

  		return <td>{rolesString}</td>
  	}


  	render (){
  		if(this.props.type == 1){
			return (
				<div className="component component_container">
					<table id={this.props.tableId} className="datatable table table-bordered">
						<thead>
							<tr className="header">
								{this.state.headerForNormalUserSelector.map(function(item) {
									return <th key={item}>{item}</th>
								})}
							</tr>
						</thead>
						<tfoot>
							<tr className="header">
								{this.state.headerForNormalUserSelector.map(function(item) {
									return <th key={item}>{item}</th>
								})}
							</tr>
						</tfoot>
						<tbody>
							{this.state.dataList.map(function(item) {
							return <tr key={item.userCode} id={item.userCode}>
									<td>{item.firstName}</td>
									<td>{item.secondName}</td>
									<td>{item.userCode}</td>
								</tr>
						  	}, this)}
						</tbody>
					</table>
				</div>
			);
		}else{
			return (
				<div className="component">
					<table id={this.props.tableId} className="table table-bordered">
						<thead>
							<tr className="header">
								{this.state.headerForAppMan.map(function(item) {
									return <th key={item}>{item}</th>
								})}
							</tr>
						</thead>
						<tfoot>
							<tr className="header">
								{this.state.headerForAppMan.map(function(item) {
									return <th key={item}>{item}</th>
								})}
							</tr>
						</tfoot>
						<tbody>
							{this.state.dataList.map(function(item) {
							return <tr key={item.userCode} id={item.userCode}>
									<td>{item.firstName}</td>
									<td>{item.secondName}</td>
									<td>{item.userCode}</td>
									{this.proccessRoles(item)}
								</tr>
						  	}, this)}
						</tbody>
					</table>
				</div>
			);
		}
  	}
}
