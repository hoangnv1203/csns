'use strict';

exports.name = '/config/view-engine';
exports.requires = [
	'@ect',
	'@path',
	'/config/app',
	'/config/env'
];
exports.factory = (ect, path, app, env) => {
	const viewDir = path.resolve(env._rootDir, 'templates');
	const renderer = ect({
		watch: true,
		root: viewDir,
		ext: '.ect'
	});

	app.set('view engine', 'ect');
	app.engine('ect', renderer.render);
	app.set('views', path.resolve(env._rootDir, 'templates'));
};
