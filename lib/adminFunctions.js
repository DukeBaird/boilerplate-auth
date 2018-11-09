
var mongoose = require('mongoose');
var Users = new require('../models/User.js');

var sessionFunctions = require('./sessionFunctions.js');

function emailExists(email, callback) {
	return Users.findOne({email: email});
}
exports.emailExists = emailExists;


function getUserRole(userID) {
	return Users.findById(userID, 'role').then((result) => {
		return result.role;
	}).catch(err => {
		return err;
	});
}
exports.getUserRole = getUserRole;

function isLoggedIn(role) {
	return function(req, res, next) {
		// continue for an authorized user
		var user = req.user;
		if (user) {
			if (role.indexOf(user.role) !== -1){
				if (req.isAuthenticated()) {
					sessionFunctions.getAPIToken(user._id).then(token => {
						req.token = token;
						return next();
					}).catch(err => {
						res.redirect('/login');
					});
				} else {
					res.redirect('/login');
				}
			} else {
				res.redirect('/login');
			}
		} else {
			res.redirect('/login');
		}
	};
};
exports.isLoggedIn = isLoggedIn;