'use strict';

exports.name = '/routes/admin/produce';
exports.requires = [
	'/config/app',
	'/middlewares/produce-template',
	'/models/produce-category',
	'/models/produce-template',
	'/models/produce-tag',
	'/middlewares/tag',
	'/middlewares/utilities'
];
exports.factory = (app, produceTemplateMiddleware, ProduceCategory, ProduceTemplate, ProduceTag, tagMiddleware, utilitiesMiddleware) => {

	app._route('admin.produce.tags.list', '/admin/produce-tags')
		.get(
			tagMiddleware.list,
			utilitiesMiddleware.getMessage('success'),
			(req, res, next) => {
				res.render('admin/produce-tags');
			}
		);

	app._route('admin.produce.category.list', '/admin/produce-categories')
		.get(
			(req, res, next) => {
				ProduceCategory
					.find()
					.sort('name')
					.exec()
					.then(produceCategories => {
						res.locals.produceCategories = produceCategories || [];

						next();
					})
					.catch(err => next(err));
			},
			(req, res, next) => {
				res.render('admin/produce-categories');
			}
		);

	app._route('admin.produce.category.create', '/admin/produce-categories/create')
		.post(
			(req, res, next) => {
				let produceCategory = new ProduceCategory({
					name: req.body.name,
					prettyUrl: req.body.prettyUrl
				});

				produceCategory
					.save()
					.then(produceCategory => {
						res._redirect('admin.produce.category.detail', {
							prettyUrl: produceCategory.prettyUrl
						});
					})
					.catch(err => next(err));
			}
		);

	app._route('admin.produce.tags.create', '/admin/produce-tags/create')
		.get(
			(req, res, next) => {
				res.render('admin/produce-tag-create');	
			}
		)
		.post(
			tagMiddleware.insert,
			(req, res, next) => {
				res._redirect('admin.produce.tags.detail', {
					id: res.locals.tag._id
				});
			}
		);

	app._route('admin.produce.tags.detail', '/admin/produce-tags/:id')
		.get(
			tagMiddleware.get,
			utilitiesMiddleware.getMessage('success'),
			(req, res, next) => {
				res.render('admin/produce-tag-edit');
			}
		)
		.post(
			tagMiddleware.update,
			(req, res, next) => {
				res._redirect('admin.produce.tags.detail', {
					id: res.locals.tag._id
				});
			}
		);

	app._route('admin.produce.tags.delete', '/admin/produce-tags/:id/delete')
		.get(
			tagMiddleware.deleteTag,
			(req, res, next) => {
				res._redirect('admin.produce.tags.list');
			}
		);	

	app._route('admin.produce.category.delete', '/admin/produce-categories/:prettyUrl/delete')
		.get(
			(req, res, next) => {
				ProduceCategory
					.findOneAndRemove({
						prettyUrl: req.params.prettyUrl
					})
					.exec()
					.then(() => {
						res._redirect('admin.produce.category.list');
					})
					.catch(err => next(err));
			}
		);

	app._route.add('admin.produce.category.detail', {
		create: {
			prettyUrl: 'new'
		}
	});

	app._route('admin.produce.category.detail', '/admin/produce-categories/:prettyUrl')
		.get(
			(req, res, next) => {
				let isCreating = res.locals.isCreating = req.params.prettyUrl === 'new';

				if (isCreating) {
					res.locals.produceCategory = new ProduceCategory();

					next();
				}

				ProduceCategory
					.findOne({
						prettyUrl: req.params.prettyUrl
					})
					.exec()
					.then(produceCategory => {
						if (!produceCategory) {
							throw new Error('Not Found');
						}

						res.locals.produceCategory = produceCategory;

						next();
					})
					.catch(err => next(err));

			},
			produceTemplateMiddleware.findByCategory,
			(req, res, next) => {
				res.render('admin/produce-category');
			}
		)
		.post(
			(req, res, next) => {
				ProduceCategory
					.findOneAndUpdate({
						prettyUrl: req.params.prettyUrl
					}, {
						prettyUrl: req.body.prettyUrl,
						name: req.body.name
					}, {
						safe: true,
						new: true
					})
					.exec()
					.then(produceCategory => {
						res._redirect('admin.produce.category.list');
					})
					.catch(err => next(err));
			}
		);

	app._route('admin.produce.templates.list', '/admin/produce-templates')
		.get(
			utilitiesMiddleware.getMessage('success'),
			produceTemplateMiddleware.findAll,
			(req, res, next) => {
				res.render('admin/produce-templates');
			}
		);

	app._route('admin.produce.templates.create', '/admin/produce-templates/create')
		.get(
			tagMiddleware.list,
			(req, res, next) => {
				res.render('admin/produce-template-create');
			}
		)
		.post(
			produceTemplateMiddleware.insert,
			(req, res, next) => {
				res._redirect('admin.produce.templates.detail', {
					id: res.locals.template._id
				});
			}
		);

	app._route('admin.produce.templates.delete', '/admin/produce-templates/:id/delete')
		.get(
			produceTemplateMiddleware.deleteTemplate,
			(req, res, next) => {
				res._redirect('admin.produce.templates.list');
			}
		);

	app._route('admin.produce.templates.detail', '/admin/produce-templates/:id')
		.get(
			produceTemplateMiddleware.get,
			tagMiddleware.list,
			utilitiesMiddleware.getMessage('success'),
			(req, res, next) => {
				res.render('admin/produce-template-edit');
			}
		)
		.post(
			produceTemplateMiddleware.update,
			(req, res, next) => {
				res._redirect('admin.produce.templates.detail', {
					id: res.locals.template._id
				});
			}
		);

	app._route('admin.produce.template.create', '/admin/produce-categories/:prettyUrl/templates/create')
		.post(
			(req, res, next) => {
				ProduceCategory
					.findOne({
						prettyUrl: req.params.prettyUrl
					})
					.exec()
					.then(produceCategory => {
						if (!produceCategory) {
							throw new Error('Not Found');
						}

						res.locals.produceCategory = produceCategory;

						next();
					})
					.catch(err => next(err));
			},
			(req, res, next) => {
				let produceTemplate = new ProduceTemplate({
					name: req.body.name,
					desc: req.body.desc,
					category: res.locals.produceCategory._id
				});

				produceTemplate
					.save()
					.then(produceTemplate => {
						res._redirect('admin.produce.category.detail', {
							prettyUrl: res.locals.produceCategory.prettyUrl
						});
					})
					.catch(err => next(err));
			}
		);

	app._route('admin.produce.template.delete', '/admin/produce-category/:prettyUrl/templates/:id/delete')
		.get(
			(req, res, next) => {
				ProduceTemplate
					.findByIdAndRemove(req.params.id)
					.exec()
					.then(() => {
						res._redirect('admin.produce.category.detail', {
							prettyUrl: req.params.prettyUrl
						});
					})
					.catch(err => next(err));
			}
		);

	app._route('admin.produce.template', '/admin/produce-categories/:prettyUrl/templates/:id')
		.get(
			(req, res, next) => {
				ProduceCategory
					.findOne({
						prettyUrl: req.params.prettyUrl
					})
					.exec()
					.then(produceCategory => {
						if (!produceCategory) {
							throw new Error('Not Found');
						}

						res.locals.produceCategory = produceCategory;

						next();
					})
					.catch(err => next(err));
			},
			(req, res, next) => {
				let isCreating = res.locals.isCreating = req.params.id === 'new';

				if (isCreating) {
					res.locals.produceTemplate = new ProduceTemplate();

					return next();
				}

				ProduceTemplate
					.findById(req.params.id)
					.exec()
					.then(produceTemplate => {
						if (!produceTemplate) {
							throw new Error('ProduceTemplate not found');
						}

						res.locals.produceTemplate = produceTemplate;

						next();
					})
					.catch(err => next(err));
			},
			(req, res, next) => {
				res.render('admin/produce-template');
			}
		)
		.post(
			(req, res, next) => {
				ProduceTemplate
					.findByIdAndUpdate(req.params.id, {
						name: req.body.name,
						desc: req.body.desc
					}, {
						safe: true,
						new: true
					})
					.exec()
					.then(produceTemplate => {
						res._redirect('admin.produce.category.detail', {
							prettyUrl: req.params.prettyUrl
						});
					})
					.catch(err => next(err));
			}
		);
};
