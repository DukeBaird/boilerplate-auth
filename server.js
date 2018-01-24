var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require("passport");

var config = require("./config.js");
var routes = require("./routes.js");

var app = express();

function start() {
	app.set('port', (process.env.PORT || 8080));
	app.use(express.static(__dirname + "/public"));
	app.use(bodyParser.json());

	app.set('views', __dirname + '/views');
	app.set('view engine', 'pug');

	app.use(logger('common'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(function(req, res, next) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Cache-Control', 'no-cache');
		next();
	});

	// app.use('/api/v1', api.router);
	app.use('/', routes);

	mongoose.connect((process.env.MONGOSTRING || config.mongoString), {
		useMongoClient: true
	}, function(err) {
		if (err) {
			console.log('Mongo Connection Error', err);
		} else {
			console.log('Mongo Connection Successful');
		}
	});

	require('./lib/passport.js')(passport);

	app.listen(app.get('port'), function() {
		console.log('Server running on localhost:' + app.get('port'));
	});
}

exports.start = start;