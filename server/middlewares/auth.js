'use strict';

exports.name = '/middlewares/auth';
exports.requires = [
	'/middlewares/utilities',
	'/services/auth'
];
exports.factory = (utilitiesMiddleware, authService) => {
	return {
		checkAuthentication,
		redirectIfUnauthenticated,
		requireAdminRole
	};

	function checkAuthentication(req, res, next) {
		return authService
			.getSignedInUser(req.sessionID)
			.then((user) => {
				res.locals.authentication = user;
			})
			.finally(() => next());
	}

	function redirectIfUnauthenticated(req, res, next) {
		if (res.locals.authentication) {
			return next();
		}

		utilitiesMiddleware.redirect('authentication')(req, res, next);
	}

	function requireAdminRole(req, res, next) {
		const authentication = res.locals.authentication;

		// should make method for this check
		if (authentication && authentication.roles.includes('admin')) {
			return next();
		}

		utilitiesMiddleware.redirect('admin.signin')(req, res, next);
	}
};
