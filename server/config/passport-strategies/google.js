'use strict';

exports.name = '/config/passport-strategies/google';
exports.requires = [
	'@passport-google-oauth20',
	'/config/env',
	'/services/oauth-profile'
];
exports.factory = (passportGoogleOauth, env, oauthProfile) => {
	const config = env.oauth.google;

	return new passportGoogleOauth.Strategy({
		clientID: config.clientId,
		clientSecret: config.clientSecret,
		callbackURL: config.callbackUrl
	}, (accessToken, refreshToken, profile, done) => {
		return done(null, oauthProfile.extract(profile, 'google'));
	});
};
