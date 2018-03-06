'use strict';

exports.name = '/models/produce-tag';
exports.requires = [
	'@mongoose'
];
exports.factory = mongoose => {
	const Schema = mongoose.Schema;

	const ProduceTag = Schema({
		name: {
			type: String,
			required: true
		}
	});

	return mongoose.model('ProduceTag', ProduceTag);
};