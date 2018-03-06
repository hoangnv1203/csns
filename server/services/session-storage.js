'use strict';

exports.name = '/services/session-storage';
exports.requires = [
	'@bluebird',
	'@lodash',
	'/config/env',
	'/config/redis',
];
exports.factory = (Promise, _, env, redis) => {
	const config = env.session;

	return {
		get,
		set,
		remove,
		path,
		update
	};

	function path() {
		return _.toArray(arguments).join(':');
	}

	function get(key) {
		return Promise.all([
			redis.multi(),
			redis.get(key),
			redis.expire(key, config.maxAge),
			redis.exec()
		])
		.then((results) => {
			const value = results[3][0];

			return JSON.parse(value);
		});
	}

	function set(key, value) {
		return Promise.all([
			redis.multi(),
			redis.set(key, JSON.stringify(value)),
			redis.expire(key, config.maxAge),
			redis.exec(),
		]);
	}

	function remove(key) {
		return redis.del(key);
	}

	function update(key, value) {
		return get(key)
			.then(storage => {
				storage = storage || {};

				return set(key, _.defaultsDeep(value, storage));
			});
	}
};
