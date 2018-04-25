
class UserSeletor extends React.Component{
	constructor(props) {
	     super(props);
          this.state = {currentTeacher: {}};
	}

	changeItem (teacherObject){
          this.setState({currentTeacher: teacherObject});
          if(this.props.type == 1){
               this.props.onSelectedUser(this.state.currentTeacher);
          }else{
               this.props.onSelectedUser(this.state.currentTeacher);

          }
	}

 	render(){
          if(this.props.type == 1){
               return (
                    <div id="userSelector" className='component'>
                         <UserSelectorTable type={this.props.type} tableId="normalrUserSelector" onSelect={this.changeItem.bind(this)}/>
                    </div>
               );
          }else{
               return (
                    <div id="userSelector" className='component'>
                         <UserSelectorTable type={this.props.type} tableId="applicationManagerUserSelector" onSelect={this.changeItem.bind(this)}/>
                    </div>
               );
          }
	}
}
