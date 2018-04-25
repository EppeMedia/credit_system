'use strict'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RSVP = require('rsvp');
const config = require('../config.js');
const mongoose = require('mongoose');

const Users = mongoose.model('Users');



/**
 * login functionality
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.login = function (req, res) {
  Users.findOne({ username: req.body.username }).then(user => {
    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, bool) => { // quoted string should be DB hash
        user = { username: req.body.username };
        if (bool) {
          const token = jwt.sign(user, config.jwtSecret, { expiresIn: '20m' });
          res.json({
            success: true,
            message: 'User authenticated',
            token
          });
        } else {
          res.json({
            success: false,
            message: 'Password incorrect'
          });
        }
      });
    } else {
      res.json({
        success: false,
        message: 'Username incorrect'
      });
      console.log('no user found');
    }
  });
};

/**
 * Register new user to the system
 * @param  {} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.register = function (req, res) {
  if (!req.body) return res.json({ success: false, error: 'body is missing' });

  if(req.body.registerSecret !== config.registerSecret){
    return res.json({success: false, error: 'Unauthorized registration attempt!'});
  }

  var newUser = new Users(req.body);
  newUser.balance = 0;
  if(!req.body.admin){
    newUser.admin = false;
  }
  bcrypt.hash(req.body.password, 10, (err, hash) => {
  newUser.password = hash;
  newUser.save((err, data) => {
    if (err) return res.json({ success: false, error: err });
      res.json({ success: true });
    });
  });
};

/**
 * return every user
 * @param  {null} req
 * @param  {json} res users
 * @return {json}     error msg
 */
exports.allUsers = function(req, res){
  Users.find({}, { password: 0 }).exec((err, users) =>{
    if (err) return res.json({ succes: false, error: err });
    if (!users) return res.json({ success: false, error: 'users not found' });
    res.json({ success: true, users });
  });
};

/**
 * return every user belongs to supervisorUsers
 * @param  {param} req supervisorCode
 * @param  {json} res users
 * @return {json}     error msg
 */
exports.supervisorUsers = function(req, res){
  Users.find({supervisorCode: req.params.supervisorCode }, { password: 0 }).exec((err, users) =>{
    if (err) return res.json({ succes: false, error: err });
    if (!users) return res.json({ success: false, error: 'users not found' });
    res.json({ success: true, users });
  });
};

/**
 * update an existing user
 * @param  {body} req usercode, updated fields
 * @param  {json} res updated user
 * @return {json}     error msg
 */
exports.updateUser = function (req, res) {
  Users.findOneAndUpdate({ userCode: req.params.userCode }, req.body, { new: true }).exec((err, user) => {
    if (err) return res.json({ succes: false, error: err });
    if (!user) return res.json({ success: false, error: 'user not found' });
    res.json({ success: true, user });
  });
};

exports.getUsersByEducationalProgram = function(req, res){
  if (!req.params.educationalProgramID) return res.json({ succes: false, error: 'educationalProgramID is missing' });
  
  function getUsers (){
    return new RSVP.Promise((fulfill, reject) => {
      Users.find({},{password: 0}).exec((err, users) =>{
        if (err) return res.json({ succes: false, error: err });
        if (!users) return res.json({ success: false, error: 'users not found' });
        fulfill(users);
      });
    });
  }

  function respond (users){
    var response = [];
    for(const user of users){
      for(const educationalProgram of user.educationalPrograms){
        if (educationalProgram.id === req.params.educationalProgramID){
          response.push(user);
        }
      }
    }
    res.json({success: true, users: response});
  };

  getUsers()
    .then(respond);

};


exports.getUsersByEducationalProgramWithoutSuperVisors= function(req, res){
  if (!req.params.educationalProgramID) return res.json({ succes: false, error: 'educationalProgramID is missing' });

  function getUsers (){
    return new RSVP.Promise((fulfill, reject) => {
      Users.find({},{password: 0}).exec((err, users) =>{
        if (err) return res.json({ succes: false, error: err });
        if (!users) return res.json({ success: false, error: 'users not found' });
        fulfill(users);
      });
    })
  }

  function respond (users){
    var response = [];
    for (const user of users) {

      if (!user.supervisorCode) {

        for (const educationalProgram of user.educationalPrograms) {

          if (educationalProgram.id === req.params.educationalProgramID) {
            response.push(user);
          }

        }

      }

    }
    res.json({success: true, users: response});
  };

  getUsers()
    .then(respond);

};
/**
 * Assign new role to teacher
 * @param  {role} req roleCode:
 * @param  {json} res if user role added
 * @return {json}     erro msg
 */
exports.addNewRole = function (req, res) {
  if (!req.body.id) return res.json({ success: false, error: 'Role ID missing: 1: teacher, 2: supervisor, 3: planner, 4: adminstrator' });
  let newRole;
  createRole(req.body.id, function(role){
    newRole = role;
  });
  if (!newRole)  return res.json({ success: false, error: 'Invalid role code: 1: teacher, 2: supervisor, 3: planner, 4: adminstrator' });
  Users.findOne({ userCode: req.params.userCode }, { password: 0 }).exec((err, user) => {
    if (err) return res.json({ succes: false, error: err });
    if (!user) return res.json({ success: false, error: 'user not found' });
    if ( user.roles.length >= 2 ) return res.json({ success: false, error: 'user can not have more than 2 roles!', roles: user.roles.name });
    if(req.body.supervisorCode){
      user.supervisorCode = req.body.supervisorCode;
    }
    user.roles.push(newRole);
    user.save();
    res.json({ succes: true, user });
  });
};
// apidoc -i cont/ -o apidoc/ -t mytemplate/

/**
 * update an already existing role
 * @param  {oldRoleId, new role object} req json file with old role id, and new role object
 * @param  {role} res new role
 * @return {json}     error msg
 */
exports.updateRole = function (req, res) {
  if (!req.body.oldRoleId) return res.json({ success: false, error: 'Old role ID is missing' });
  if (!req.body.id) return res.json({ success: false, error: 'new role ID missing: 1: teacher, 2: supervisor, 3: planner, 4: adminstrator' });
  const oldRoleId = req.body.oldRoleId;
  let newRole;
  createRole(req.body.id, function(role){
    newRole = role;
  });
  if (!newRole)  return res.json({ success: false, error: 'Invalid role code: 1: teacher, 2: supervisor, 3: planner, 4: adminstrator' });
  Users.findOne({ userCode: req.params.userCode }, { password: 0 }).exec((err, user) => {
    if (err) return res.json({ succes: false, error: err });
    if (!user) return res.json({ success: false, error: 'user not found' });
    for (let i = 0; i < user.roles.length; i++) {
      if (user.roles[i].id === oldRoleId){
        user.roles.splice(i, 1);
      }
    }
    user.roles.push(newRole);
    user.save();
    res.json({ success: true, user });
  });
};

/**
 * remove role from specified user
 */
exports.removeRole = function (req, res){
    if (!req.body.id) return res.json({ success: false, error: 'Role id is missing' });
  Users.findOne({ userCode: req.params.userCode }, { password: 0 }).exec((err, user) => {
    if (err) return res.json({ succes: false, error: err });
    if (!user) return res.json({ success: false, error: 'user not found' });
    for (let i = 0; i < user.roles.length; i++) {
      if (user.roles[i].id === req.body.id) user.roles.splice(i, 1);
    }
      user.save();
      res.json({ success: true, user });
    });
};
/**
 * Assign educationalProgram to user
 * @param  {Educationalprgram} req educationalProgram object + usercode in the parametes
 * @param  {user} res updated user
 * @return {json}     error msg
 */
exports.addEducationalProgram = function (req, res){
  var educationalProgram = new EducationalProgram(req.body);
  Users.findOne({ userCode: req.params.userCode }, { password: 0 }).exec((err, user) => {
    if (err) return res.json({ succes: false, error: err });
    if (!user) return res.json({ success: false, error: 'user not found' });
    user.educationalPrograms.push(educationalProgram);
    user.save();
    res.json({ succes: true, user });
  });
};


/**
 * return all the user belongs to one role
 * @param  {rolecode} req rolecode
 * @param  {users} res  users for that role
 * @return {error}     error msg
 */
exports.getUsersByRole = function (req, res) {
  if (!req.params.rolecode) return res.json({ success: false, error: 'rolecode is missing' });
  const data = { users: [] };
  Users.find({}, { password: 0 }).exec((err, users) => {
    if (err) return res.json({ success: false, error: err });
    if (!users) return res.json({ success: false, error: 'users not found' });
    for (const user of users) {
      for (const role of user.roles) {
        if (role.id === req.params.rolecode) {
          data.users.push(user);
        }
      }
    }
    res.json({ success: true, users});
  });

};
/**
 * getuser by his id
 * @param  {userCode} req [usercode in params]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.userData = function (req, res) {
  if (!req.params.userCode) return res.json({ success: false, error: 'userCode is missing' });
  Users.findOne({ userCode: req.params.userCode }, { password: 0 }).exec((err, user) => {
    if (err) return res.json({ success: false, error: err });
    if (!user) return res.json({ success: false, error: 'user not found' });
    res.json({ success: true, user });
  });
};

/**
 * helper fucntion to create role
 * @param  {string}   roleID   roleid
 * @param  {response}   res
 * @return {Role}            The created role
 */
function createRole(roleID, callback) {
  let role = new Role();
  role.id = roleID;
  switch (roleID) {
    case '1': role.name = 'teacher';
          break;
    case '2': role.name = 'supervisor';
          break;
    case '3': role.name = 'planner';
          break;
    case '4': role.name = 'adminstrator';
          break;
    default: role = null;
  }
  return callback (role);
}
