'use strict';

exports.name = '/models/produce-category';
exports.requires = [
	'@mongoose'
];
exports.factory = mongoose => {
	const Schema = mongoose.Schema;

	const ProduceCategory = Schema({
		name: {
			type: String,
			required: true,
		},
		prettyUrl: {
			type: String,
			required: String,
			unique: true
		}
	});

	return mongoose.model('ProduceCategory', ProduceCategory);
};
