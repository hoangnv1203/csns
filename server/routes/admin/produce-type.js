'use strict';

exports.name = '/routes/admin/produce-type';
exports.requires = [
	'/config/app',
	'/middlewares/auth',
	'/middlewares/produce-type'
];
exports.factory = (app, authMiddleware, produceTypeMiddleware) => {
	app._route('admin.produce-type.list', '/admin/produce-types')
		.get(
			authMiddleware.checkAuthentication,
			produceTypeMiddleware.listing,
			(req, res, next) => {
				res.render('admin/produce-type-list');
			}
		)
		.post(
			authMiddleware.checkAuthentication,
			produceTypeMiddleware.insert,
			(req, res, next) => {
				res._redirect('admin.produce-type.detail', {
					id: res.locals.produceType._id
				});
			}
		);

	app._route('admin.produce-type.detail', '/admin/produce-types/:id')
		.get(
			authMiddleware.checkAuthentication,
			produceTypeMiddleware.get,
			(req, res, next) => {
				res.render('admin/produce-type-detail');
			}
		)
		.post(
			authMiddleware.checkAuthentication,
			produceTypeMiddleware.update,
			(req, res, next) => {
				res._redirect('admin.produce-type.detail', {
					id: res.locals.produceType._id
				});
			}
		);
};
