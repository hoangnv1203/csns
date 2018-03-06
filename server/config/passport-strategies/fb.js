'use strict';

exports.name = '/config/passport-strategies/fb';
exports.requires = [
	'@passport-facebook',
	'/config/env',
	'/models/user',
	'/services/oauth-profile'
];
exports.factory = (passportFacebook, env, User, oauthProfile) => {
	const config = env.oauth.facebook;

	return new passportFacebook.Strategy({
		clientID: config.clientId,
		clientSecret: config.clientSecret,
		callbackURL: config.callbackUrl,
		enableProof: true,
		scope: ['email'],
		profileFields: ['id', 'displayName', 'picture', 'email', 'link']
	}, (accessToken, refreshToken, profile, done) => {
		return done(null, oauthProfile.extract(profile, 'facebook'));
	});
};
