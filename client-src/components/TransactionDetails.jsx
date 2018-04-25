const tlc_rootStyle = {
  height: '100%'
};

const tlc_listStyle = {
  paddingBottom: '16px',
  marginTop: '8px'
};

const tlc_itemStyle = {
    display: 'inline-block',
    width: '100%',
    padding: '16px'
};

const tlc_listgroupStyle = {
  height: '100%',
  paddingBottom: '16px',
};

class TransactionDetailsComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {occupied: false};
  }

  //Lifecycle function, executed before the component is being rendered.
  componentWillMount(){
    this.retrieveData();
  }

  retrieveData = () => {
    
    this.setState({'occupied': true});

    const username = this.props.username;

    const requestBody = {
      username: username,
      timestamp: this.props.params.id
    };

    let that = this;
    $.ajax({
        'method': 'POST',
        'url': '/api/transaction/' + username,
        'headers': { 'x-access-token': that.props.jwt },
        'contentType': 'application/json',
        'processData': false,
        'data': JSON.stringify(requestBody),
        success : function(res){

          console.log(res);
          if(!res.success){
            return;
          }

          that.setState({transaction: res.transaction});

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

  transactionDetails(){

    const transaction = this.state.transaction;
    if (transaction) {

      return (

        <div>

          <div style={{float: 'left'}}>
            <h3 style={{width: '75px'}}>{transaction.from !== username ?
              <span className="label label-success">{parseFloat(transaction.amount).toFixed(2)}</span> :
              <span className="label label-danger">{parseFloat(transaction.amount).toFixed(2)}</span>
            }</h3>
            <div style={{float: 'left', maxWidth: 'calc(100% - 110px)', 'margin': '0 0 0 8px'}}>
              <div>
                <h4><b>To</b>{transaction.toNickname}</h4>
                <h4><b>From</b>{transaction.fromNickname}</h4>
                {date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()}
              </div>
            </div>
          </div>

        </div>

      );

    }

  }

  render(){

    let listContent;

    if(this.state.occupied){
      listContent = <p style={{'color': 'red'}}>Please wait...</p>;
    }else{
      listContent = this.transactionDetails();
    }

    return (
      <div className="panel panel-default" id="transaction-list-component">
        <div className="panel-body" id="transaction-list-body">
          {listContent}
        </div>
      </div>
    );
  }

}
