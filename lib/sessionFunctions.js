var mongoose = require('mongoose');
var Session = new require('../models/Session.js');
var bcrypt = require('bcrypt-nodejs');

var timeFactor = 60000;

exports.createAPISession = function createAPISession(userID, expiry, callback) {
	var salt = "Whos the master of faster? Who rules the duel?"; // This is funny if you know history
																 // This is hillarious and im not changing it
	var currTime = new Date();
	var currMS = currTime.getTime();
	var expiryTime = new Date(currMS + timeFactor * 60 * expiry);
	var hashStr = expiryTime.toString() + currMS.toString() + userID.toString() + salt;
	var token = bcrypt.hashSync(hashStr, bcrypt.genSaltSync(8));
	var session = new Session();
	session._id = token;
	session.user = userID;
	session.expires = expiryTime;
	session.save(function setSession(err) {
		callback(err, token);
	});
};