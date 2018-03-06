'use strict';

exports.name = '/middlewares/tag';
exports.requires = [
	'/models/produce-tag',
];
exports.factory = (ProduceTag) => {
	return {
		list,
		insert,
		get,
		update,
		deleteTag
	};

	function list(req, res, next) {
		ProduceTag
			.find()
			.sort('name')
			.exec()
			.then(produceTags => {
				res.locals.produceTags = produceTags || [];

				next();
			})
			.catch(err => next(err));
	}

	function insert(req, res, next) {
		const tag = new ProduceTag({
			name: req.body.name,
		});

		tag
			.save()
			.then(tag => {
				req.flash('success', 'Tạo tag thành công');
				res.locals.tag = tag;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function get(req, res, next) {
		let id = req.params.id;

		ProduceTag
			.findById(id)
			.then(tag => {
				res.locals.tag = tag;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function update(req, res, next) {
		const id = req.params.id;
		
		ProduceTag
			.findByIdAndUpdate(id, {
				name: req.body.name
			}, {
				new: true
			})
			.then(tag => {
				req.flash('success', 'Cập thành công');
				res.locals.tag = tag;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function deleteTag(req, res, next) {
		ProduceTag
			.findByIdAndRemove(req.params.id)
			.exec()
			.then(tag => {
				req.flash('success', 'Xóa thành công tag: ' + tag.name);	
			})
			.catch(err => next(err))
			.finally(() => next());
	}
};