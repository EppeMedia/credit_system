const detailsApplicationMan = {
 float:'right',
 width:'60%',
  height: '650px',
  overflowY: 'scroll'
}

const userSApplicationMan = {
 float:'left',
 width:'35%'
}

class ApplicationManagerPage extends React.Component{

  constructor(props) {
      super(props);
      this.state = {currentTeacher: {}};
    }


  showDetails(teacherObject){
    this.setState({
          currentTeacher: teacherObject
      });

  }

  render(){
    return (
      <div>
        <div style={userSApplicationMan}><UserSeletor type="0" onSelectedUser={this.showDetails.bind(this)}/></div>
        <div style={detailsApplicationMan}><AppManDetails selectedUser={this.state.currentTeacher}/></div>
      </div>
    );
  }
}