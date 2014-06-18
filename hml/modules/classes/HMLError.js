try {
	var EHMLError = require('../enums/EHMLError');
} catch (err) {}

var HMLError = function HMLError(message, errorcode) {
	this.__type = "HMLError";
	if (typeof message === "object") {
		this.ErrorCode = message.ErrorCode;
		this.Message = message.Message;
	} else {
		this.ErrorCode = errorcode;
		this.Message = message;
	}
};

try {
	module.exports = HMLError;
} catch(err) {}
