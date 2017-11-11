
var mongoose = require('mongoose');
var Users = new require('../models/User.js');



function emailExists(email, callback) {
	Users.findOne({email: email}, function withUser(err, result) {
		callback(err, !!result);
	});
}
exports.emailExists = emailExists;