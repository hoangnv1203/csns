'use strict';

exports.name = '/routes/admin/auth';
exports.requires = [
	'/config/app',
	'/config/passport',
	'/middlewares/auth',
	'/middlewares/utilities',
	'/services/permission',
	'/flows/oauth'
];
exports.factory = (app, passport, authMiddleware, utilitiesMiddleware, permissionService, oauthFlow) => {
	app._route('admin.signin', '/admin/signin')
		.get((req, res, next) => {
			res.render('admin/signin');
		});

	app._route('oauth.google', '/oauth/google')
		.get(passport.authenticate('google', {
			session: false,
			scope: ['profile', 'email']
		}));

	app.get.apply(app,
		[
			'/oauth/google/callback',
			passport.authenticate('google', {
				session: false
			})
		]
		.concat(oauthFlow)
		.concat(utilitiesMiddleware.redirect('admin.dashboard'))
	);

	app.use('/admin', (req, res, next) => {
		const signedInUser = res.locals.authentication;

		if (!signedInUser) {
			return res._redirect('admin.signin');
		}

		var hasPermission = permissionService.hasAdminRole(signedInUser);

		if (hasPermission) {
			return next();
		}

		res._redirect('admin.signin');
	});
};
