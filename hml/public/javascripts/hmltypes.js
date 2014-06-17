var HMLError = function HMLError(message, errorcode) {
    if (_.isObject(message)) {
        this.ErrorCode = message.ErrorCode;
        this.Message = message.Message;
    } else {
        this.ErrorCode = errorcode;
        this.Message = message;
    }
};

var HMLRedirect = function HMLRedirect(redirect) {
    if (_.isObject(redirect)) {
        this.Redirect = redirect.Redirect;
    } else {
        this.Redirect = redirect;
    }
};
