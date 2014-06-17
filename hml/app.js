var express = require('express');
var mongoose = require('mongoose');

var ConnectRoles = require('connect-roles');

var EHMLError = require('./modules/enums/EHMLError');
var HMLError = require('./modules/classes/HMLError');
var HMLRedirect = require('./modules/classes/HMLRedirect');

mongoose.connect('mongodb://localhost:27017/hml');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = require('./modules/schemas/UserSchema')(mongoose);
var User = mongoose.model('User', UserSchema);

var AclMongoose = require('./modules/classes/AclMongoose')(mongoose, User);

var passport = require('passport');
var PassportLocalStrategy = require('passport-local');

var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var gm = require('gm');

var app = express();

require('./modules/Configure')(app, session);

var authStrategy = new PassportLocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, function (email, password, callback) {
	User.authenticate(email, password, function (error, user) {
		callback(error, user);
	});
});

var authSerializer = function (user, callback) {
	callback(null, user.id);
};

var authDeserializer = function (id, callback) {
	User.findById(id, function (error, user) {
		callback(error, user);
	});
};

passport.use(authStrategy);
passport.serializeUser(authSerializer);
passport.deserializeUser(authDeserializer);

var UserRoles = new ConnectRoles({
	failureHandler: function (req, res, action) {
		// optional function to customise code that runs when
		// user fails authorisation
		var accept = req.headers.accept || '';
		res.status(403);
		if (~accept.indexOf('html')) {
			res.redirect('/login');
		} else {
			res.json(new HMLError('Access Denied - You don\'t have permission to: ' + action, EHMLError.ACCESS_DENIED));
		}
	}
});

UserRoles.use(function (req, action) {
	if (!req.isAuthenticated.apply(req.session)) return action === 'access login page';
});

UserRoles.use('access login page', function (req) {
	return true;
});

UserRoles.use('access private page', function (req) {
	if (~req.session.role.indexOf('moderator')) {
		return true;
	}
});

UserRoles.use(function (req) {
	if (~req.session.role.indexOf('admin')) {
		return true;
	}
});

app.use(passport.initialize());
app.use(UserRoles.middleware());

// app.use( '/', routes );
// app.post('/login', passport.authenticate('local'), function(req, res) {
//     console.log(req, res);
// });
app.post('/login', UserRoles.can('access login page'), function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		console.log(req.session);
		if (err) {
			res.json(err);
		} else if (!user) {
			res.json(new HMLRedirect('/login'));
		} else {
			req.logIn(user, function (error) {
				if (error) {
					res.json(error);
				}
				req.session.user = user;
				req.session.role = 'moderator';
				res.json(new HMLRedirect('/'));
			});
		}
	})(req, res, next);
});

app.get('/', UserRoles.can('access private page'), function (req, res) {
	res.render('main/index', {
		title: 'Home Media Library',
		page: 'main/index',
		locale: {}
	});
});

app.get('/login', function (req, res, next) {
	if (!req.isAuthenticated.apply(req.session)) {
		res.render('main/login', {
			title: 'HML Login',
			page: 'main/login',
			locale: {
				'signInHeading': 'Please sign in',
				'email': 'Email',
				'password': 'Password',
				'rememberMe': 'Remember me',
				'loginHelp': 'For admin login click <a href="/admin">here</a>',
				'signIn': 'Sign in'
			}
		});
	} else {
		res.redirect('/');
	}
});

app.get('/logout', function (req, res) {
	req.logout();
	delete req.session.user;
	delete req.session.role;
	res.redirect('/');
});

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
