var express = require('express');
var path = require('path');
var logger = require('morgan');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MD5 = require('crypto-js/md5');

var Configure = function (app, session) {
	var mongoStore = require('connect-mongo')(session);
	// view engine setup
	app.set('views', path.join(__dirname, '..', 'views'));
	app.set('view engine', 'jade');
	app.set('env', 'development');

	app.use(favicon());
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	app.use(cookieParser());
	app.use(require('stylus').middleware(path.join(__dirname, '..', 'public')));
	app.use(express.static(path.join(__dirname, '..', 'public')));

	app.use('/jquery', express.static(path.join(__dirname, '..', 'node_modules', 'jquery', 'dist')));
	app.use('/enums', express.static(path.join(__dirname, 'enums')));

	app.use(session({
		secret: MD5("HML-2014/06/13").toString(),
		store: new mongoStore({
			db: "hml",
		})
	}));
};

module.exports = Configure;
