/*
  CSS styling information
*/

const divStyle = {
	display: 'flex',
 	backgroundColor: 'rgb(165,200,66)',
 	width: '25vw',
 	height: '25vh',
 	color: 'white',
  	overflow: 'auto',
  	alignItems: 'center',
  	justifyContent: 'center'
};

const pStyle = {
  	display: 'block',
  	fontSize: '1em',
  	fontWeight: '100',
  	margin: '1.5em 0em -1em 0em',
  	padding: '0 0 0 0'
};

const inputStyle = {
 	  width: '15vw',
  	margin: '0',
 	  padding: '0',
  	borderRadius: '5px',
  	borderStyle: 'solid',
  	borderColor: 'white'
};

const submitStyle = {
  	width: '15vw',
  	margin: '2.5em 0 0 0',
  	padding: '0',
  	fontWeight: '100',
  	borderRadius: '5px',
  	borderStyle: 'solid',
  	borderColor: '#e7e7e7'
};

/*
 JavaScript external scripts
*/

function getData() {
  	return { username: document.getElementById('username').value, password: document.getElementById('password').value };
}

function onSubmitClick() {
  	const formData = getData();
  	const username = formData.username;
  	const password = formData.password;

  	if (username && password) {
		$.ajax({
	  		url: '/auth',
	  		type: 'POST',
	  		dataType: 'json',
	  		data: formData,
	  		success(data) {
				console.log(data);
		if (data.success) {
		  sessionStorage.setItem('jsonwebtoken', data.token);
		} else {
		  alert('Authentication failed: username or password incorrect');
		}
	  }
	});
  } else if (!username && !password) {
	alert('Please fill in your username and password');
  } else if (username) {
	alert('Please fill in your password');
  } else {
	alert('Please fill in your username');
  }
}

/*
 HTML objects with inline styling
*/

function InputBox(UsedFor, Type) {
  return (<div id={`id-${UsedFor}`}>
	<p style={pStyle}>{UsedFor}</p>
	<br />
	<input type={Type} id={UsedFor} name={UsedFor} style={inputStyle} />
  </div>);
}

function LoginBlockComponent() {
  return (<div id="login-block" style={divStyle}>
	<form id="login-form">
	  {InputBox('username', 'text')}
	  {InputBox('password', 'password')}
	  <input type="button" value="Login" style={submitStyle} id="submit-button" onClick={onSubmitClick} />
	</form>
  </div>);
}


/*
  Render object on page
*/

// ReactDOM.render(
//   LoginBlockComponent(),
//   document.getElementById('root')
// );
