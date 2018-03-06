'use strict';

exports.name = '/config/mongoose';
exports.requires = [
	'@bluebird',
	'@mongoose',
	'/config/env'
];
exports.factory = (Promise, mongoose, env) => {
	mongoose.Promise = Promise;
	mongoose.createConnection(env.mongodb.host);

	return new Promise((resolve, reject) => {
		mongoose.connection.on('connected', () => {
			resolve(mongoose);
		});
	});
};
