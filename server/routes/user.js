'use strict';

exports.name = '/routes/user';
exports.requires = [
	'/config/app',
	'/middlewares/auth',
	'/middlewares/user',
	'/middlewares/city-district',
	'/middlewares/profile',
	'/middlewares/utilities'
];
exports.factory = (app, authMiddleware, userMiddleware, citiesDistrictsMiddleware, profileMiddleware, utilitiesMiddleware) => {
	app._route('profile.view', '/profiles/:id')
			.get(
				authMiddleware.redirectIfUnauthenticated,
				userMiddleware.getUser,
				(req, res, next) => {
					res.render('profile-view');
				}
			);

	app._route('profile.edit', '/profiles/:id/edit')
			.get(
				authMiddleware.redirectIfUnauthenticated,
				userMiddleware.getUser,
				citiesDistrictsMiddleware.get,
				utilitiesMiddleware.getMessage('invalidChangePassword'),
				utilitiesMiddleware.getMessage('validChangePassword'),
				utilitiesMiddleware.getMessage('success'),
				(req, res, next) => {
					res.render('profile-edit');
				}
			)
			.post(
				authMiddleware.redirectIfUnauthenticated,
				userMiddleware.getUser,
				profileMiddleware.update,
				profileMiddleware.password,
				(req, res, next) => {
					res._redirect('profile.edit', {
						id: req.params.id
					});
				}
			);

	/* old code - need refactor, copy, improve... */
	app._route('user.profile1', '/user/profile')
			.get(
				authMiddleware.redirectIfUnauthenticated,
				userMiddleware.getUser,
				(req, res, next) => {
					res.render('profile');
				}
			)
			.post(
				authMiddleware.redirectIfUnauthenticated,
				userMiddleware.getUser,
				userMiddleware.update,
				(req, res, next) => {
					res._redirect('user.profile');
				}
			);

	app._route('user.profile1.edit', '/user/profile/edit')
			.get(
				authMiddleware.redirectIfUnauthenticated,
				userMiddleware.getUser,
				(req, res, next) => {
					res.locals.isEdit = true;
					res.render('profile');
				}
			);

	app._route('user.profile1.phone.verify', '/user/profile/phone/verify')
			.get(
				authMiddleware.redirectIfUnauthenticated,
				userMiddleware.getUser,
				userMiddleware.validateForm,
				(req, res, next) => {
					res.render('phone-verify');
				}
			)
			.post(
				authMiddleware.redirectIfUnauthenticated,
				userMiddleware.getUser,
				userMiddleware.handlePhoneVerify,
				(re, res, next) => {
					res._redirect('user.profile.phone.verify');
				}
			)
};
