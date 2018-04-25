const afp_leftPanelStyle = {
  width: '49.5%',
  height: '100%',
  position: 'relative',
  top: '0px',
  height: 'calc(100% - 196px)'
};

const afp_controlStyle = {
  height: '67px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: '#e2e2e2',
  alignItems: 'center',
  justifyContent: 'center'
};

class AcceptFormsPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  onEventSelected = (userCode) => {
    this.setState({'userCode': userCode});
    this.refs.formComponent.retrieveData(userCode);
  }

  onAccept = (event) => {
    const button = event.target;
    button.disabled = true;
    this.popUpComponent.show((confirmed) => {

      if(!confirmed){
        button.disabled = false;
        return;
      }

      const supervisorCode = sessionStorage.getItem('username');
      //This may be dangerous, concurrency-wise: Supervisor requests versions -> teacher submits new version -> supervisor accepts this teacher's version -> supervisor accepts different version than he was shown.
      const requestBody = {
        'teacherCode': this.state.userCode
      };

      const that = this;
      $.ajax({
          'method': 'POST',
          'url': '/api/forms/sign',
          'contentType': 'application/json',
          'processData': false,
          'data': JSON.stringify(requestBody),
          success : function(res){

            console.log(res);
            that.eventListComponent.retrieveData();
            that.setState({'userCode': null});

          },
          error : function(jqhr, textStatus, error){
              let err = textStatus + ',' + error
              console.log(err);
          }
      });

    });
  }

  render(){

    let formJSX = <div></div>;
    if(this.state.userCode){
      formJSX = <div style={afp_leftPanelStyle}>
        <div id="header" style={afp_controlStyle}>
          <button type="button" id="btn-accept" onClick={this.onAccept} className="btn btn-danger">Accept</button>
        </div>
        <FormComponent ref="formComponent" userCode={this.state.userCode}/>
        <PopUpComponent title="Accept this form" message="This form can be accepted without an external party. Please confirm that you wish to accept this form." ref={(PopUpComponent) => { this.popUpComponent = PopUpComponent; }}/>
      </div>;
    }

    return (
      <div>
        <EventListComponent ref={(EventListComponent) => { this.eventListComponent = EventListComponent; }} onEventSelected={this.onEventSelected}/>
        {formJSX}
      </div>
    );

  }

}