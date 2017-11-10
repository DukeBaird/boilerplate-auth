var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

var User = new require('../models/User.js');

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done) {
		process.nextTick(function() {
			email = email.toLowerCase();

			adminFunctions.emailExists(email, function(err, exists) {
				if (err) {
					return done(err);
				}

				if (exists) {
					return done(null, false);
				} else {
					var newUser = new User();

					newUser.email = email;
					newUser._id = String(new Date().getTime()) + '-' + String(parseInt(100000 * Math.random()));
					newUser.password = newUser.generateHash(password);

					newUser.save(function(err) {
						if (err) {
							throw err;
						}
						sessionFunctions.createAPISession(newUser._id, 24, function (err, token) {
							return done(null, newUser);
						});
					});
				}
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true
		}, function(req, email, password, done) {
			email = email.toLowerCase();
			User.findOne({
				'email' :  email
		}, function(err, user) {

			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false);
			}

			if (!user.validPassword(password)) {
				return done(null, false);
			}

			sessionFunctions.createAPISession(user._id, 24, function(err, apiToken) {
				return done(null, user);
			});
		});
	}));
};