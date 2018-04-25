class UserInfo extends React.Component{

  constructor(props) {
      super(props);
      this.state = {
        selectedTeacher: null
      };
  }


  componentDidMount() {

    var ctx = this;

    if (!this.state.userData) {
      $.ajax({
        url: '/api/users/' + sessionStorage.getItem('username'),
        type: 'GET',
        success(data) {
          console.log(data.user);
          ctx.setState({ selectedTeacher: data.user });

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

      console.log("got inside");
      teacherObject.roles.map(function(item) {
        switch(item.id){
          case "2":
            supervisor = true;
            $("#supervisor").prop('checked', true);
            break;
          case "3":
            planner = true;
            $("#planner").prop('checked', true);
            break;
          default:
            break;
        }
      })


    }
    console.log("bool for supervisor" + supervisor);
    if(!supervisor){
      $("#supervisor").prop('checked', false);
    }

    if(!planner){
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

            <div className="panel panel-default panel-success">
              <div className="panel-heading ">
                <h3 className="panel-title">Supervisor</h3>
              </div>
              <div className="panel-body">
                  {this.state.selectedTeacher.supervisorCode}
              </div>
            </div>

          </div>
          {this.proccessEducations(this.state.selectedTeacher.educationalPrograms)}
        </div>
      );
    }else{
      return(<div></div>);
    }
  }
}
