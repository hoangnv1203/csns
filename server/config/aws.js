'use strict';

exports.name = '/config/aws';
exports.requires = [
	'@aws-sdk',
	'@bluebird',
	'/config/env'
];
exports.factory = (AWS, bluebird, env) => {
	AWS.config.setPromisesDependency(bluebird);

	AWS.config.update({
		region: env.aws.sns.region,
		accessKeyId: env.aws.credentials.accessKeyId,
		secretAccessKey: env.aws.credentials.secretAccessKey
	});

	return AWS;
};
