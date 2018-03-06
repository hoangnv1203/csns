'use strict';

exports.name = '/routes/produce';
exports.requires = [
	'/config/app',
	'/middlewares/auth',
	'/middlewares/produce',
	'/middlewares/produce-type',
	'/middlewares/user'
];
exports.factory = (app, authMiddleware, produceMiddleware, produceTypeMiddleware, userMiddleware) => {
	app._route('produce.list', '/produces')
		.get(
			authMiddleware.redirectIfUnauthenticated,
			produceMiddleware.listing,
			(req, res, next) => {
				res.render('produces');
			}
		)
		.post(
			authMiddleware.redirectIfUnauthenticated,
			produceMiddleware.insert,
			(req, res, next) => {
				res._redirect('produce.detail', {
					id: res.locals.produce._id
				});
			}
		);

	app._route('produce.create', '/produces/new')
		.get(
			authMiddleware.redirectIfUnauthenticated,
			produceTypeMiddleware.listing,
			produceMiddleware.prepareNew,
			userMiddleware.getUser,
			(req, res, next) => {
				res.render('produce-edit');
			}
		);

	app._route('produce.edit', '/produces/:id/edit')
		.get(
			authMiddleware.redirectIfUnauthenticated,
			produceTypeMiddleware.listing,
			produceMiddleware.get,
			userMiddleware.getUser,
			(req, res, next) => {
				res.render('produce-edit');
			}
		).post(
			authMiddleware.redirectIfUnauthenticated,
			produceMiddleware.update,
			(req, res, next) => {
				res._redirect('produce.detail', {
					id: res.locals.produce._id
				});
			}
		);

	app._route('produce.detail', '/produces/:id')
		.get(
			produceMiddleware.get,
			(req, res, next) => {
				res.render('produce-detail');
			}
		);

	app._route('produce.connect', '/produces/connect/:id')
		.get(
			authMiddleware.redirectIfUnauthenticated,
			produceMiddleware.get,
			(req, res, next) => {
				res.render('produce-connect');
			}
		);
};
