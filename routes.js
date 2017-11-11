var express = require("express");
var passport = require("passport");
var session = require("express-session");

var router = express.Router();

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

router.use(session({
	secret: 'nothingiswrongwithpinappleonpizza',
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	})
}));
router.use(passport.initialize());
router.use(passport.session());

// Set no caching protocol
// Helpful in preventing the use of the back button after logout to view confidential info.
router.use(function(req, res, next) {
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});

router.get('/', function(req, res, next) {
	if (req.user) {
		res.render('index');
	} else {
		res.render('login');		
	}
});

router.get('/login', function(req, res, next) {
	res.render('login');
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local-login', function(err, user, info) {
		if (user) {
			req.logIn(user, function(err) {
				return res.redirect('/');
			});
		} else {
			// invalid user/password
			return res.redirect('/login');
		}
	})(req, res, next);
});

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});

router.get('/signup', function(req, res, next) {
	res.render('signup');
});

router.post('/signup', function(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
		if (!user) {
			res.status(409).json({
				err: "User already exists"
			});
		} else {
			req.logIn(user, function(err) {
				res.redirect('/');
			});
		}
	})(req, res, next);
});

router.get('/404', function(req, res, next) {
	res.render('404');
});

router.get('*', function(req, res, next) {
	res.redirect('/404');
});

module.exports = router;