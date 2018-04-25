const elv_rootStyle = {
  width: "100%"
};

const elv_contentStyle = {
  whiteSpace: "nowrap",
  overflowX: "auto"
};

class EventListComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {'events': []};
  }

  /*
      React lifecycle functions:
  */

  //Lifecycle function, executed before the component is being rendered.
  componentWillMount(){

    //Perform API request, obtaining "events"
    this.retrieveData();

  }

  retrieveData = () => {
    this.setState({'occupied': true});
    const supervisorCode = sessionStorage.getItem('username');
    const requestBody = {
      'supervisorCode': supervisorCode
    };
    let that = this;
    $.ajax({
        'method': 'POST',
        'url': '/api/forms/submitted',
        'contentType': 'application/json',
        'processData': false,
        'data': JSON.stringify(requestBody),
        success : function(res){

          console.log(res);
          if(!res.succes){
            return;
          }

          that.setState({'events': res.result});

        },
        error : function(jqhr, textStatus, error){
            let err = textStatus + ',' + error
            console.log(err);
        },
        complete: function(jqXHR, textStatus){
          that.setState({'occupied': false});
        }
    });
  }

  onEventSelected = (event) => {
    if(this.props.onEventSelected){
      this.props.onEventSelected(event.target.value);
    }
  }

  //Returns a jsx variable, containing the events which will show up in the horizontal scrollable bar
  renderEvents(){
    let html = [];
    const events = this.state.events;
    for(let i = 0; i < events.length; i++){
      const userCode = events[i].userCode;
      html.push(<button type="button" onClick={this.onEventSelected} className="btn btn-primary" style={{'marginRight': "8px"}} value={userCode} key={userCode}>{userCode}</button>);
    }
    return (
      <div id="event-list">
        {html}
      </div>
    );
  }

  render(){

    let panelContent;

    if(this.state.occupied){
      panelContent = <p style={{'color': 'red'}}>Please wait...</p>;
    }else{
      panelContent = this.renderEvents();
    }

    return (
      <div className="panel panel-default" style={elv_rootStyle}>
        <div className="panel-heading">
          <h3 className="panel-title">Submitted Forms</h3>
        </div>
        <div className="panel-body" style={elv_contentStyle}>
          {panelContent}
        </div>
      </div>
    );

  }

}