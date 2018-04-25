class Overview extends React.Component {

	componentDidMount(){

		var that = this;

		var overViewTable;

		getRowsFromApi();

		//dummy data
		var data = [];
		var rows;
		var currentForm;

		/**
		 * get an array of rows via an API call
		 *
		 * @return array of rows to fill datatable
		 */
		function getRowsFromApi(){
			// var availability;
			console.log();

			var id;

			superagent
			.get('/api/users/' + sessionStorage.getItem('username'))
			.end((error, response) => {
				if (!error && response.body.success) {
					id = response.body.user.educationalPrograms[0].id;
					console.log(response.body.user.educationalPrograms[0].id);
				} else {
					console.log(response.body);
				}
			});

			superagent
			.get('/api/forms/educationalProgramForms/' + id)
			.end((error, response) => {
				if (!error && response.body.success) {
					var forms = response.body.forms;
					for (var i = 0; i < forms.length; i++) {
						currentForm = forms[i];
						console.log(forms);
						console.log(forms[1]);
						var availability = currentForm.versions[0].availability;
						data.push(getRow(availability));
					}
					setupTable();
					setupRows();
				} else {
					console.log(response.body);
				}
			});
		}

		function getRow(availability){
			var day;
			var row = [];

			var teacherCode = currentForm.teacher_code;
			row.push(teacherCode);
			getDayPartAvailability(row);

			// getTeacherName();
			// getDayPartAvailability();

			function getDayPartAvailability(){
				for (var i = 0; i < 5; i++) {
					switch (i){
						case 0:
							day = "monday";
							break;
						case 1:
							day = "tuesday";
							break;
						case 2:
							day = "wednesday";
							break;
						case 3:
							day = "thursday";
							break;
						case 4:
							day = "friday";
							break;
					}

					// row.push(0); //todo change this later to count the num of dayparts blocked

					var count = 0;
					for (var k = 1; k <= 16; k++) {
						var part = "p" + k;
						var dayPartAvailability = availability[day][part];
						row.push(dayPartAvailability);
						if (dayPartAvailability == 'u'){
							count++;
						}
						if (k == 16){
							row.splice(row.length-16, 0, count);
						}
					}
				}
			}

			return row;
		}

		function setupTable(){
			var tableID = "#" + that.props.tableID;
			overViewTable = $(tableID).DataTable({
				"scrollY": "100%",
	        	"scrollCollapse": true,
	        	"scrollX": true,
				"dom":"lfrtip",
				// "processing": true,
	   			// "serverSide": true,
				// "ajax": data,
				autoWidth: false,
				paging: false,
				info: false,
				filter: true,
				data: data,
				"columns" : [
					{ "title": "Code"},
					{ "title": "Monday"},
					{ "title": "1"},
					{ "title": "2"},
					{ "title": "3"},
					{ "title": "4"},
					{ "title": "5"},
					{ "title": "6"},
					{ "title": "7"},
					{ "title": "8"},
					{ "title": "9"},
					{ "title": "10"},
					{ "title": "11"},
					{ "title": "12"},
					{ "title": "13"},
					{ "title": "14"},
					{ "title": "15"},
					{ "title": "16"},
					{ "title": "Tuesday"},
					{ "title": "1"},
					{ "title": "2"},
					{ "title": "3"},
					{ "title": "4"},
					{ "title": "5"},
					{ "title": "6"},
					{ "title": "7"},
					{ "title": "8"},
					{ "title": "9"},
					{ "title": "10"},
					{ "title": "11"},
					{ "title": "12"},
					{ "title": "13"},
					{ "title": "14"},
					{ "title": "15"},
					{ "title": "16"},
					{ "title": "Wednesday"},
					{ "title": "1"},
					{ "title": "2"},
					{ "title": "3"},
					{ "title": "4"},
					{ "title": "5"},
					{ "title": "6"},
					{ "title": "7"},
					{ "title": "8"},
					{ "title": "9"},
					{ "title": "10"},
					{ "title": "11"},
					{ "title": "12"},
					{ "title": "13"},
					{ "title": "14"},
					{ "title": "15"},
					{ "title": "16"},
					{ "title": "Thursday"},
					{ "title": "1"},
					{ "title": "2"},
					{ "title": "3"},
					{ "title": "4"},
					{ "title": "5"},
					{ "title": "6"},
					{ "title": "7"},
					{ "title": "8"},
					{ "title": "9"},
					{ "title": "10"},
					{ "title": "11"},
					{ "title": "12"},
					{ "title": "13"},
					{ "title": "14"},
					{ "title": "15"},
					{ "title": "16"},
					{ "title": "Friday"},
					{ "title": "1"},
					{ "title": "2"},
					{ "title": "3"},
					{ "title": "4"},
					{ "title": "5"},
					{ "title": "6"},
					{ "title": "7"},
					{ "title": "8"},
					{ "title": "9"},
					{ "title": "10"},
					{ "title": "11"},
					{ "title": "12"},
					{ "title": "13"},
					{ "title": "14"},
					{ "title": "15"},
					{ "title": "16"},
				],
				// "initComplete": function (settings, json){
				// 	setupRows();
				// },
			});
		}

		function setupRows(settings, json){
			// initializeTable();

			// var availability = getRows();

			$('tbody td').each(function(index){
				index = index % 86;
				if (index == 0){
					// Ignore these columns
				}
				else if (index == 1){
					var that = $(this);
					that.addClass("m-hov dt-center");
					handleColors(that);
				}
				else if (index == 18){
					var that = $(this);
					that.addClass("t-hov dt-center");
					handleColors(that);
				}
				else if (index == 35){
					var that = $(this);
					that.addClass("w-hov dt-center");
					handleColors(that);
				}
				else if (index == 52){
					var that = $(this);
					that.addClass("th-hov dt-center");
					handleColors(that);
				}
				else if (index == 69){
					var that = $(this);
					that.addClass("f-hov dt-center");
					handleColors(that);
				} else {
					$(this).addClass("daypart");
				}

				if (index > 1 && index < 18){
					$(this).addClass("m");
				} else if (index > 18 && index < 35){
					$(this).addClass("t");
				} else if (index > 35 && index < 52){
					$(this).addClass("w");
				} else if (index > 52 && index < 69){
					$(this).addClass("th");
				} else if (index > 69 && index < 86){
					$(this).addClass("f");
				}
			});

			function handleColors(ref){
				ref.addClass("c-" + ref.html());
			}

			$('tr .m-hov').hover(
		    	function(){$('.m-hov').addClass('hover')
				},
				    function(){ $('.m-hov').removeClass('hover') }
				)
				$('tr .t-hov').hover(
				    function(){$('.t-hov').addClass('hover')
				},
				    function(){ $('.t-hov').removeClass('hover') }
				)
				$('tr .w-hov').hover(
				    function(){$('.w-hov').addClass('hover')
				 },
				    function(){ $('.w-hov').removeClass('hover') }
				)
				$('tr .th-hov').hover(
				    function(){$('.th-hov').addClass('hover')
				},
				    function(){ $('.th-hov').removeClass('hover') }
				)
				$('tr .f-hov').hover(
				    function(){$('.f-hov').addClass('hover')
				},
				    function(){ $('.f-hov').removeClass('hover') }
			);

			var dayPartCells = $('.daypart');
			var dayPartColumns = overViewTable.columns(dayPartCells);

			// Weekday dayPart columns
			var mondayColumns = overViewTable.columns($('.m'));
			var tuesdayColumns = overViewTable.columns($('.t'));
			var wednesdayColumns = overViewTable.columns($('.w'));
			var thursdayColumns = overViewTable.columns($('.th'));
			var fridayColumns = overViewTable.columns($('.f'));

			// Set visibility
			dayPartColumns.visible(false);

			// OnClick
			overViewTable.on('click', 'tbody td', function () {
				var header = overViewTable.column(this).header();
				var headerText = $(header).html();

				// TODO change this to the language strings file
				switch(headerText){
					case "Monday":
					var visible = mondayColumns.visible()[0];
					dayPartColumns.visible(false);
					mondayColumns.visible(!visible);
					break;
					case "Tuesday":
					var visible = tuesdayColumns.visible()[0];
					dayPartColumns.visible(false);
					tuesdayColumns.visible(!visible);
					break;
					case "Wednesday":
					var visible = wednesdayColumns.visible()[0];
					dayPartColumns.visible(false);
					wednesdayColumns.visible(!visible);
					break;
					case "Thursday":
					var visible = thursdayColumns.visible()[0];
					dayPartColumns.visible(false);
					thursdayColumns.visible(!visible);
					break;
					case "Friday":
					var visible = fridayColumns.visible()[0];
					dayPartColumns.visible(false);
					fridayColumns.visible(!visible);
					break;
				}
			});

			$( window ).resize(function() {
				overViewTable.columns.adjust().draw();
			});
		}
	}

	render(){
		return (
			<div className="component_container">
				<table id={this.props.tableID} className = "dataTable table"></table>
			</div>
		)
	}
}
