var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	_id: String,
	password: String,
	email: String
});

userSchema.methods.generateHash = function generateHash(password) {
	return bcrypt.hashSynch(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function validPassword(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Users', userSchema);