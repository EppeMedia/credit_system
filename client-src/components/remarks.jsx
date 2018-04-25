const _remark_containerStyle = {

  position: 'absolute',
  right: '0',
  top: '0',
  bottom: '0',
  backgroundColor: '#F5F5F5'
};

const _remark_remarkContainerStyle = {
  height: '93%',
  backgroundColor: '#F5F5F5',
  overflow: 'scroll'
};

const _remark_remarkStyle = {
  height: 'auto',
  margin: '1% 1% 1% 1%',
  backgroundColor: '#E6E6E6'
};

const _remark_h1Style = {
  display: 'inline-block',
  fontWeight: '100',
  fontSize: '1.2em',
  padding: '1% .5% .5% 2%',
};

const _remark_h2Style = {
  display: 'inline-block',
  fontSize: '1em',
  padding: '2% 2% .5% .5%',
  color: '#4EAD25'
};

const _remark_pStyle = {
  padding: '0% 2% 2% 2%'
};

const _remark_inputStyle = {
  height: '5%',
  width: '98%',
  margin: '1% 1% 1% 1%',
  padding: '0'
};

const _remark_textBoxStyle = {
  display: 'inline-block',
  width: '95%',
  height: '100%',
  fontSize: '1.3em',
  margin: '0',
  padding: '0'
};

const _remark_submitStyle = {
  display: 'inline-block',
  width: '5%',
  height: '100%',
  verticalAlign: 'top',
  margin: '0',
  padding: '0'
};

class RemarkComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { remarks: '', input: '' };
  }

  componentDidMount() {
    // TODO get remarks from API here and safe into variable
    this.updateEvents();
  }

  updateEvents(){
    let self = this;

    if (this.props.formId) {
          $.ajax({
              type : 'GET',
              url : `/api/forms/${self.props.formId}/events`,
              contentType : 'application/json',
              success : function(res){
                  self.setState({ remarks: res.form.events });

              },
              error : function(jqhr, textStatus, error){
                  let err = textStatus + ',' + error
                  console.log(err);
              }
          });
    } else {
      $.ajax({
              type : 'GET',
              url : '/api/forms/897723498/events',
              contentType : 'application/json',
              success : function(res){
                  self.setState({ remarks: res.form.events });

              },
              error : function(jqhr, textStatus, error){
                  let err = textStatus + ',' + error
                  console.log(err);
              }
          });
    }

  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const element = document.getElementById('remarkContainer');
    element.scrollTop = element.scrollHeight;
  }

  loadRemarks() {
    const html = [];

    for (const remark in this.state.remarks) {
      html.push(
        <div
          className="remark"
          style={_remark_remarkStyle}
        >
          <h1 style={_remark_h1Style}>{this.state.remarks[remark].teacher_code}</h1>
          <p style={_remark_pStyle}>{this.state.remarks[remark].text}</p>
        </div>);
    }

    return (html);
  }

  putRemark() {
    // TODO get logged in user data (role and name) to put in remark
    // TODO push remark to this form through API

    if (this.state.input) {
      let event = {'teacher_code' : 'System', 'text' : this.state.input}
      let jsonEvent = JSON.stringify(event);
      let self = this;

      if (this.props.formId) {
          $.ajax({
              type : 'POST',
              url : `/api/forms/${this.props.formId}/events`,
              dataType : 'application/json',
              data: event,
              success : function(res){
                  alert("event added successfully");
                  self.updateEvents();
              },
              error : function(jqhr, textStatus, error){
                  let err = textStatus + ',' + error
                  console.log(err);
                  self.updateEvents();
              }
          });
      } else {
          $.ajax({
              type : 'POST',
              url : '/api/forms/897723498/events',
              dataType : 'application/json',
              data: event,
              success : function(res){
                  alert("event added successfully");
                  self.updateEvents();
              },
              error : function(jqhr, textStatus, error){
                  let err = textStatus + ',' + error
                  console.log(err);
                  self.updateEvents();
              }
          });

          this.setState({ input: '' });
      }
    } else {
      alert('please fill in a remark before submitting');
    }
  }

  handleInput(event) {
    this.setState({ input: event.target.value });
  }

  handleEnter(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.putRemark();
    }
  }

  inputBox() {
    return (
      <form style={_remark_inputStyle} onSubmit={this.putRemark.bind(this)}>
        <input
          type="text"
          placeholder="Type your remark here"
          style={_remark_textBoxStyle}
          id="remarkField"
          value={this.state.input}
          onChange={this.handleInput.bind(this)}
          onKeyDown={this.handleEnter.bind(this)}
        />
        <input
          type="button"
          value="Submit"
          style={_remark_submitStyle}
          onClick={this.putRemark.bind(this)}
        />
      </form>
    );
  }

  render() {
    if (this.props.formId || this.state.remarks) {
          return <div style={_remark_containerStyle}> <div style={_remark_remarkContainerStyle} id="remarkContainer"> {this.loadRemarks()}</div> {this.inputBox()} </div>;
    } else {
      return <div></div>
    }
  }
}
