const pageStyle = {
	width: '100%',
	height: '100%',
	backgroundColor: '#FFFFFF'
};

const contentPanelStyle = {
	position: 'absolute',
	bottom: '0',
	right: '0',
	overflowY: 'auto'
};

const leftPanelStyle = {
	width: '49.5%',
	height: '100%'
};

const rightPanelStyle = {
	width: '49.5%',
	height: '100%'
};

const _root_splitStyle = {
	width: '100%',
	height: '100%',
	display: 'flex'
};

class RootComponent extends React.Component {

	constructor(props){
		super(props);
		this.state = {contentComponent: null};
	}

	parentEvent = (component, event) => {
		if(component === this.leftComponent){
			if(this.rightComponent.notify){
				this.rightComponent.notify(event);
			}
		}else if(component === this.rightComponent){
			if(this.leftComponent.notify){
				this.leftComponent.notify(event);
			}
		}else{
			if(this.rightComponent.notify){
				this.rightComponent.notify(event);
			}
			if(this.leftComponent.notify){
				this.leftComponent.notify(event);
			}
		}
	}

	componentWillMount(){
		let contentComponent = [];
		if(this.props.contentComponent){
			contentComponent = this.props.contentComponent;
		}else{
			let splitComponent = [];
			if(this.props.leftComponent){
				const _leftComponent = React.cloneElement(
			      this.props.leftComponent,
			      {
			      	parentEvent: this.parentEvent,
			      	ref: (LeftComponent) => {
			      		this.leftComponent = LeftComponent;
			      	}
			      }
			    );
				splitComponent.push(<div id="left-content-panel" style={leftPanelStyle}>{_leftComponent}</div>);
			}
			if(this.props.rightComponent){
				const _rightComponent = React.cloneElement(
			      this.props.rightComponent,
			      {
			      	parentEvent: this.parentEvent,
			      	ref: (RightComponent) => {
			      		this.rightComponent = RightComponent;
			      	}
			      }
			    );
				splitComponent.push(<div id="right-content-panel" style={rightPanelStyle}>{_rightComponent}</div>);
			}
			contentComponent.push(<div className="component_container" id="edit-form-root" style={_root_splitStyle}>{splitComponent}</div>);
		}

		this.setState({contentComponent: contentComponent});
	}

	render(){
		return (
			<div style={pageStyle}>
				<Sidebar roles={this.state.roles}/>
				<Header username={this.state.firstName} onLogout={this.props.onLogout}/>
				<div className="content-panel" style={contentPanelStyle}>
					{this.state.contentComponent}
				</div>
			</div>
		)
	}
}
