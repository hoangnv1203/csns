'use strict';

exports.name = '/config/env';
exports.requires = [
	'@lodash',
	'@path',
	'@yargs'
];
exports.factory = (_, path, yargs) => {
	const argv = yargs
		.option('port', {
			alias: 'p',
			type: 'number',
		})
		.option('env', {
			alias: 'e',
			default: 'local',
			type: 'string',
		}).argv;

	// load config from JSON
	const _default = require(path.resolve(__dirname, 'env', '_default.json'));
	const env = require(path.resolve(__dirname, 'env', argv.env + '.json'));

	return _.defaultsDeep({
		_rootDir: path.resolve(__dirname, '..'),
		port: argv.port,
		env: argv.env,
	}, env, _default);
};
