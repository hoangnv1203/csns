'use strict';

exports.name = '/middlewares/produce-template';
exports.requires = [
	'/models/produce-template'
];
exports.factory = ProduceTemplate => {
	return {
		findAll,
		findByCategory,
		insert,
		get,
		update,
		deleteTemplate
	};

	function findAll(req, res, next) {
		ProduceTemplate
			.find()
			.sort('name')
			.exec()
			.then(produceTemplates => {
				res.locals.produceTemplates = produceTemplates || [];
				next();
			})
			.catch(err => next(err));
	}

	function findByCategory(req, res, next) {
		ProduceTemplate
			.find({
				category: res.locals.produceCategory._id
			})
			.sort('name')
			.exec()
			.then(produceTemplates => {
				res.locals.produceTemplates = produceTemplates || [];
				next();
			})
			.catch(err => next(err));
	}

	function insert(req, res, next) {
		let tags = req.body.tags;
		tags = tags && tags.split(',');

		const template = new ProduceTemplate({
			tags: tags,
			name: req.body.name,
			desc: req.body.desc
		});

		template
			.save()
			.then(template => {
				req.flash('success', 'Tạo tag thành công');
				res.locals.template = template;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function get(req, res, next) {
		let id = req.params.id;

		ProduceTemplate
			.findById(id)
			.then(template => {
				res.locals.template = template;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function update(req, res, next) {
		const id = req.params.id;
		let tags = req.body.tags;
		tags = tags && tags.split(',');
		
		ProduceTemplate
			.findByIdAndUpdate(id, {
				tags: tags,
				name: req.body.name,
				desc: req.body.desc
			}, {
				new: true
			})
			.then(template => {
				req.flash('success', 'Cập thành công');
				res.locals.template = template;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function deleteTemplate(req, res, next) {
		ProduceTemplate
			.findByIdAndRemove(req.params.id)
			.exec()
			.then(template => {
				req.flash('success', 'Xóa thành công mẫu: ' + template.name);
			})
			.catch(err => next(err))
			.finally(() => next());
	}
}
