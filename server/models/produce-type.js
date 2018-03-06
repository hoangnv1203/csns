'use strict';

exports.name = '/models/produce-type';
exports.requires = [
	'/config/mongoose'
];
exports.factory = mongoose => {
	const Schema = mongoose.Schema;

	const ProduceType = Schema({
		name: {
			type: String,
			required: true
		},
		description: {
			type: String
		},
		image: {
			type: String
		},
		fullsizeImage: {
			type: String
		},
		thumbnails: {
			type: Object
		},
		lastModifiedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		lastModifiedAt: {
			type: Date,
			required: true
		}
	});

	return mongoose.model('ProduceType', ProduceType);
};
