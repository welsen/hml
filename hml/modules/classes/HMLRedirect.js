var HMLRedirect = function HMLRedirect(redirect) {
	this.__type = "HMLRedirect";
	if (typeof redirect === "object") {
		this.Redirect = redirect.Redirect;
	} else {
		this.Redirect = redirect;
	}
};

try {
	module.exports = HMLRedirect;
} catch(err) {}
