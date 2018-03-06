'use strict';

exports.name = '/services/sms';
exports.requires = [
	'/config/aws',
];
exports.factory = AWS => {
	const sns = new AWS.SNS();

	return {
		send: (phoneNumber, message) => {
			return sns.publish({
				Message: message,
				PhoneNumber: phoneNumber,
				Subject: 'Chiasenongsan'
			}).promise();
		},
	};
};
