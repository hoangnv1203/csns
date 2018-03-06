'use strict';

exports.name = '/flows/oauth';
exports.requires = [
	'/middlewares/auth',
	'/middlewares/user',
	'/middlewares/utilities',
	'/services/auth'
];
exports.factory = (authMiddleware, userMiddleware, utilitiesMiddleware, authService) => {
	return [
		utilitiesMiddleware.copyToLocals('user', 'oauthProfile'),
		userMiddleware.findUserByOauthProfile,
		(req, res, next) => {
			if (res.locals.user) {
				return next();
			}

			return userMiddleware.tryLinkAccount(req, res, next);
		},
		(req, res, next) => {
			if (res.locals.user) {
				return next();
			}

			return userMiddleware.register(req, res, next);
		},
		(req, res, next) => {
			authService
				.signIn(req.sessionID, res.locals.user)
				.finally(() => next());
		},
		authMiddleware.checkAuthentication
	];
};
