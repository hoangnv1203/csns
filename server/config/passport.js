'use strict';

exports.name = '/config/passport';
exports.requires = [
	'@passport',
	'/config/passport-strategies/fb',
	'/config/passport-strategies/google'
];
exports.factory = (passport, fbStrategy, googleStrategy) => {
	passport.use(fbStrategy);
	passport.use(googleStrategy);

	return passport;
};
