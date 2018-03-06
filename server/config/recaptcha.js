'use strict';

exports.name = '/config/recaptcha';
exports.requires = [
	'@recaptcha2',
	'/config/env'
];
exports.factory = (recaptcha2, env) => {
	return new recaptcha2({
		siteKey: env.recaptcha.siteKey,
		secretKey: env.recaptcha.secretKey
	});	
};