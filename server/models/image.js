'use strict';

exports.name = '/models/image';
exports.requires = [
	'@mongoose'
];
exports.factory = mongoose => {
	const Schema = mongoose.Schema;

	const Image = Schema({
		status: {
			type: String,
			default: 'tmp'
		},
		path: {
			type: String,
			required: true
		},
		thumbnails: [{
			path: String,
			width: Number,
			height: Number
		}]
	});

	return mongoose.model('Image', Image);
};
