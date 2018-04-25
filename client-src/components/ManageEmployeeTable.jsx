class ManageEmployeeTable extends React.Component{
	constructor(props) {
	    super(props);
	    this.state =   {
	    	headerForManageEmployeeTable: ["First Name", "Last Name", "Code", ""],
	    	initialized: false
	    };
	}

	componentDidUpdate(prevProps, prevState){

	}

  	componentDidMount(){

  		var languagePack = translationStrings[sessionStorage.getItem('languagePack')];
		this.setState({
			headerForManageEmployeeTable: [languagePack.firstname, languagePack.surname, languagePack.usercode, languagePack.action ]
		});

		var table;
		if(!this.state.initialized){
			table = $("#" + this.props.tableId).DataTable({
				"info": false,
				"scrollY": "500px",
				"scrollX": true,
				"scrollCollapse": true,
				"dom":"lfrtip",
				"autoWidth": false,
				"paging": false,
				"columnDefs": [ {targets: [ 3 ],orderable: false}]
			});
			$( ".dataTables_empty" ).hide();
			this.setState({initialized: true});
		}

		$(window).resize(function() {
			table.columns.adjust().draw();
		});
  	}


  	selected = (event) => {
  		this.props.onSelect(this.props.tableId, event.target.className);
	}

  	render (){
		return (
			<div className="manageEmployeeTable">
				<table id={this.props.tableId} className="table table-bordered">
					<thead>
						<tr className="header">
							{this.state.headerForManageEmployeeTable.map(function(item) {
								return <th key={item}>{item}</th>
							})}
						</tr>
					</thead>
					<tfoot>
						<tr className="header">
							{this.state.headerForManageEmployeeTable.map(function(item) {
								return <th key={item}>{item}</th>
							})}
						</tr>
					</tfoot>
					<tbody>
						{this.props.data.map(function(item) {
								return (
									<tr key={item.userCode} id={item.userCode}>
										<td>{item.firstName}</td>
										<td>{item.secondName}</td>
										<td>{item.userCode}</td>
										<td><button className={item.userCode} onClick={this.selected}>{this.props.buttonName}</button></td>
									</tr>
								);
					  		}, this)}
					</tbody>
				</table>
			</div>
		);
  	}
}
