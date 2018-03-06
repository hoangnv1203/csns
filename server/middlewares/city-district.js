'use strict';

exports.name = '/middlewares/city-district';
exports.requires = [
	'@path',
	'@./server/data/city-district.json'
];
exports.factory = (path, cities) => {
	return {
		get
	};

	function get(req, res, next) {
		res.locals.cities = cities;

		next();
	}
};
