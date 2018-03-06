'use strict';

exports.name = '/config/reverse-route';
exports.requires = [
	'@reverse-route',
	'/config/app'
];
exports.factory = (reverseRoute, app) => {
	reverseRoute(app);
};
