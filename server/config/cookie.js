'use strict';

exports.name = '/config/cookie';
exports.requires = [
	'@cookie-parser',
	'/config/app',
	'/config/env'
];
exports.factory = (cookieParser, app, env) => {
	const config = env.cookie;

	app.use(cookieParser(config.secret));
};
