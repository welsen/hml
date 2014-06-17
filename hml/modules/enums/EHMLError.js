var EHMLError = {
	NOERROR: 0,
	DBERROR: 1 << 1,
	INVALID_USER: 1 << 2,
	INVALID_PASS: 1 << 3,
	ACCESS_DENIED: 1 << 4
};

try {
	module.exports = EHMLError;
} catch(err) {}
