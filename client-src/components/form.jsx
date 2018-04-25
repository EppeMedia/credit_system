const timeslotStyle = {
  display: 'flex',
  width: '100%',
  margin: '0',
  border: '.1px solid #E6E6E6',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white'
};

const controlStyle = {
  height: '67px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: '#e2e2e2'
};

const inlineStyle = {
  float: 'left',
  marginLeft: '16px'
};

const pstyle = {
  margin: '0',
  padding: '0',
  color: '#D2D2D2'
};

const headerStyle = {
  backgroundColor: '#e2e2e2',
  height: '64px'
};

const headerItemStyle = {
  display: 'flex',
  float: 'left',
  height: '64px',
  borderRight: '1px solid white',
  backgroundColor: '#eeeeee',
  alignItems: 'center',
  justifyContent: 'center'
};

const titleStyle = {
  margin: '0 0 0 8px'
};

const columnStyle = {
  display: 'inline-block',
  float: 'left',
  width: '16.66%',
  height: '100%'
};

const wrapperStyle = {
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  height: '100%'
};

const contentStyle = {
  position: 'relative',
  height: 'calc(100% - 64px)',
  width: '100%'
};

const timesColumnStyle = {
  float: 'left',
  height: '100%',
  borderRight: '4px solid #eeeeee'
};

const containerStyle = {
    position: 'relative',
    top: '0px',
    height: 'calc(100% - 67px)'
};

// Configuration settings are located in the configuration (config.js) file.
let timeslots = config.timeslots;   // These timeslots act as the row identifiers in the Form.
let days = config.days;             // These days act as the column names in the Form.
let exceptTimeslots = config.except;
let modes = ['u', 'a'];             // These are the "modes" in which the user can select a timeslot. The modes are "Unavailable" and "Available".

class FormComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {tableData: [], export: [[]], selectionMode: modes[0], occupied: false, locked: false};
  }

  /*
      React lifecycle functions:
  */

  //Lifecycle function, executed before the component is being rendered.
  componentWillMount(){

    //Change style properties dynamically:
    columnStyle.width = (100.0 / days.length) + '%';
    timeslotStyle.height = (100.0 / timeslots.length) + '%';

    //Create an empty form:
    this.setState({tableData: this.emptyTableData(days.length, timeslots.length)});
    this.setState({export: this.createMatrix(days.length, timeslots.length)});

    //Request the teacher's latest form version from the API:
    this.retrieveData(this.props.userCode);

  }

  retrieveData = (userCode, versionCounter, callback) => {
    const teacher_code = userCode;
    const requestBody = {'teacher_code': teacher_code, 'counter': versionCounter};
    this.setState({'occupied': true});//Let the form show that it's not available for interaction while requesting a form version from the API.
    let that = this;
    $.ajax({
        'method': 'POST',
        'url': '/api/forms/versions',
        'contentType': 'application/json',
        'processData': false,
        'data': JSON.stringify(requestBody),
        success : function(res){

          console.log(res);
          if(!res.succes){
            that.setState({'editing': true});
            return;
          }

          if(res.content.version){
            that.displayVersion(res.content.version);
          }else{
            that.setState({'editing': true});
          }

          that.setState({'locked': versionCounter? false : res.content.locked});

        },
        error : function(jqhr, textStatus, error){
            let err = textStatus + ',' + error
            console.log(err);
        },
        complete: function(jqXHR, textStatus){
          that.setState({'occupied': false});
          if(callback){
            callback();
          }
        }
    });
  }

  /*
      End React lifecycle functions.
  */

  /*
      Utility functions:
  */

  notify(event){
    if(event){
      this.retrieveData(this.props.userCode, event, () => {
        this.setState({'editing': true});
      });
    }else{

      //Use default configuration:
      days = config.days;
      timeslots = config.timeslots;
      exceptTimeslots = config.except;

      //Change style properties dynamically:
      columnStyle.width = (100.0 / days.length) + '%';
      timeslotStyle.height = (100.0 / timeslots.length) + '%';

      //Create an empty form:
      this.setState({tableData: this.emptyTableData(days.length, timeslots.length)});
      this.setState({export: this.createMatrix(days.length, timeslots.length)});
      this.setState({editing: true, locked: false});

    }
  }

  onClickSign = (event) => {
    if(!this.state.editing){
        this.setState({'editing': true});
        return;
      }
      this.onSign(event.target);
  }

  //Sets the selection mode of click events.
  setSelectionMode(selectionMode) {
    this.setState({selectionMode: selectionMode});
  }

  createMatrix(columns, rows){
    let matrix = [];
    for(let x = 0; x < columns; x++){
      matrix[x] = [];
      let exceptions = exceptTimeslots[x].timeslots;
      for(let y = 0; y < rows; y++){
        if(exceptions){
          for(let i = 0; i < exceptions.length; i++){
            if(y === exceptions[i]){
              //This timeslot should be click-able
              matrix[x][y] = '-';
              break;
            }
          }
          if(y === matrix[x].length){
            matrix[x][y] = 'a';
          }
        }else{
          matrix[x][y] = 'a';
        }

      }
    }
    return matrix;
  }

  //Returns a TableData 'structure', which is in fact an empty form.
  emptyTableData(width, height){
    let emptyTableData = [];

    for(let x = 0; x < width; x++){
      emptyTableData.push({array: []});
      let exceptions = exceptTimeslots[x].timeslots;
      for(let y = 0; y < height; y++){

        if(exceptions){
          for(let i = 0; i < exceptions.length; i++){
            if(y === exceptions[i]){
              //This timeslot should be click-able
              emptyTableData[x].array.push(<div value={`${x}-${y}`} style={{userSelect: 'none', backgroundColor: 'gray', width: '100%', height: '100%'}}></div>);
              break;
            }
          }
          if(y === emptyTableData[x].array.length){
            emptyTableData[x].array.push(<div value={`${x}-${y}`} style={{userSelect: 'none', backgroundColor: '#81c784', width: '100%', height: '100%'}}></div>);
          }
        }else{
          emptyTableData[x].array.push(<div value={`${x}-${y}`} style={{userSelect: 'none', backgroundColor: '#81c784', width: '100%', height: '100%'}}></div>);
        }

      }
    }

    return emptyTableData;
  }

  //Displays a version in the availability form.
  displayVersion(version){

    this.setState({'editing': true});

    if(version.config){
      days = version.config.columns;
      timeslots = version.config.timeslots;
      exceptTimeslots = version.config.except ? version.config.except : config.except;
       //Change style properties dynamically:
      columnStyle.width = (100.0 / days.length) + '%';
      timeslotStyle.height = (100.0 / timeslots.length) + '%';

      //Create an empty form:
      this.setState({tableData: this.emptyTableData(days.length, timeslots.length)});
      this.setState({export: this.createMatrix(days.length, timeslots.length)});
    }

    let availability = version.availability;

    for(let x = 0; x < availability.length; x++){
      for(let y = 0; y < availability[x].rows.length; y++){
        let value = availability[x].rows[y].value;
        this.setState({'selectionMode': value});
        this.onCellClick(x, y);
      }
    }

    //We make sure this version does not get edited by accident:
    this.setState({'selectionMode': modes[0], 'editing': false});

  }

  //Returns an array of timeslot-indicators, which are html-elements.
  generateTimes(amount) {
    const timeIndicators = [];
    timeslotStyle.height = (100.0 / timeslots.length) + '%';
    for (let i = 0; i < amount; i++) {
      timeIndicators.push(<div id="time-indicator" style={timeslotStyle}>
        <p style={pstyle}>{`${timeslots[i]}`}</p>
      </div>);
    }
    return timeIndicators;
  }

  //Generates a single html-element, containing a table which shows the component's TableData state.
  renderCells = () => {

    let html = [];
    let rows;
    for(let x = 0; x < this.state.tableData.length; x++){
      rows = [];
      let exceptions = exceptTimeslots[x].timeslots;
      for(let y = 0; y < this.state.tableData[x].array.length; y++){
        let clickable = true;
        if(exceptions){
          for(let i = 0; i < exceptions.length; i++){
            if(y === exceptions[i]){
              //This timeslot should NOT be click-able
              clickable = false;
              break;
            }
          }
        }

        let cell = <div className={`timeslot`} onClick={clickable ? this.onTableClick : null} style={timeslotStyle}>{this.state.tableData[x].array[y]}</div>;
        rows.push(cell);
      }
      html.push(<div className={`timecolumn-${x}`} style={columnStyle}>{rows}</div>);
    }

    wrapperStyle.width = (100.0 - (100.0 / (days.length + 1))) + '%';

    return (
      <div className="timeslots-wrapper" style={wrapperStyle}>
      {html}
      </div>
    );

  }

  /*
      End Utility functions.
  */

  /*
    Start control functions:
  */

  onTableClick = (event) => {
    const coordinates = event.target.getAttribute('value');
    let x = coordinates.substring(0, coordinates.indexOf('-'));
    let y = coordinates.substring(coordinates.indexOf('-') + 1, coordinates.length);
    this.onCellClick(x, y);
  }

  //Handles click events on the table of available timeslots, changing the availability of the relevant timeslot to the selection mode.
  onCellClick = (x, y) => {

    if(!this.state.editing){
      //The form may not be edited!
      return;
    }

    let _tableData = this.state.tableData;
    let _export = this.state.export;
    _export[x][y] = this.state.selectionMode;
    switch(this.state.selectionMode){
      case 'a':
        _tableData[x].array[y] = <div value={`${x}-${y}`} style={{userSelect: 'none', backgroundColor: '#81c784', width: '100%', height: '100%'}}></div>;
        break;
      case 'u':
        _tableData[x].array[y] = <div value={`${x}-${y}`} style={{userSelect: 'none', backgroundColor: '#ef5350', width: '100%', height: '100%'}}/>;
        break;
    }
    this.setState({export: _export});
    this.setState({tableData: _tableData});
  }

  //Handles click events on selection mode buttons.
  onModeButtonSelected = (event) => {
    const button = event.target;
    let that = this;
    $('.btn-group-2 .btn.btn-default.active').each(function(index, button){
      this.className = this.className.replace('active', 'inactive');
    });
    button.className = button.className.replace('inactive', 'active');
    switch(button.value){
      case '1':
        this.setState({selectionMode: 'u'});
        break;
      case '2':
        this.setState({selectionMode: 'a'});
        break;
    }
  }

  //Handles click events on the sign button.
  onSign = (button) => {
    //Disable button
    button.innerHTML = 'Wait...';
    button.disabled = true;

    //TODO make a pop up window appear
    this.popUpComponent.show((confirmed) => {

      if(!confirmed){
        //User has not confirmed the pop up message: user does not want to sign.
        button.innerHTML = 'Sign';
        button.disabled = false;
        return;
      }

      //Confirmed: user wishes to sign

      //Get the html of the form:
      let formHTML = document.getElementById('table-container');
      let wrapper = document.createElement('div');
      wrapper.appendChild(formHTML.cloneNode(true));
      wrapper.style.marginLeft = 0;
      if(days.length > 0){
        let column_headers = wrapper.getElementsByClassName('column-header')[0].children;
        for(let i = 0; i < column_headers.length; i++){
          column_headers[i].style.width = Math.floor(100.0 / (days.length + 1)) + '%';
        }
      }
      wrapper.querySelector('#times-column').style.width = Math.floor(100.0 / (days.length + 1)) + '%';
      //This resulting html will be sent to the API, which will make a pdf file out of it
      const resultHTML = wrapper.innerHTML;

      //Let the form show that it's not available for interaction while requesting a form version from the API:
      this.setState({'occupied': true});

      const _export = this.state.export;

      const _columns = [];
      for(let i = 0; i < days.length; i++){//For each day...
        const _timeslots = [];
        for(let j = 0; j < timeslots.length; j++){//And for each timeslot in that day...
          const timeslot = _export[i][j];
          _timeslots[j] = {'value': timeslot};//The timeslot gets added to the corresponding row...
        }
        _columns[i] = {'name': days[i], 'rows': _timeslots};//And the rows get added to the column.
      }

      const teacher_code = this.props.userCode;

      //Construct request object
      const _config = {'columns': days, 'timeslots': timeslots, 'except': exceptTimeslots};
      const requestBody = {
        'teacher_code': teacher_code,
        'version': {
          'counter': '0',
          'teacherLink': '',
          'supervisorLink': '',
          'contentBase64': '',
          'availability': _columns,
          'config': _config
        },
        'version_html': resultHTML
      };

      const that = this;
      //Ajax call to submit a version
      $.ajax({
          'method': 'POST',
          'url': '/api/forms',
          'contentType': 'application/json',
          'processData': false,
          'data': JSON.stringify(requestBody),
          success : function(res){

            console.log(res);

          },
          error : function(jqhr, textStatus, error){
              let err = textStatus + ',' + error
              console.log(err);
          },
          complete: function(jqXHR, textStatus){
            that.setState({'editing': false,'occupied': false});
            if(that.props.parentEvent){
              that.props.parentEvent(that, null);
            }
          }
      });

    });
    
  }

  /*
    End control functions.
  */

  header(){

    if(this.state.occupied){
      return <div id="header" style={controlStyle}></div>;
    }

    if(this.state.locked){
      return (
        <div id="header" style={controlStyle}>
          <h2 style={{'margin': '0 0 0 8px'}}><span className="label label-success">Accepted</span></h2>
        </div>
      );
    }

    var html = (<div id="header" style={controlStyle}>

        <div className="btn-group btn-group-2" role="group" aria-label="..." style={inlineStyle}>
          <button type="button" disabled={!this.state.editing} onClick={this.onModeButtonSelected} className="btn btn-default active" value="1">Unavailable</button>
          <button type="button" disabled={!this.state.editing} onClick={this.onModeButtonSelected} className='btn btn-default inactive' value="2">Available</button>
        </div>

        <button type="button" id="btn-sign" onClick={this.onClickSign} disabled={this.state.occupied} className="btn btn-default" style={titleStyle}>{this.state.editing ? "Sign" : "Edit"}</button>

        <h2 style={{'margin': '0 0 0 8px'}}><span className="label label-default">{this.state.editing ? "" : "Submitted"}</span></h2>

      </div>);

    return html;
  }

  columnHeaders(){
    var html = [];
    headerItemStyle.width = (100.0 / (days.length + 1)) + '%';

    html.push(<div style={headerItemStyle}></div>);//First, empty item to compensate for the times-column
    for(let i = 0; i < days.length; i++){
      html.push(<div style={headerItemStyle}><h4>{days[i]}</h4></div>);
    }
    return (
      <div className="column-header" style={headerStyle}>
        {html}
      </div>
    );
  }

  identifierColumn() {
    var html = [];
    timesColumnStyle.width = (100.0 / (days.length + 1)) + '%';
    for (let i = 0; i < timeslots.length; i++) {
      html.push(<div style={timeslotStyle}>

        <p style={pstyle}>{`${timeslots[i]}`}</p>

      </div>);
    }
    return (
      <div id="times-column" style={timesColumnStyle}>
        {html}
      </div>
    );
  }

  formTable(){

    const formTableJSX = (
        <div id="table-container">
          {this.columnHeaders()}
          <div style={contentStyle}>
            {this.identifierColumn()}
            {this.renderCells()}
          </div>
        </div>
    );

    let overlayJSX;

    if(this.state.occupied){
      overlayJSX = (<div style={{'color': 'red', 'backgroundColor': 'white', 'position': 'absolute', 'left': '0', 'top': '0', 'width': '100%', 'height': '100%'}}>Please wait...</div>);
    }

    return (
      <div className="root-container" style={containerStyle}>
        {formTableJSX}
        {overlayJSX}
      </div>
    );

  }

  render(){

    let header;
    const currentUser = sessionStorage.getItem('username');

    if(currentUser === this.props.userCode){
      header = this.header();
    }else{
      header = <div id="header"></div>;
    }

    return (
        <div key={this.props.userCode} className="panel panel-default" id="availability-form">
          {header}
          {this.formTable()}
          <PopUpComponent title="Sign this form" message="This form can be signed without an external party. Please confirm that you wish to sign." ref={(PopUpComponent) => { this.popUpComponent = PopUpComponent; }}/>
        </div>

      );
  }

}
