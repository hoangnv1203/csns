'use strict';

exports.name = '/config/redis';
exports.requires = [
	'@bluebird',
	'@thunk-redis'
];
exports.factory = (Promise, redis) => {
	const client = redis.createClient({
		database: 1,
		usePromise: Promise,
	});

	return new Promise((resolve, reject) => {
		client.on('connect', () => {
			resolve(client);
		});
	});
};
