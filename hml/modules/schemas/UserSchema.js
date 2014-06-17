var MD5 = require('crypto-js/md5');
var HMLError = require('../classes/HMLError');
var EHMLError = require('../enums/EHMLError');

MD5.verify = function (password, userPassword) {
	return MD5(password).toString() == userPassword || MD5(password).toString() == MD5(userPassword).toString();
};

var UserSchema = function UserSchema(mongoose) {
	var Schema = mongoose.Schema;
	// var ObjectId = Schema.ObjectId;

	var UserSchema = new Schema({
		email: {
			type: String,
			unique: true
		},
		display: {
			type: String
		},
		fullname: {
			type: String
		},
		password: {
			type: String,
			set: function (newValue) {
				return MD5(newValue).toString();
			}
		}
	});

	UserSchema.statics.authenticate = function (email, password, callback) {
		this.findOne({
			email: email
		}, function (error, user) {
			if (user && MD5.verify(password, user.password)) {
				callback(null, user);
			} else if (user || !error) {
				// Email or password was invalid (no MongoDB error)
				if (user == null) {
					error = new HMLError("Your email address is not registered. Please try again.", EHMLError.INVALID_USER);
				} else if (!MD5.verify(password, user.password)) {
					error = new HMLError("Invalid password supplied. Please try again.", EHMLError.INVALID_PASS);
				} else {
					error = new HMLError("Your email address or password is invalid. Please try again.", EHMLError.INVALID_USER | EHMLError.INVALID_PASS);
				}
				callback(error, user);
			} else {
				// Something bad happened with MongoDB. You shouldn't run into this often.
				callback(error, null);
			}
		});
	};

	return UserSchema;
};

module.exports = UserSchema;
