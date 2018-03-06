'use strict';

exports.name = '/models/user';
exports.requires = [
	'@bcrypt',
	'/config/mongoose',
	'/config/env'
];
exports.factory = (bcrypt, mongoose, env) => {
	let User = mongoose.Schema({
		displayName: String,
		defaultProvider: String,
		accounts: [{
			uid: String,
			provider: String,
			password: String
		}],
		phoneVerified: {
			type: Boolean,
			default: false
		},
		roles: [{
			type: String
		}],
		email: {
			type: String,
			unique: true
		},
		avatar: {
			type: String
		},
		address: {
			type: String
		},
		phoneNumber: {
			type: String
		},
		city: {
			type: String
		},
		district: {
			type: String
		},
		isBlocked: {
			type: Boolean,
			default: false
		}
	});

	User.methods.generateHash = function(password) {
		return bcrypt.hash(password, env.saltRounds);
	};

	User.methods.validPassword = function(password) {
		return bcrypt.compare(password, hash);
	};

	return mongoose.model('User', User);
};
