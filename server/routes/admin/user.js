'use strict';

exports.name = '/routes/admin/user';
exports.requires = [
	'/config/app',
	'/middlewares/auth',
	'/middlewares/user',
	'/middlewares/city-district',
	'/middlewares/utilities',
	'/middlewares/profile'
];
exports.factory = (app, authMiddleware, userMiddleware, citiesDistrictsMiddleware, utilitiesMiddleware, profileMiddleware) => {
	app._route('admin.user.list', '/admin/users')
		.get(
			authMiddleware.redirectIfUnauthenticated,
			userMiddleware.list,
			(req, res, next) => {
				res.render('admin/users');
			}
		);

	app._route('admin.user.edit', '/admin/users/:id/edit')
		.get(
			authMiddleware.redirectIfUnauthenticated,
			userMiddleware.getUser,
			citiesDistrictsMiddleware.get,
			utilitiesMiddleware.getMessage('invalidChangePassword'),
			utilitiesMiddleware.getMessage('validChangePassword'),
			utilitiesMiddleware.getMessage('success'),
			(req, res, next) => {
				res.render('admin/user-edit');
			}
		)
		.post(
			authMiddleware.redirectIfUnauthenticated,
			userMiddleware.getUser,
			profileMiddleware.update,
			profileMiddleware.password,
			(req, res, next) => {
				res._redirect('admin.user.edit', {
					id: req.params.id
				});
			}
		);

	app._route('admin.user.create', '/admin/users/create')
		.get(
			citiesDistrictsMiddleware.get,
			utilitiesMiddleware.getMessage('invalidChangePassword'),
			(req, res, next) => {
				res.render('admin/user-create');
			}
		)
		.post(
			userMiddleware.insert,
			(req, res, next) => {
				res._redirect('admin.user.edit', {
					id: res.locals.user._id
				});
			}
		);
};	