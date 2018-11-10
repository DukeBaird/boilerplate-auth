var mongoose = require('mongoose');
var Session = new require('../models/Session.js');
var bcrypt = require('bcrypt-nodejs');

var timeFactor = 60000;

exports.createAPISession = function createAPISession(userID, expiry) {
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
	return session.save(function setSession(err) {
		return token;
	});
};

function authorize(token) {
	if (token) {
		return hasAuth(token).then(auth => {
			return auth;
		});
	} else {
		return new Promise((resolve, reject) => {
			reject();
		});
	}
};
exports.authorize = authorize;

function hasAuth(token) {
	var currTime = new Date();
	return Session.findById(token).lean().exec().then(sessionRecord => {
		if (sessionRecord) {
			var expires = new Date(sessionRecord.expires);
			if ((expires.getTime() - currTime.getTime()) >= 0) {
				return sessionRecord;
			} else {
				throw new Error("No Session Found");
			}
		}
	}).catch(err => {
		return err;
	});
};
exports.hasAuth = hasAuth;

function getAPIToken(userID, callback) {
	return Session.find({'user': userID}, '_id',  {sort: {expires: 'descending'}}).then(sessions => {
			if (sessions[0]) {
				return sessions[0]._id;
			} else {
				throw new Error("No Session Found");
			}
	}).catch(err => {
		return err;
	});
};
exports.getAPIToken = getAPIToken;