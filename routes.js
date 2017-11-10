var express = require("express");

var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/404', function(req, res, next) {
	res.render('index');
});

router.get('*', function(req, res, next) {
	res.redirect('/404');
});

module.exports = router;