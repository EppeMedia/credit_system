
const teacherList = [{name: "Airi Satou",
     code: "edu101",
     education: "HBO-ITC"},
     {name: "Biri Natou",
     code: "edu102",
     education: "HBO-IT"},
     {name: "Ziri Aatou",
     code: "edu103",
     education: "HBO-TC"},
     {name: "Wiri Gatou",
     code: "edu104",
     education: "HBO-ITCV"},
     {name: "Riri Ratou",
     code: "edu105",
     education: "BO-ITC"},
     {name: "Dri Stou",
     code: "edu106",
     education: "TC"},
     {name: "Airi Satou",
     code: "edu201",
     education: "HBO-ITC"},
     {name: "Biri Natou",
     code: "edu202",
     education: "HBO-IT"},
     {name: "Ziri Aatou",
     code: "edu203",
     education: "HBO-TC"},
     {name: "Wiri Gatou",
     code: "edu204",
     education: "HBO-ITCV"},
     {name: "Riri Ratou",
     code: "edu205",
     education: "BO-ITC"},
     {name: "Dri Stou",
     code: "edu206",
     education: "TC"},
     {name: "Airi Satou",
     code: "edu301",
     education: "HBO-ITC"},
     {name: "Biri Natou",
     code: "edu302",
     education: "HBO-IT"},
     {name: "Ziri Aatou",
     code: "edu303",
     education: "HBO-TC"},
     {name: "Wiri Gatou",
     code: "edu304",
     education: "HBO-ITCV"},
     {name: "Riri Ratou",
     code: "edu305",
     education: "BO-ITC"},
     {name: "Dri Stou",
     code: "edu306",
     education: "TC"}
    ];
        



class PlannerReviewPage extends React.Component{

	constructor(props) {
	    super(props);
	    this.state = { teachers: {}, currentTeacher: {} };
  	}

     componentDidMount(){
        var self = this;

        $.ajax({
            type : 'GET',
            url : '/api/users',
            contentType : 'application/json',
            success : function(res){
                if(res){
                    self.setState({ teachers : res.users });
                }
            },
            error : function(jqhr, textStatus, error){
                let err = textStatus + ',' + error
                console.log(err);
            }
        });
    }


	showDetails(teacherCode){
		
		function findTeacher(teacher) { 
			    return teacher.code === teacherCode;
			}

		
			
		 var selectedTeacher = this.state.teachers.find(findTeacher);
		
		this.setState({
      		currentTeacher: selectedTeacher
    	});
	
	}

 	render(){
		return (
			<div>
				<div id="userS"><UserSeletor onSelectedUser={this.showDetails.bind(this)}/></div>
				// <FormComponent/>
			</div>
		);
	}
}