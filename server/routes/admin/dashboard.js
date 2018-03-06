'use strict';

exports.name = '/routes/admin/dashboard';
exports.requires = [
	'/config/app'
];
exports.factory = (app) => {
	app._route('admin.dashboard', '/admin')
		.get((req, res, next) => {
			res.render('admin/dashboard');
		});
};
