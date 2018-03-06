'use strict';

exports.name = '/middlewares/user';
exports.requires = [
	'@uuid',
	'/config/env',
	'/config/recaptcha',
	'/models/user',
	'/services/sms',
	'/services/session-storage',
	'/services/verify-token',
	'/middlewares/utilities',
];
exports.factory = (uuid, env, recaptcha, User, sms, sessionStorage, servicesVerifyToken, utilitiesMiddleware) => {
	return {
		findUserByOauthProfile,
		register,
		tryLinkAccount,
		update,
		getUser,
		handlePhoneVerify,
		validateForm,
		list,
		insert
	};

	function findUserByOauthProfile(req, res, next) {
		const profile = res.locals.oauthProfile;

		User.aggregate([{
			$unwind: '$accounts'
		}, {
			$match: {
				'accounts.provider': profile._account.provider,
				'accounts.uid': profile._account.uid
			}
		}])
		.then(users => {
			if (users.length === 0) {
				return;
			}

			if (users.length === 1) {
				return User.findById(users[0]._id).exec();
			}

			throw new Error('Dupplicate users in DB');
		})
		.then(user => {
			res.locals.user = user;
		})
		.catch((err) => next(err))
		.finally(() => next());

	}

	function register(req, res, next) {
		const oauthProfile = res.locals.oauthProfile;

		var user = new User({
			displayName: oauthProfile.displayName,
			avatar: oauthProfile.avatar,
			email: oauthProfile.email,
			accounts: [{
				uid: oauthProfile._account.uid,
				provider: oauthProfile._account.provider
			}],
			roles: []
		});

		if (env.admins.includes(user.email)) {
			user.roles.push('admin');
		}

		user.save()
			.then(user => {
				res.locals.user = user;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function tryLinkAccount(req, res, next) {
		const oauthProfile = res.locals.oauthProfile;

		User.findOne({
			email: oauthProfile.email,
		})
		.then(user => {
			if (!user) {
				return;
			}

			return User.findByIdAndUpdate(user._id, {
				$push: {
					accounts: oauthProfile._account
				}
			}, {
				safe: true,
				new: true
			})
			.exec();
		})
		.then(user => {
			if (user) {
				res.locals.user = user;
			}
		})
		.catch(error => next(error))
		.finally(() => next());
	}

	function update(req, res, next) {
		const phoneNumber = req.body.phoneNumber;
		const id = res.locals.authentication._id;

		var params = {
			address: req.body.address,
			phoneNumber: phoneNumber,
			city: req.body.city,
			district: req.body.district
		};

		if ((phoneNumber !== res.locals.user.phoneNumber) && res.locals.user.phoneVerified) {
			params.phoneVerified = false;
		}

		User.findByIdAndUpdate(id, params, {
			new: true
		}).then(user => {
			res.locals.user = user;
		})
		.catch(err => next(err))
		.finally(() => next());
	}

	function getUser(req, res, next) {
		let id = req.params.id;
		
		if (!id || (id === 'me')) {
			id = res.locals.authentication._id;
		}

		User.findById(id).then(user => {
			res.locals.user = user;

			for (let i = 0; i < user.accounts.length; i++) {
				if (user.accounts[i].provider === 'local') {
					res.locals.isHasLocalAcount = true;

					break;
				}
			}
		})
		.catch(err => next(err))
		.finally(() => next());
	}

	function validateForm(req, res, next) {
		const user = res.locals.user;
		const sessionKeyError = sessionStorage.path(user._id, env.session.sessionKeyError);

		sessionStorage.get(sessionKeyError)
			.then(storage => {
				res.locals.storage = storage || {};
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function verifyPhoneNumber(req, res, next) {
		const phoneCode = req.body.phoneCode;
		const user = res.locals.user;
		const sessionKeyError = sessionStorage.path(user._id, env.session.sessionKeyError);

		servicesVerifyToken.getWithUserId(user._id)
			.then(token => {
				var createDate = new Date(token.createdAt);
				var dateNow = Date.now();
				var time = dateNow - createDate.getTime();

				if (!token || token.value !== phoneCode || time > env.session.verifyCode) {
					return sessionStorage.update(sessionKeyError, {
						invalidPhoneVerified: true
					})
					.then(storage => storage)
					.catch(err => next())
					.finally(() => next());
				}
				
				sessionStorage.update(sessionKeyError, {
					invalidPhoneVerified: false
				});

				return User.findByIdAndUpdate(user._id, {
					phoneVerified: true
				}, {
					new: true
				});
			})
			.then(user => {
				res.locals.user = user;
				utilitiesMiddleware.redirect('user.profile')(req, res, next);
			})
			.catch(err => next())
			.finally(() => next());
	}

	function verifyToken(req, res, next) {
		const userId = res.locals.user._id;
		const code = (uuid.v4()).substring(0, 4);
		let phoneNumber = res.locals.user.phoneNumber;

		servicesVerifyToken.getWithUserId(userId)
			.then(token => {
				if (token) {
					return servicesVerifyToken.update(token._id, code);
				} else {
					return servicesVerifyToken.set(userId, code);
				}
			})
			.then(token => {
				var message = 'Mã xác nhận của bạn là: ' + token.value;

				if (!env.development) {
					phoneNumber = '84' + phoneNumber.substr(1);
				
					sms.send(phoneNumber, message)
						.then(data => {
							console.log('send sms success', data);
						})
						.catch(err => {
							console.log('send sms error', err);
						});
				}
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function handlePhoneVerify(req, res, next) {
		const user = res.locals.user;
		const phoneCode = req.body.phoneCode;
		const getPhoneCode = req.body.getPhoneCode;
		const sessionKeyError = sessionStorage.path(user._id, env.session.sessionKeyError);

		if (phoneCode) {
			verifyPhoneNumber(req, res, next);

		} else if (getPhoneCode) {
			recaptcha.validateRequest(req)
			.then(() => {
				sessionStorage.update(sessionKeyError, {
					invalidRecaptcha: false
				});
				verifyToken(req, res, next);
			})
			.catch(error => {
				sessionStorage.update(sessionKeyError, {
					invalidRecaptcha: true
				});

				next();
			});
			
		} else {
			next();
		}
	}

	function list(req, res, next) {
		User
			.find()
			.sort('displayName')
			.exec()
			.then(users => {
				res.locals.users = users || [];

				next();
			})
			.catch(err => next(err));
	}

	function insert(req, res, next) {
		if (req.body.password !== req.body.confirmPassword) {
			req.flash('invalidChangePassword', 'Xác nhận mật khẩu chưa chính xác');
			return next();
		}

		var user = new User({
			displayName: req.body.displayName,
			email: req.body.email,
			roles: []
		});

		user.generateHash(req.body.password)
			.then(hash => {
				user.accounts = [{
					uid: req.body.email,
					provider: 'local',
					password: hash 
				}];

				user
					.save()
					.then(user => {
						req.flash('success', 'Tạo tài khoản thành công, bạn có thể cập nhật thêm thông tin tài khoản');
						res.locals.user = user;
					})
					.catch(err => next(err))
					.finally(() => next());
			});
	}
};