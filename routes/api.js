var express = require('express');
var router = express.Router();
var sessionFunctions = require('../lib/sessionFunctions.js');

function authorizeToken(req, res, next) {
	return sessionFunctions.authorize(req.headers.token, function(auth, user, hiddenUser) {
		if (auth) {
			req.user = user;
			req.coOwner = !!hiddenUser;
			req.trueUser = hiddenUser || user;
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
	});
};

exports.router = router;
