var EHMLError = require('../enums/EHMLError');

var HMLError = function HMLError(message, errorcode) {
	this.__type = "HMLError";
	this.ErrorCode = errorcode;
	this.Message = message;
};

module.exports = HMLError;
