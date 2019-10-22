//jshint esversion:6, node: true

"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'user',
  },
  batch: {
    type: String,
    default: '-',
  },
  about: {
    type: String,
  },
  avatarName: {
    type: String,
    default: "defaultAvatar.png",
  },
  branch: {
    type: String,
    default: "-",
  },
  skills: {
    type: Array,
    
  },
  stackoverflowLink: {
    type: String
  },

  account:{
    type:String
  },
  
  Email_Notification:{
    type:Boolean,
    default:true
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id).
  select('-password').
  exec(callback);
};

module.exports.authUser = function(username, callback) {
  User.
  findOne({ username: username }).
  select('username password name email role skills').
  exec(callback);
};
// module.exports.forgotPassword = function(username, callback) {
//   User.
//   findOne({ username: username }).
//   select('username securityAns securityQuestion').
//   exec(callback);
// };

module.exports.getUserByUsername = function(username, callback){
  const query = { username: username };
  User.
  findOne(query).
  select('-password').
  exec(callback);
};

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) {
        console.error(`Error Generating Salt
          ${err}`);
      }
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.updatePassword = function(user, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if(err) {
        console.error(`Error updating password
          ${err}`);
      }
      user.password = hash;
      User.update({ username: user.username }, { $set: { password: user.password }}, callback);
    });
  });
};

module.exports.updateProfile = function(user, callback) {
  User.findOneAndUpdate(
    { username: user.username },
    { $set: {
      email: user.email,
      batch: user.batch,
      branch: user.branch,
      about: user.about,
      skills: user.skills,
      account:user.account,
      Email_Notification:user.Email_Notification
      
    }
  }).
  exec(callback);
};

module.exports.updateAvatar = function(username, avatarName, callback) {
  User.findOneAndUpdate({ username: username }, { $set: { avatarName: avatarName, }}).
    exec(callback);
};

module.exports.comparePassword = function(enteredPassword, hash, callback) {
  bcrypt.compare(enteredPassword, hash, (err, isMatch) => {
    if (err) {
      console.error(`Error comparing password
        ${err}`);
    }
    callback(null, isMatch);
  });
};

module.exports.searchPeople = function(searchObj, callback) {
  User.
  find({$or: [
    { name: new RegExp(searchObj.searchString, "i")},
    { username: new RegExp(searchObj.searchString, "i")},
    { skills: new RegExp(searchObj.searchString, "i")},
  ]}).
  sort('name').
  select('username account batch name skills avatarName').
  skip(searchObj.pn*20).
  limit(20).
  exec(callback);
};

module.exports.countUsers = function(searchObj, callback) {
  User.
  find({$or: [
    { name: new RegExp(searchObj.searchString, "i")},
    { username: new RegExp(searchObj.searchString, "i")},
    { skills: new RegExp(searchObj.searchString, "i")},
  ]}).
  count(callback);
};

module.exports.makeContentManager = function(userId, callback) {
  User.
  findOneAndUpdate({ _id: userId }, { $set: { role: 'Content Manager' }}).
  exec(callback);
};

module.exports.getTeam = function(callback) {
  User.
  find({$or: [
    { role: 'Content Manager'},
    { role: 'Admin'},
  ]}).
  sort('joinDate').
  select('username name avatarName role').
  exec(callback);
};
