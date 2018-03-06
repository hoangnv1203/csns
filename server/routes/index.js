'use strict';

exports.name = '/routes/index';
exports.requires = [
	'/config/app',
	'/middlewares/auth',
	'/models/produce'
];
exports.factory = (app, auth, Produce) => {
	app._get('landingpage', '/',
		(req, res, next) => {
			// TODO need use cache instead of .populate() for performance

			Produce
				.find()
				.sort('-harvestTime -publishedAt')
				.populate([
					'seller',
					'category',
					'template'
				])
				.exec()
				.then(produces => {
					res.locals.produces = produces;
					next();
				})
				.catch(err => next(err));
		},
		(req, res, next) => {
			res.render('landing-page');
		}
	);

	// app._get('admin', '/admin',
	// 	auth.checkAuthentication,
	// 	auth.requireAdminRole,
	// 	(req, res, next) => {
	// 		res.render('admin');
	// 	}
	// );
};
