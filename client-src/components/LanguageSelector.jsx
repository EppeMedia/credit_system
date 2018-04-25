

class LanguageSelector extends React.Component{
	constructor(props) {
	    super(props);
	    this.state = {
        	language: ["english", "dutch"]
      	};
	}

	onLanguageSelected(selectedLanguage){

		sessionStorage.setItem('languagePack', selectedLanguage);

		$("#language").text(selectedLanguage);

		window.location.reload(false);
	}

  	render() {
		return (
			<div className="btn-group">
					<button className="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<span id="language">{translationStrings[sessionStorage.getItem('languagePack')].firstLanguage}</span> <span className="caret"></span>
			  	</button>
			  	<ul className="dropdown-menu">
					{this.state.language.map(function(item) {
						return <li key={item}><a href="#" onClick={this.onLanguageSelected.bind(this, item)}>{item}</a></li>;
					}, this)}
			  	</ul>
			</div>
		)
  	}
}
