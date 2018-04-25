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

class TransactionListComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {occupied: false, balance: 0, items: []};
  }

  //Lifecycle function, executed before the component is being rendered.
  componentWillMount(){
    this.setState({'occupied': true});
    this.retrieveData();
  }

  retrieveData = () => {
    
    this.setState({'occupied': true});

    const username = this.props.username;
    let that = this;
    $.ajax({
        'method': 'GET',
        'url': '/api/transactions/' + username,
        'headers': { 'x-access-token': that.props.jwt },
        success : function(res){

          console.log(res);
          if(!res.success){
            return;
          }

          const items = res.items.reverse();

          that.setState({balance: res.balance, items: items});

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

  notify = (event) => {
    this.setState({'occupied': true});
    const that = this;
    setTimeout(function(){
      that.retrieveData(that.state.teacher_code);
    }, 750);
  }

  onNewTransactionClick = (event) => {
    window.location = '/new_transaction.html';
  }

  onItemClick = (event) => {
    let transaction = event.target.value;
    if(!transaction && !(transaction = event.target.parentElement.parentElement.parentElement.value)){
      return;
    }
    console.log(event.target);
    window.location = `/transaction_details.html?id=${transaction.date}`;
  }

  renderItems(){
    const username = this.props.username;
    const items = this.state.items;
    let html = [];
    for(let i = 0; i < items.length; i++){
      const item = items[i];
      const date = new Date(item.date);
      //date.setSeconds(item.date);
      html.push(<button type='button' onClick={this.onItemClick} value={item} style={tlc_itemStyle} className='list-group-item'>
        <div style={{float: 'left'}}>
          <h3 style={{width: '75px'}}>{item.from !== username ?
            <span className="label label-success">{parseFloat(item.amount).toFixed(2)}</span> :
            <span className="label label-danger">{parseFloat(item.amount).toFixed(2)}</span>
          }</h3>
        </div>
        <div style={{float: 'left', maxWidth: 'calc(100% - 110px)', 'margin': '0 0 0 8px'}}><div><h4>{item.from === username ? item.toNickname : item.fromNickname}</h4>{date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()}</div></div>
      </button>);
    }
    return (
      <div className="list-group" style={tlc_listgroupStyle}>
        <span style={{'float': 'left'}} ><h2 style={{'marginTop': '0'}} ><b>Balance </b>{parseFloat(this.state.balance).toFixed(2)}</h2></span>
        <button type='button' style={{'marginBottom': '8px', 'float': 'right'}} onClick={this.onNewTransactionClick} className='btn btn-primary'>Transfer</button>
        <div style={tlc_listStyle}>
          {html}
        </div>
      </div>
    );
  }

  render(){

    let listContent;

    if(this.state.occupied){
      listContent = <p style={{'color': 'red'}}>Please wait...</p>;
    }else{
      listContent = this.renderItems();
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
