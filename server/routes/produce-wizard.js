'use strict';

exports.name = '/routes/produce-wizard';
exports.requires = [
	'@mongoose',
	'/config/app',
	'/middlewares/auth',
	'/middlewares/city-district',
	'/middlewares/produce-template',
	'/middlewares/wizard',
	'/models/produce',
	'/models/produce-category',
	'/models/produce-template',
	'/models/user'
];
exports.factory = (mongoose, app, authMiddleware, citiesDistrictsMiddleware, produceTemplateMiddleware, wizardMiddleware, Produce, ProduceCategory, ProduceTemplate, User) => {

	function getProduceFromLocals(res) {
		if (!res.locals.wizardObject) {
			let seller = res.locals.authentication;

			res.locals.wizardObject = {
				harvestTime: new Date(),
				price: 0,
				phoneNumber: seller.phoneNumber,
				email: seller.email,
				address: seller.address,
				city: seller.city,
				district: seller.district,
				// wizard steps
				firstStep: false,
				secondStep: false
			};
		}

		return res.locals.wizardObject;
	}

	app._route('produce.wizard.1', '/wizard/step-1')
		.get(
			authMiddleware.redirectIfUnauthenticated,
			wizardMiddleware.init,
			wizardMiddleware.restore,
			(req, res, next) => {
				ProduceCategory
					.find()
					.sort('name')
					.exec()
					.then(produceCategories => {
						res.locals.produceCategories = produceCategories;
						next();
					})
					.catch(err => next(err));
			},
			produceTemplateMiddleware.findAll,
			(req, res, next) => {
				res.render('produce-wizard-1', {
					produce: getProduceFromLocals(res)
				});
			}
		)
		.post(
			authMiddleware.redirectIfUnauthenticated,
			(req, res, next) => {
				res.locals.wizardId = req.body.w;

				next();
			},
			wizardMiddleware.restore,
			(req, res, next) => {
				let produce = getProduceFromLocals(res);
				produce.category = req.body.category;
				produce.template = req.body.template;

				next();
			},
			// try find category by id
			(req, res, next) =>{
				let produce = getProduceFromLocals(res);

				let id = produce.category;

				if (!id || !mongoose.Types.ObjectId.isValid(id)) {
					produce.hasUnclassifiedCategory = true;

					return next();
				}

				ProduceCategory
					.findById(id)
					.exec()
					.then(category => {
						if (!category) {
							produce.hasUnclassifiedCategory = true;
							return next();
						}

						produce.hasUnclassifiedCategory = false;
						res.locals.category = category;

						next();
					})
					.catch(err => next(err));
			},
			// try find template by id
			(req, res, next) =>{
				let produce = getProduceFromLocals(res);

				if (produce.hasUnclassifiedCategory) {
					produce.hasUnclassifiedTemplate = true;

					return next();
				}

				let id = produce.template;

				if (!id || !mongoose.Types.ObjectId.isValid(id)) {
					produce.hasUnclassifiedTemplate = true;

					return next();
				}

				ProduceTemplate
					.findById(id)
					.exec()
					.then(template => {
						if (!template) {
							produce.hasUnclassifiedTemplate = true;
							return next();
						}

						produce.hasUnclassifiedTemplate = false;
						res.locals.template = template;

						next();
					})
					.catch(err => next(err));
			},
			(req, res, next) => {
				let produce = getProduceFromLocals(res);

				if (!produce.firstStep) {
					produce.firstStep = true;
				}

				if (res.locals.template) {
					produce.desc = res.locals.template.desc;
				}

				next();
			},
			wizardMiddleware.store,
			(req, res, next) => {
				res._redirect('produce.wizard.2', {
					w: res.locals.wizardId
				});
			}
		);

	app._route('produce.wizard.2', '/wizard/step-2')
		.get(
			authMiddleware.redirectIfUnauthenticated,
			wizardMiddleware.init,
			wizardMiddleware.restore,
			citiesDistrictsMiddleware.get,
			(req, res, next) => {
				console.log(getProduceFromLocals(res));

				res.render('produce-wizard-2', {
					produce: getProduceFromLocals(res)
				});
			}
		)
		.post(
			authMiddleware.redirectIfUnauthenticated,
			(req, res, next) => {
				res.locals.wizardId = req.body.w;

				next();
			},
			wizardMiddleware.restore,
			(req, res, next) => {
				let produce = getProduceFromLocals(res);
				// produce.category = req.body.category;
				// produce.template = req.body.template;
				produce.desc = req.body.desc;
				produce.origin = req.body.origin;
				produce.harvestTime = res.locals._parseDate(req.body.harvestTime, 'DD/MM/YYYY')
				produce.price = req.body.price;
				produce.amount = req.body.amount;
				produce.address = req.body.address;
				produce.city = req.body.city;
				produce.district = req.body.district;

				next();
			},
			wizardMiddleware.store,
			(req, res, next) => {
				if (req.body.action === 'back') {
					return res._redirect('produce.wizard.1', {
						w: res.locals.wizardId
					});
				}

				// TODO need review step here
				// res._redirect('produce.wizard.3', {
				// 	w: res.locals.wizardId
				// });
				next();
			},
			(req, res, next) => {
				// save produce
				let produce = getProduceFromLocals(res);

				new Produce({
					desc: produce.desc,
					extraDesc: produce.extraDesc,
					// TODO handle unregisterd category & template
					hasUnclassifiedCategory: produce.hasUnclassifiedCategory,
					hasUnclassifiedTemplate: produce.hasUnclassifiedTemplate,
					category: (produce.hasUnclassifiedCategory ?
						null : produce.category),
					template: (produce.hasUnclassifiedTemplate ?
						null : produce.template),
					unclassifiedCategory: (produce.hasUnclassifiedCategory ?
						produce.category : null),
					unclassifiedTemplate: (produce.hasUnclassifiedTemplate ?
						produce.template : null),
					harvestTime: res.locals._parseDate(produce.harvestTime, 'DD/MM/YYYY'),
					origin: produce.origin,
					price: produce.price,
					amount: produce.amount,
					address: produce.address,
					city: produce.city,
					district: produce.district,
					// hidden properties
					seller: res.locals.authentication._id,
					publishedAt: new Date(),
					status: 'new'
				})
				.save()
				.then(() => next())
				.catch(err => next(err));
			},
			(req, res, next) => {
				res._redirect('landingpage', {
					action: 'post-produce-succeed'
				});
			}
		);

	app._route('produce.wizard-3', '/wizard/step-3')
		.get(
			authMiddleware.redirectIfUnauthenticated,
			(req, res, next) => {
				res.render('produce-wizard-3');
			}
		);
};
