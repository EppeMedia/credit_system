
/*
  CSS styling information
*/

const logoutStyle = {
  display: 'flex',
  backgroundColor: 'rgb(165,200,66)',
  width: '5vw',
  height: '5vh',
  color: 'white',
  overflow: 'auto',
  alignItems: 'center',
  justifyContent: 'center'
};

/*
 JavaScript external scripts
*/

function onClick() {
  sessionStorage.removeItem('jsonwebtoken');
}

/*
 HTML objects with inline styling
*/

function logoutButton() {
  return (
    <div id="logout-button" style={logoutStyle} onClick={onClick}>
      <p>Log out</p>
    </div>
  );
}
