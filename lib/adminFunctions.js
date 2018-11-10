
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

function checkPassword(email, password) {
	return Users.findOne({email: email}).then(user => {
		if (user.validPassword(password)) {
			return true;
		} else {
			throw new Error("Error: Invalid Password");
		}
	}).catch(err => {
		throw new Error("Error: No User Found");
	});
}
exports.checkPassword = checkPassword;

function resetPassword(email, password) {
	return Users.findOne({email: email}).then(user => {
		user.password = user.generateHash(password);

		return user.save().then(data => {
			// kill old sessions?
			return data;
		}).catch(err => {
			throw new Error("Error: Server Error Occurred");
		});
	}).catch(err => {
		throw new Error("Error: No User Found");
	});
}
exports.resetPassword = resetPassword;