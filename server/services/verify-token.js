'use strict';

exports.name = '/services/verify-token';
exports.requires = [
	'/models/verify-token',
];
exports.factory = (VerifyToken) => {
	return {
		get: id => VerifyToken.findById(id),
		getWithUserId: userId => VerifyToken.findOne({userId: userId}),
		set: (userId, code) => {
			var verifyToken = new VerifyToken({
				userId: userId,
				createdAt: Date.now(),
				value: code,
				consumed: false
			});

			return verifyToken.save();
		},
		update: (id, code) => {
			return VerifyToken.findByIdAndUpdate(id, {
				value: code,
				createdAt: Date.now()
			}, {
				new: true
			})
			.exec();
		},
	};
};