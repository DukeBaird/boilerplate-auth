var express = require('express');
var router = express.Router();
var sessionFunctions = require('../lib/sessionFunctions.js');

function authorizeToken(req, res, next) {
	return sessionFunctions.authorize(req.headers.token, function(auth, user, hiddenUser) {
		if (auth) {
			req.user = user;
			return adminFunctions.getUserRole(user).then(role => {
				if (role === 'admin') {
					req.admin = true;
					return next();
				} else {
					req.admin = false;
					return next();
				}
			}).catch(err => {
				res.status(401).end();
			});
		}
	}).catch((err) => {
		res.status(401).end();
	});
};


function adminAccountCreation(req, res, next) {
	if (!req.admin) {
		return res.status(401).end()
	}

	passport.authenticate('local-signup', function(err, user, info) {
		if (!user) {
			res.status(409).json({
				err: "User already exists"
			});
		} else {
			res.status(200).json({
				user: user
			});
		}
	})(req, res, next);
}
router.post('/users/adminCreation', authorizeToken, adminAccountCreation);

function adminPasswordReset(req, res, next) {
	if (!req.admin) {
		return res.status(401).end
	}

	adminFunctions.checkPassword(req.user, req.body.oldPassword).then((data) => {
		adminFunctions.resetPassword(req.body.email, req.body.newPassword).then(data => {
			res.status(200).json({
				data: "Success"
			});
		}).catch(err => {
			res.status(500).end();
		});
	}).catch((err) => {
		res.status(401).json({
			err: err
		});
	});
}
router.post('/users/adminPasswordReset', authorizeToken, adminPasswordReset);

exports.router = router;
