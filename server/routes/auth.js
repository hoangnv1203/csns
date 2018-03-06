'use strict';

exports.name = '/routes/auth';
exports.requires = [
	'/config/app',
	'/config/passport',
	'/middlewares/auth',
	'/middlewares/utilities',
	'/middlewares/profile',
	'/services/auth',
	'/flows/oauth'
];
exports.factory = (app, passport, authMiddleware, utilitiesMiddleware, profileMiddleware, authService, oauthFlow) => {
	app.use(authMiddleware.checkAuthentication);

	app._route('authentication', '/authentication')
			.get(
				utilitiesMiddleware.getMessage('loginError'),
				(req, res, next) => {
					res.render('authentication');
				}
			)
			.post(
				profileMiddleware.getUserWithAccountsEmail,
				profileMiddleware.checkAuthentication,
				authMiddleware.checkAuthentication
			);

	app._get('oauth.fb', '/oauth/fb', passport.authenticate('facebook', {
		session: false
	}));

	// need refactor for easier usage
	app.get.apply(app,
		[
			'/oauth/fb/callback',
			passport.authenticate('facebook', {
				session: false
			})
		]
		.concat(oauthFlow)
		.concat(utilitiesMiddleware.redirect('landingpage'))
	);

	app._get('signout', '/signout', (req, res, next) => {
		// passport logout
		req.logout();

		// remove session in sessionStorage
		authService
			.signOut(req.sessionID);

		res._redirect('authentication');
	});
};
