/*
CSS styling informationn
*/

const backGroundContainerCSS = {
  display: "flex",
  position: "absolute",
  top: "0",
  zIndex: "9",
  width: "100%",
  height: "100%",
  magin: "0",
  padding: "0",
  backgroundColor: "rgba(70, 70, 70, 0.5)",
  alignItems: "center",
  justifyContent: "center"
}

const foreGroundContainerCSS = {
  width: "40%"
}

const titleCSS = {
  color: "#1CD427"
}

const buttonContainerStyle = {
  display: "flex",
  float: "right",
}

const buttonStyle = {
  marginLeft: "8px"
}

class PopUpComponent extends React.Component {

  constructor(props){
    super(props);
    const display = props.display ? true : false;
    this.state = {display};
  }

  onCancel = () => {
    if(this.state.callback){
      this.state.callback(false);
    }
    this.setState({'display': false});
  }

  onConfirm = () => {
    if(this.state.callback){
      this.state.callback(true);
    }
    this.setState({'display': false});
  }

  show(callback){
    this.setState({'callback': callback, 'display': true});
  }

  render(){

    if(this.state.display){
      return (
        <div id="pop-up-container" style={backGroundContainerCSS}>
          <div id="pop-up" className="panel panel-success" style={foreGroundContainerCSS}>
            <div className="panel-heading">
              <h3 className="panel-title">{this.props.title}</h3>
            </div>
            <div className="panel-body">
              <p>{this.props.message}</p>
              <div style={buttonContainerStyle}>
                <input id="btn-cancel" className="btn btn-default" value="Cancel" type="button" onClick={this.onCancel}/>
                <input id="btn-confirm" className="btn btn-default" value="Confirm" style={buttonStyle} type="button" onClick={this.onConfirm}/>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id="pop-up-container"></div>
    );
    
  }

}
