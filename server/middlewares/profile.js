'use strict';

exports.name = '/middlewares/profile';
exports.requires = [
	'@bcrypt',
	'/config/env',
	'/models/user',
	'/services/auth',
	'/middlewares/utilities',
];
exports.factory = (bcrypt, env, User, authService, utilitiesMiddleware) => {
	return {
		update,
		checkAuthentication,
		getUserWithAccountsEmail,
		password
	};

	function genSalt(password) {
		return bcrypt.hash(password, env.saltRounds);
	}

	function comparePassword(password, hash) {
		return bcrypt.compare(password, hash);
	}

	function getUserWithAccountsEmail(req, res, next) {
		const email = req.body.email;

		User
			.aggregate([{
				$unwind: '$accounts'
			}, {
				$match: {
					'accounts.uid': email
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
				res.locals.userFinded = user;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function checkAuthentication(req, res, next) {
		const messages = 'Email hoặc password không hợp lệ vui lòng nhập lại!';
		const userFinded = res.locals.userFinded;
		let account;
		let hashPassWord;

		if (!userFinded) {
			req.flash('loginError', messages);
			utilitiesMiddleware.redirect('authentication')(req, res, next);
			return;
		}

		if (userFinded.isBlocked) {
			req.flash('loginError', 'Tài khoản đã bị khóa, vui long liên hệ với quản trị hệ thống');
			utilitiesMiddleware.redirect('authentication')(req, res, next);
			return;	
		}		

		for (let i = 0; i < userFinded.accounts.length; i++) {
			account = userFinded.accounts[i];

			if (account.uid === req.body.email) {
				hashPassWord = account.password;
				break;
			}
		}

		if (hashPassWord) {
			comparePassword(req.body.password, hashPassWord)
				.then(result => {
					if (result) {
						authService
							.signIn(req.sessionID, userFinded)
							.finally(() => {
								utilitiesMiddleware.redirect('landingpage')(req, res, next);
							});
					} else {
						req.flash('loginError', messages);
						utilitiesMiddleware.redirect('authentication')(req, res, next);
					}	
				});
		} else {
			req.flash('loginError', messages);
			utilitiesMiddleware.redirect('authentication')(req, res, next);
		} 	
	}

	function update(req, res, next) {
		let id = req.params.id;
		
		if (!id || (id === 'me')) {
			id = res.locals.authentication._id;
		}
		
		User
			.findByIdAndUpdate(id, {
				displayName: req.body.displayName,
				phoneNumber: req.body.phoneNumber,
				address: req.body.address,
				city: req.body.city,
				district: req.body.district,
				email: req.body.email,
				isBlocked: req.body.isBlocked
			}, {
				safe: true,
				new: true
			})
			.then(user => {
				req.flash('success', 'Cập nhật thông tin thành công');
				res.locals.user = user;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function updatePassword(req, res, next, hash) {
		const user = res.locals.user;
		let oldHasPassword;
		let isHasLocalAcount;
		let indexOfAccount;

		for (let i = 0; i < user.accounts.length; i++) {
			if (user.accounts[i].provider === 'local') {
				isHasLocalAcount = true;
				oldHasPassword = user.accounts[i].password;
				indexOfAccount = i;

				break;
			}
		}

		if (isHasLocalAcount) {
			comparePassword(req.body.oldPassword, oldHasPassword)
				.then(result => {
					if (!result) {
						req.flash('invalidChangePassword', 'Mật khẩu chưa chính xác');
						return next();
					}

					user.accounts[indexOfAccount].uid = req.body.email;
					user.accounts[indexOfAccount].password = hash

					user
						.save()
						.then(user => {
							req.flash('validChangePassword', 'Thay đổi nhật mật khẩu thành công');
							res.locals.user = user;
						})
						.catch(err => next(err))
						.finally(() => next());
				});
		} else {
			User
				.findByIdAndUpdate(user._id, {
					$push: {
						accounts: {
							uid: req.body.email,
							provider: 'local',
							password: hash
						}
					}
				}, {
					safe: true,
					new: true
				})
				.then(user => {
					req.flash('validChangePassword', 'Cập nhật mật khẩu thành công');
					res.locals.user = user;
				})
				.catch(err => next(err))
				.finally(() => next());		
		}
	}

	function password(req, res, next) {
		const user = res.locals.user;

		if (!user || !req.body.password || !user.email) {
			return next();
		}

		if (req.body.password !== req.body.confirmPassword) {
			req.flash('invalidChangePassword', 'Xác nhận mật khẩu chưa chính xác');
			return next();
		}

		genSalt(req.body.password)
			.then(hash => {
				updatePassword(req, res, next, hash);
			});
	}
};