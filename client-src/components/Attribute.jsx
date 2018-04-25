class AttributeComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {occupied: false};
  }

  sendData = () => {
    
    this.setState({'occupied': true});

    const requestBody = {
      username: this.state.username,
      amount: this.state.amount
    };

    let that = this;
    $.ajax({
        'method': 'POST',
        'url': '/api/attribute',
        'headers': { 'x-access-token': that.props.jwt },
        'contentType': 'application/json',
        'processData': false,
        'data': JSON.stringify(requestBody),
        success: function(res){
          console.log(res);
        },
        error : function(jqhr, textStatus, error){
            let err = textStatus + ',' + error
            console.log(err);
        },
        complete: function(jqXHR, textStatus){
          window.location = '/transactions.html';
        }
    });
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  renderForm = () => {

    return (
      <div className="panel panel-default" style={lp_panelStyle}>
        <div className="panel-heading">
          <h3 className="panel-title">Attribute credit</h3>
        </div>
        <div className="panel-body">
          <input type="number" name="amount" onChange={this.handleInputChange} className="form-control" placeholder="0.00"></input><br/>
          <input type="text" name="username" onChange={this.handleInputChange} className="form-control" placeholder="Username"></input><br/>
          <button type="button" className="btn btn-success" style={{float: 'right'}} onClick={this.sendData}>Send</button>
        </div>
      </div>
    );
  }

  render(){

    let content;

    if(this.state.occupied){
      content = <p style={{'color': 'red'}}>Please wait...</p>;
    }else{
      content = this.renderForm();
    }

    return (
      <div className="panel panel-default" id="transaction-list-component" style={tlc_rootStyle}>
        <div className="panel-body">
          {content}
        </div>
      </div>
    );
  }

}