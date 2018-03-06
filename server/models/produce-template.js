'use strict';

exports.name = '/models/produce-template';
exports.requires = [
	'@mongoose',
	'/models/produce-tag',
	'/models/produce-category',
	'/models/image'
];
exports.factory = mongoose => {
	const Schema = mongoose.Schema;

	const ProduceTemplate = Schema({
		name: {
			type: String,
			required: true
		},
		tags: [{
			type: Schema.Types.ObjectId,
			ref: 'ProduceTag'
		}],
		category: {
			type: Schema.Types.ObjectId,
			ref: 'ProduceCategory'
		},
		images: [{
			type: Schema.Types.ObjectId,
			ref: 'Image'
		}],
		desc: {
			type: String
		}
	});

	return mongoose.model('ProduceTemplate', ProduceTemplate);
};
