const express = require('express');
const config = require('./config.js');
const mysql = require('mysql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Forms = require('./mongoosemodels/formModel');
const Users = require('./mongoosemodels/userModel');


const app = express();
const port = config.port;

mongoose.model('Forms');
mongoose.model('Users');

// Connect to mongodb database
mongoose.Promise = global.Promise;
mongoose.connect(config.mongouri, (err) => {
  if (err) {
    console.log(`error with the mongodb: ${err}`);
  }
  console.log('mongo connected succesfully');
});

const routes = require('./routes.js');
app.use(express.static('static'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static(path.resolve(__dirname, 'client-out')));
app.get('*.html', function (request, response) {
	response.sendFile(path.resolve(__dirname, 'client-out', 'index.html'));
});
// TODO: turn routes into a proper Express Route and set it to /api, so that it no longer runs the auth middleware on html requests and we can remove the .html matcher
routes(app);

app.listen(port);
console.log(`server started on: localhost:${port}`);
