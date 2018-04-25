'use strict'
const mongoose = require('mongoose');
const RSVP = require('rsvp');
const soap = require('soap');
const config = require('../config.js');
const time_config = require('../config/time_config.js');
const htmlPDF = require('html-pdf');
const base64Stream = require('base64-stream');
const json2csv = require('json2csv');

const Form = mongoose.model('Forms');
const Event = mongoose.model('Events');
const Version = mongoose.model('Versions');
const Users = mongoose.model('Users');

/**
  Presents a CSV formatted export of all forms in the system related
  to the currently set quartile and year.
*/
exports.formExport = function (req, res) {

  if (req.params.timestamp == null || req.params.timestamp == undefined) {

    const supervisorCode = req.query.supervisorCode;

    const user_includes = 'userCode';
    Users.find({supervisorCode: supervisorCode}, user_includes).exec((err, users) =>{
      if (err) return res.json({ succes: false, error: err });
      if (!users) return res.json({ success: false, error: 'Users not found!' });


      const includes = 'teacher_code versions locked';
      Form.find({}, includes).exec((err, forms) => {
        if (err) return res.json({ success: false, error: err });
        if (!forms) return res.json({ success: false, error: 'Forms not found!' });

        const fields = [];
        const data = [];
        let formConfig;

        for(let i = 0; i < forms.length; i++){
          const form = forms[i];
          for(let j = 0; j < users.length; j++){
            const user = users[j];
            if(user.userCode === form.teacher_code){

              const version = form.versions ? form.versions[form.versions.length - 1] : null;
              if(!version){
                continue;
              }

              if (!formConfig && version.config) {
                  formConfig = version.config;
                  fields.push('teacherCode');

                  for (var a = 0; a < formConfig.columns.length; a++) {
                    for (var b = 0; b < formConfig.timeslots.length; b++) {
                      fields.push(a + '_' + formConfig.timeslots[b]);
                    }
                  }
              }

              if (version.date >= req.query.timestamp) {

                const itemData = {};
                const availabilityItem = version.availability;

                itemData[fields[0]] = form.teacher_code;
                let counter = 1;

                for (var n = 0; n < availabilityItem.length; n++) {
                  const dayItem = availabilityItem[n];

                  for (var k = 0; k < dayItem.rows.length; k++) {
                    itemData[fields[counter]] = dayItem.rows[k].value;
                    counter += 1;
                  }
                }

                data.push(itemData);
              }
            }

            }
          }

          let csv = json2csv({data: data, fields: fields});

          res.setHeader('Content-disposition', 'attachment; filename=export.csv');
          res.set('Content-Type', 'text/csv');
          res.status(200).send(csv);
      });

    });
  } else{
    res.status(400).send('No timestamp given');
  }
};

/**
 * Present a list of forms.
 * @param  {nothing}
 * @param  {json} res the json array with all the forms
 */
exports.allForm = function (req, res) {
  Form.find({}).exec((err, forms) => {
    if (err) return res.json({ success: false, error: err });
    if (!forms) return res.json({ success: false, message: 'no form in the database' });
    res.json({ success: true, forms });
  });
};

/**
 * Insert a form into the collection.
 * @param  {json} req correctly formated json object in the body
 * @param  {[son} res the added form
 * @return {json}     if some error occours
 */
exports.addForm = function (req, res) {
  const form = new Form(req.body);
  form.save((err, data) => {
    if (err) return res.json({ succes: false, message: err });
    res.json({ success: true, form: data });
  });
};

/**
 * Gives the metadata and latest version of the specified form.
 * @param  {params} req fromId
 * @param  {json} res form
 * @return {json}
 */
exports.getForm = function (req, res) {
  const includes = 'id teacher_code quartile study_year locked versions';
  Form.findOne({ id: req.params.formId }, includes).exec((err, form) => {
    if (err) return res.json({ success: false, error: err });
    if (!form) return res.json({ success: false, error: 'form not found' });
    if (form.versions.length > 1) form.versions = form.versions[form.versions.length - 1];
    res.json({ succes: true, form });
  });
};

exports.getSubmittedForms = function(req, res){

  const supervisorCode = req.body.supervisorCode;

  const user_includes = 'userCode';
  Users.find({supervisorCode: supervisorCode}, user_includes).exec((err, users) =>{
    if (err) return res.json({ succes: false, error: err });
    if (!users) return res.json({ success: false, error: 'Users not found!' });

    let quartile = req.body.quartile;
    if(!quartile){
      quartile = time_config.quartile;
    }


    const includes = 'teacher_code versions';
    Form.find({quartile: quartile, study_year: time_config.study_year }, includes).exec((err, forms) => {
      if (err) return res.json({ success: false, error: err });
      if (!forms) return res.json({ success: false, error: 'Forms not found!' });

      let resultUsers = [];

      for(let i = 0; i < users.length; i++){
        const user = users[i];

        for(let j = 0; j < forms.length; j++){
          const form = forms[j];
          if(!form.versions.length){
            continue;
          }
          const version = form.versions[form.versions.length - 1];
          if(version.locked || form.teacher_code !== user.userCode){
            continue;
          }
          resultUsers.push({userCode: user.userCode});
        }

      }

      res.json({ succes: true, result: resultUsers});

    });

  });

};

/**
 * Gives the specified version of a form.
 * Alternatively gives the most recently submitted version, if no version id is specified.
 */
exports.getVersion = function(req, res){

  let quartile = req.body.quartile;
  if(!quartile){
    quartile = time_config.quartile;
  }

  const teacher_code = req.body.teacher_code;
  const formId = `${teacher_code}.${time_config.study_year}.${quartile}`;

  Form.findOne({ id: formId }).exec((err, form) => {
    if (err) return res.json({ success: false, error: err });
    if (!form) return res.json({ success: false, error: 'Form not found' });

    const amountVersions = form.versions.length;
    if(amountVersions === 0) return req.json({success: false, error: `No versions available in form: ${formId}`});

    let counter = req.body.counter;
    if(!counter){
      counter = amountVersions - 1;
    }

    const version = form.versions[counter];

    const responseObj = {
      'quartile': quartile,
      'locked': version.locked,
      'version': version
    };

    res.json({ succes: true, 'content': responseObj });
  });
}

/**
 * Gives all versions of the specified form.
 * @param  {params} req fromId
 * @param  {json} res versions
 * @return {json}     if error occours
 */
exports.allVersion = function (req, res) {
  const includes = 'id versions';
  Form.findOne({ id: req.params.formId }, includes).exec((err, form) => {
    if (err) return res.json({ success: false, error: err });
    if (!form) return res.json({ success: false, error: 'form not found' });
    res.json({ succes: true, form });
  });
};

/**
 *  Add a new version to the form.
 * @param  {params json} req params: formId, json: Version object in correctly fromated JSON!!!!!
 * @param  {[type]} res [description]
 * @return {json}     if error occours
 */
exports.addVersion = function (req, res) {

  const version = new Version(req.body.version);
  const teacher_code = req.body.teacher_code;

  const formId = `${teacher_code}.${time_config.study_year}.${time_config.quartile}`;

  Form.findOne({ id: formId }).exec((err, form) => {

    if (err) return res.json({ success: false, error: err });//If an error occurred, send that error message through a response

    if (!form){
      //If we are trying to add a version to a non-existing form, we will first create the form:
      const formObj = {
        'id': formId,
        'teacher_code': teacher_code,
        'quartile': time_config.quartile,
        'study_year': time_config.study_year,
        'locked': false,
        'versions': [],
        'events': []
      }
      form = new Form(formObj);
    }

    const versionCount = form.versions.length;

    version.counter = versionCount ? (form.versions[form.versions.length - 1].counter + 1) : 0;//Update the version counter, giving it a unique identifier for a version. Also makes it easy to sort versions in order of adding them.

    if(!req.body.version_html){
      res.json({succes: false, error: "No version_html was specified: no pdf can be created!"});
      return;
    }

    let formBase64 = '';
    htmlPDF.create(req.body.version_html).toStream(function(err, stream){
      stream.pipe(base64Stream.encode()).on('data', (chunk) => {

        //Base64 representation of the formPDF
        formBase64 += chunk;

      }).on('finish', () => {

        //After converting the html to base64 encoded pdf, we save this pdf, the version and the form in the database:
        version.contentBase64 = formBase64;

        //Save timestamp for this version
        version.date = Date.now();
        version.locked = false;

        form.versions.push(version);
        const event = new Event({ teacher_code: form.teacher_code, text: `New Version submitted by ${form.teacher_code}`});//TODO: check this!
        form.events.push(event);
        form.save();

        //We respond that the operation was a succes
        res.json({ succes: true, version});

      });
    });

  });

};

exports.getVersionHistory = function(req, res){
  const teacher_code = req.params.teacher_code;
  if(!teacher_code) return res.json({succes: false, error: 'Teacher code must be supplied as a parameter!'});

  let quartile = req.body.quartile;
  if(!quartile){
    quartile = time_config.quartile;
  }

  const formId = `${teacher_code}.${time_config.study_year}.${quartile}`;
  Form.findOne({ id: formId }).exec((err, form) => {
    if (err) return res.json({ succes: false, error: err });
    if (!form) return res.json({ succes: false, error: 'Form not found' });

    const versions = form.versions;
    const result = [];

    for(let i = 0; i < versions.length; i++){
      const version = versions[i];
      result.push({
        locked: version.locked,
        date: version.date,
        version: version.counter
      });
    }

    res.json({succes: true, items: result});

  });

};

exports.educationalProgramForms = function(req, res){
  let allForm;

  console.log('called');
  Form.find({}).exec((err, forms) => {
    if (err) {
      console.log(err);
    } else if (!forms) {
      console.log('no form found');
    } else {
      allForm = forms;
    }
  });

  function getData () {
    return new RSVP.Promise((fulfill, reject) => {
      let rep = { users: [] };
      Users.find({},{password: 0}).exec((err, users) =>{
        for (const user of users) {
          for (const educationalProgram of user.educationalPrograms) {
            if (educationalProgram.id = req.params.educationalProgramId) rep.users.push(user);
          };
        };
        fulfill(rep);
      });
    });
  };

function response (rep){
  let rep2 = [];
  for (const user of rep.users) {
    for (const form of allForm) {
      if (form.teacher_code === user.userCode) {
        rep2.push(form);
      };
    };
  };
  res.json({success: true, forms: rep2});
}

getData()
    .then(response);
};

/**
 * Gives all events (comments, etc.) of the specified form.
 * @param  {params} req fromId
 * @param  {json} res events
 * @return {json}     if error occours
 */
exports.allEvent = function (req, res) {
  const includes = 'id events';
  Form.findOne({ id: req.params.formId }, includes).exec((err, form) => {
    if (err) return res.json({ success: false, error: err });
    if (!form) return res.json({ success: false, error: 'form not found' });
    res.json({ succes: true, form });
  });
};

/**
 *  Add a new event to the form.
 * @param  {json} req correctly formated evvent object
 * @param  {json} res the form object
 * @return {jron}    if error occouirs
 */
exports.addEvent = function (req, res) {
  const event = new Event(req.body);
  Form.findOne({ id: req.params.formId }).exec((err, form) => {
    if (err) return res.json({ success: false, error: err });
    if (!form) return res.json({ success: false, error: 'form not found' });
    form.events.push(event);
    form.save();
    res.json({ succes: true, form });
  });
};

// TODO error handling
/**
 * all teacher and their forms belonging to superviros
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.supervisorForms = function (req, res) {
  let allForm;
  Form.find({}).exec((err, forms) => {
    if (err) {
      console.log(err);
    } else if (!forms) {
      console.log('no form found');
    } else {
      // user.push(form.versions[form.versions.length - 1]);
      // forms = forms
      allForm = forms;
    }
  });


  function getTeacherList() {
    return new RSVP.Promise((fulfill, reject) => {
      Users.find({ supervisorCode: req.params.supervisorUserCode }, { password: 0 }).lean().exec((err, users) => {
        if (err) {
          reject(err);
        } else if (!users) {
          reject('no user found');
        } else {
          fulfill(users);
        }
      });
    });
  }

  function addAllData(users) {
    for (const user of users) {
      for (const form of allForm) {
        if (user.userCode === form.teacher_code) {
          user.form = form.versions[form.versions.length - 1];
        }
      }
    }
    res.json(users);
  }

  function errorHandler(err) {
    console.log(err);
  }
  getTeacherList()
    .then(addAllData, errorHandler);
};

/**
 * Present a list of forms belonging to the user related to the specified teacher code.
 * @param  {params} req teacher_code
 * @param  {json} res forms list
 * @return {json}     error
 */
exports.teacherForms = function (req, res) {
  Form.find({ teacher_code: req.params.teacher_code }).exec((err, forms) => {
    if (err) return res.json({ succes: false, error: err });
    if (!forms) return res.json({ success: false, error: 'no forms found' });
    res.json({ success: true, forms });
  });
};

function findForms(users, callback) {
  const data = { users: [] };
  for (const user of users) {
    Form.findOne({ teacher_code: user.userCode }).exec((err, form) => {
      if (err) {
        console.log(err);
      } else if (!form) {
        console.log('no form found');
      } else {
        const newUser = { userCode: user.userCode, firstName: user.firstName, secondName: user.secondName, DOB: user.DOB, FTE: user.FTE, version: form.versions[form.versions.length - 1] };
        data.users.push(newUser);

        // user.push(form.versions[form.versions.length - 1]);
        console.log('after append');
        console.log(data);
      }
    });
    return callback(data);
  }
}

exports.getFormStatus =  function (req, res){
  var args = {'API_KEY': config.zynyoApiKey,
              'documentUUID': req.params.documentUUID};

  soap.createClient(config.zynyoLink, function(err, client) {
   client.getStatusUpdate(args, function(err, result) {
       res.json(result);
   });
 });
}


/**
 * retrive an already signed form
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getSignedForm = function(req,res){
  var args = {'API_KEY': config.zynyoApiKey,
              'documentUUID': req.params.documentUUID};

  soap.createClient(config.zynyoLink, function(err, client) {
   client.getSignedDocument(args, function(err, result) {
       res.json(result);
   });
 });

}
exports.testEcho = function (req, res){
  const content = req.body.content;
  res.json({content});
}

exports.signForm = function(req, res){

  let quartile = req.body.quartile;
  if(!quartile){
    quartile = time_config.quartile;
  }

  const teacher_code = req.body.teacherCode;
  const formId = `${teacher_code}.${time_config.study_year}.${quartile}`;

  Form.findOne({ id: formId }).exec((err, form) => {
    if (err) return res.json({ success: false, error: err });
    if (!form) return res.json({ success: false, error: 'Form not found' });

    const amountVersions = form.versions.length;
    if(amountVersions === 0) return req.json({success: false, error: `No versions available in form: ${formId}`});

    form.versions[amountVersions - 1].locked = true;
    form.save();

    res.json({ succes: true});
  });

}

/**
 * send form to sign
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.signFormZynyo = function ( req, res){
  let teacher;
  let supervisor;
  console.log(req.body.teacher_code);
  Users.findOne({userCode: req.body.teacher_code}, 'firstName secondName userCode email phoneNumber supervisorCode').exec((err, user) => {
    if (err) res.json({success: false, error: err});
    if (!user) res.json({success: false, error: 'User not found'});
    teacher = user;

    Users.findOne({userCode: teacher.supervisorCode}, 'firstName secondName userCode email phoneNumber').exec((err, superV) =>{
      if (err) res.json({success: false, error: err});
      if (!superV) res.json({success: false, error: 'Supervisor not found'});
      supervisor = superV;

      Form.findOne({teacher_code: teacher.userCode}).exec((err, form) => {
        if (err) return res.json({success: false, error: err});
        if (!form) return res.json({success: false, error: 'form not found'});

        let formBase64 = '';
        htmlPDF.create(req.body.formHTML).toStream(function(err, stream){
          base64Stream.setEncoding('utf8');
          stream.pipe(base64Stream.encode()).on('data', (chunk) => {
            //Base64 representation of the formPDF
            formBase64 += chunk;
          });
        });

        let args = {
          'API_KEY': config.zynyoApiKey,
          'documentInfo': {'name': 'test signatories', 'description': 'The '},
          'signatories':
            {'signatory':
              [{
              'name': teacher.firstName + ' ' + teacher.secondName,
              'email': teacher.email,
              'role': 'SIGN',
              'authenticationMethod': {
                  'smsTan': {
                  'mobilePhone': teacher.phoneNumber,
                  'authType': 'AFTERVIEW'
                  }
              },
              'locale': 'en_US'
            },
            {
                'name': supervisor.firstName + ' ' + supervisor.secondName,
                'email': supervisor.email,
                'role': 'SIGN',
                'authenticationMethod': {
                  'smsTan': {
                    'mobilePhone': supervisor.phoneNumber,
                    'authType': 'AFTERVIEW'
                  }
                },
                'locale': 'en_US'
              }
            ]
            },
          'useTimeStamp': false,
          'enableLTV' : false,
          'content': formBase64
        }


        soap.createClient(config.zynyoLink, function(err, client) {
         client.signDocumentRequest(args, function(err, result) {

          //TODO: Create new Version?

          const version = {
            counter: form.versions.length,
            //documentID: result.documentUUID,Zynyo's document id
            teacherLink: result.signatoryLink[0].documentLink,
            supervisorLink: result.signatoryLink[1].documentLink,
            //contentBase64: result.,
            availability: [availability_column]
          };

           console.log(form.versions[form.versions.length - 1].id);
           form.versions.push(new Version(version));

           form.events.push(new Event({ teacher_code: form.teacher_code, text: 'Form submitted for signing!' }));

           form.save();
           res.json(result);

         });
       });
     });
    })
  });
};
