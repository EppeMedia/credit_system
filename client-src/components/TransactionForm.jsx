const tf_rootStyle = {
  width: '100%',
  height: '100%'
};

class TransactionFormComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {occupied: false, error: false};
  }

  sendData = () => {
    
    this.setState({'occupied': true});

    const username = sessionStorage.getItem('username');

    const requestBody = {
      username: username,
      amount: this.state.amount
    };

    if(this.state.recipient){
      requestBody.to = this.state.recipient;
    }

    if(this.state.description){
      requestBody.description = this.state.description;
    }

    let that = this;
    $.ajax({
        'method': 'POST',
        'url': '/api/transactions',
        'headers': { 'x-access-token': that.props.jwt },
        'contentType': 'application/json',
        'processData': false,
        'data': JSON.stringify(requestBody),
        success: function(res){
          console.log(res);

          if (res.success) {
            window.location = '/transactions.html';
          } else {
            that.setState({'error': res.error});
          }

        },
        error : function(jqhr, textStatus, error){
            let err = textStatus + ',' + error
            console.log(err);
        },
        complete: function(){
          that.setState({'occupied': false});
        }
    });
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  renderForm = () => {

    const username = sessionStorage.getItem('username');

    let errorContent = <div></div>;
    if (this.state.error) {
      errorContent = <div className="alert alert-primary" role="alert">{this.state.error}</div>
    }

    return (
      <div className="panel panel-default" style={lp_panelStyle}>
        <div className="panel-heading">
          <h3 className="panel-title">New transaction</h3>
        </div>
        <div className="panel-body">
          <input type="number" name="amount" onChange={this.handleInputChange} className="form-control" placeholder="0.00"></input><br/>
          <textarea className="form-control" name="description" id="textAreaDescription" rows="3" onChange={this.handleInputChange} placeholder="Description..."></textarea><br/>
          {errorContent}<br/>
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
      <div className="panel panel-default" id="transaction-list-component" style={tf_rootStyle}>
        <div className="panel-body" style={tf_rootStyle}>
          {content}
        </div>
      </div>
    );
  }

}