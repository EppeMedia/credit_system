const QWE_leftPanelStyle = {
	width: '70%',
	height: '100%'
};

const QWE_rightPanelStyle = {
	width: '30%',
	height: '100%',
	display: 'none'
};

class EditFormComponent extends React.Component{
	constructor(props) {
	    super(props);
	    this.state = {currentFormId: null};
  	}

  	showRemarks(formId){

		this.setState({
      		currentFormId: formId
    	});

		this.forceUpdate();
	}

	render(){
		return (
			<div className="component_container" id="edit-form-root" >
				<div style={QWE_leftPanelStyle}><FormComponent userCode={this.props.selectedUser} onFormLloaded={this.showRemarks.bind(this)}/></div>
				<div style={QWE_rightPanelStyle}><RemarkComponent  formId={this.state.currentFormId}/></div>
			</div>
		);
	}
}
