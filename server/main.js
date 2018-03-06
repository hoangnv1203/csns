'use strict';

exports.name = '/';
exports.requires = [
	'/config/app',
	'/config/env',
];
exports.factory = function(app, env) {
	app.listen(env.port, () => console.log('Application started at :%d', env.port));
};
