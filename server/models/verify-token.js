'use strict';

exports.name = '/models/verify-token';
exports.requires = [
	'/config/mongoose'
];
exports.factory = (mongoose) => {
	const Schema = mongoose.Schema;
	const VerifyToken = Schema({
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		createdAt: {
			type: Date,
			required: true
		},
		value: {
			type: String,
			required: true
		},
		consumed: {
			type: Boolean,
			required: true,
			default: false
		}
	});

	return mongoose.model('VerifyToken', VerifyToken);
};
