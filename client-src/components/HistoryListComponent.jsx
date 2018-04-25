const hlc_rootStyle = {
  marginLeft: '16px',
  height: '100%'
};

const hlc_listStyle = {
  maxHeight: 'calc(100% - 100px)',
  overflowY: 'auto',
  paddingBottom: '16px',
  marginTop: '8px'
};

const hlc_itemStyle = {
    display: 'inline-block',
    width: '100%',
    padding: '16px'
};

class HistoryListComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {occupied: false, items: []};
  }

  //Lifecycle function, executed before the component is being rendered.
  componentWillMount(){

    const teacher_code = sessionStorage.getItem('username');
    this.setState({'occupied': true, 'teacher_code': teacher_code});
    this.retrieveData(teacher_code);

  }

  retrieveData = (teacher_code) => {
    this.setState({'occupied': true});
    let that = this;
    $.ajax({
        'method': 'GET',
        'url': '/api/forms/history/' + teacher_code,
        success : function(res){

          console.log(res);
          if(!res.succes){
            return;
          }

          const items = res.items.reverse();

          that.setState({'items': items});

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

  onNewFormClick = (event) => {
    if(this.props.parentEvent){
      this.props.parentEvent(this, null);
    }
  }

  onItemClick = (event) => {
    let version = event.target.value;
    if(!version && !(version = event.target.parentElement.parentElement.parentElement.value)){
      return;
    }
    if(this.props.parentEvent){
      this.props.parentEvent(this, version);
    }
  }

  renderItems(){
    const items = this.state.items;
    let html = [];
    for(let i = 0; i < items.length; i++){
      const item = items[i];
      const date = new Date(item.date);
      //date.setSeconds(item.date);
      html.push(<button type='button' onClick={this.onItemClick} value={item.version} style={hlc_itemStyle} className='list-group-item'>
        <div style={{float: 'left'}}>
          <h2>{item.locked ?
            <span className="label label-success">Accepted</span> :
            <span className="label label-default">Submitted</span>
          }</h2>
        </div>
        <div style={{float: 'left', 'margin': '0 0 0 8px'}}><div><h3>{date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()}</h3></div></div>
      </button>);
    }
    return (
      <div className="list-group">
        <button type='button' onClick={this.onNewFormClick} className='btn btn-primary'>New</button>
        <span style={{marginLeft: '8px'}}>Create a new, empty form!</span>
        <div style={hlc_listStyle}>
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
      <div className="panel panel-default" id="history-list-component" style={hlc_rootStyle}>
        <div className="panel-heading">
          <h3 className="panel-title">History</h3>
        </div>
        <div className="panel-body">
          {listContent}
        </div>
      </div>
    );
  }

}