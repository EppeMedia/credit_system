const efp_leftPanelStyle = {
  width: '49.5%',
  height: '100%',
  position: 'relative',
  top: '0px',
  height: 'calc(100% - 140px)'
};

const efp_controlStyle = {
  height: '67px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: '#e2e2e2',
  alignItems: 'center',
  justifyContent: 'center'
};

class ExportFormsPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  onExport = (timemilliseconds) => {

    window.location = 'http://localhost:3000/api/forms/export?timestamp=' + timemilliseconds + '&supervisorCode=' + sessionStorage.getItem('username');

  }

  checkValidDate = () => {
    const value = document.getElementById('date-input').value;
    const array = value.split('-');

    let days = parseInt(array[0]);
    const months = parseInt(array[1]);
    const years = parseInt(array[2]);
    let milliseconds = 0;

    if (value === '' || value == null) {
      this.onExport(milliseconds);
    } else if (months == 2 && days <= 28) {
      milliseconds = new Date(years, months-1, days).getTime();
      this.onExport(milliseconds);
    } else if (days > 0 && days <= 31 && (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) && years >= 2000 && years <= 9999){
      milliseconds = new Date(years, months-1, days).getTime();
      this.onExport(milliseconds);
    } else if (days > 0 && days <= 30 && (months == 4 || months == 6 || months == 9 || months == 11) && years >= 2000 && years <= 9999) {
      milliseconds = new Date(years, months-1, days).getTime();
      this.onExport(milliseconds);
    } else {
      this.popUpComponent.show((confirmed) => {
      });
    }
  }

  render(){

    return (
      <div>
        <p>Please specify from which date forward forms have to be exported (eg. 31-12-2015)</p>
        <input type="text" id="date-input"/>
        <p>Exports will only include availability forms which have been accepted.</p>
        <button type="button" id="btn-accept" onClick={this.checkValidDate} className="btn btn-primary">Export to CSV</button>
        <PopUpComponent title="Invalid input" message="Date is incorrect." ref={(PopUpComponent) => { this.popUpComponent = PopUpComponent; }}/>
      </div>
    );

  }

}
