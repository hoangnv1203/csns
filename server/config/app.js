'use strict';

exports.name = '/config/app',
exports.requires = [
	'@express',
	'@body-parser',
	'@connect-slashes',
	'@morgan',
	'@path',
	'@connect-flash',
	'/config/env'
];
exports.factory = (express, bodyParser, slashes, morgan, path, flash, env) => {
	const app = express();
	app.set('_env', env);
	app.disable('x-powered-by');

	if (env.development) {
		let semanticDir = path.resolve(env._rootDir, '../semantic');
		let nodeModulesDir = path.resolve(env._rootDir, '../node_modules');
		let cssDir = path.resolve(env._rootDir, '../client/css');
		let jsDir = path.resolve(env._rootDir, '../client/js');
		let imagesDir = path.resolve(env._rootDir, '../client/images');

		app.use('/semantic', express.static(semanticDir));
		app.use('/node_modules', express.static(nodeModulesDir));
		app.use('/css', express.static(cssDir));
		app.use('/js', express.static(jsDir));
		app.use('/images', express.static(imagesDir));

		app.use(morgan('tiny'));
	}

	// remove trailing slashes
	app.use(slashes(false));

	app.use(bodyParser.urlencoded({
		extended: false
	}));

	app.use(bodyParser.json());

	app.use(flash());

	return app;
};
exports.activations = [
	'/config/cookie',
	'/config/datetime-formatter',
	'/config/session',
	'/config/reverse-route',
	'/config/view-engine',
	'/config/routing'
];
