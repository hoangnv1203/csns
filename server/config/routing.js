'use strict';

exports.name = '/config/routing';
exports.requires = [
	'@express',
	'@path',
	'@passport',
	'/config/app',
	'/config/env'
];
exports.factory = (express, path, passport, app, env) => {
	if (env.development) {
		const assetPath = path.resolve(env._rootDir, '../node_modules');

		app.use('/node_modules', express.static(assetPath));
	}

	app.use(passport.initialize());
};
exports.activations = [
	// list all routes here
	'/routes/auth',
	'/routes/index',
	'/routes/produce',
	'/routes/produce-wizard',
	'/routes/user',
	// admin section
	'/routes/admin/auth',
	'/routes/admin/dashboard',
	'/routes/admin/produce',
	// '/routes/admin/produce-type',
	'/routes/admin/user',
];
