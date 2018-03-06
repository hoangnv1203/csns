'use strict';

exports.name = '/models/produce';
exports.requires = [
	'/config/mongoose'
];
exports.factory = mongoose => {
	const Schema = mongoose.Schema;

	let Produce = Schema({
		desc: {
			type: String,
			required: true
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'ProduceCategory'
		},
		template: {
			type: Schema.Types.ObjectId,
			ref: 'ProduceTemplate'
		},
		harvestTime: {
			type: Date
		},
		origin: {
			type: String
		},
		price: {
			type: String
		},
		amount: {
			type: String
		},
		images: [{
			path: String,
			width: Number,
			height: Number
		}],
		address: {
			type: String
		},
		city: {
			type: String
		},
		district: {
			type: String
		},
		seller: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		publishedAt: {
			type: Date,
			required: true
		},
		status: {
			type: String,
			required: true
		},
		hasUnclassifiedCategory: {
			type: Boolean
		},
		hasUnclassifiedTemplate: {
			type: Boolean,
		},
		unclassifiedCategory: {
			type: String
		},
		unclassifiedTemplate: {
			type: String
		}
	});

	Produce.methods.compareProduceType = function(id) {
		if (!this.produceType || !id) {
			return false;
		}

		return this.produceType.toString() === id.toString();
	};

	return mongoose.model('Produce', Produce);
};
