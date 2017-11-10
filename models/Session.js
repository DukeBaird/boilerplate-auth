var mongoose = require('mongoose');

var sessionSchema = mongoose.Schema({
	expires: Date,
	user: String,
	_id: String
});

module.exports = mongoose.model('Session', sessionSchema, 'Session');
