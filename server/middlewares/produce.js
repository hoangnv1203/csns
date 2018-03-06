'use strict';

exports.name = '/middlewares/produce';
exports.requires = [
	'/models/produce',
	'/models/user'
];
exports.factory = (Produce, User) => {
	return {
		prepareNew,
		get,
		insert,
		update,
		listing
	};

	function prepareNew(req, res, next) {
		let produce = res.locals.produce = new Produce();
		produce._id = null;

		next();
	}

	function get(req, res, next) {
		const id = req.params.id;

		Produce
			.findById(id)
			.populate([
				'seller',
				'category',
				'template'
			])
			.exec()
			.then(produce => {
				if (!produce) {
					throw new Error('Not found');
				}

				res.locals.produce = produce;

				next();
			})
			.catch(err => next(err))
	}

	function insert(req, res, next) {
		const produce = new Produce({
			shortDescription: req.body.shortDescription,
			description: req.body.description,
			produceType: req.body.produceType,
			produceTypeUnclassified: req.body.produceTypeUnclassified,
			ownerId: res.locals.authentication._id,
			publishedAt: new Date(),
			status: req.body.status || 'On'
		});

		produce
			.save()
			.then(produce => {
				res.locals.produce = produce;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function update(req, res, next) {
		const id = req.params.id;

		Produce
			.findByIdAndUpdate(id, {
				shortDescription: req.body.shortDescription,
				description: req.body.description,
				produceType: req.body.produceType,
				produceTypeUnclassified: req.body.produceTypeUnclassified,
				status: req.body.status || 'On'
			}, {
				safe: true,
				new: true
			})
			.exec()
			.then(produce => {
				res.locals.produce = produce;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function listing(req, res, next) {
		Produce
			.find({
				seller: res.locals.authentication._id
			})
			.sort('-harvestTime -publishedAt')
			.populate([
				'seller',
				'category',
				'template'
			])
			.exec()
			.then(produces => {
				res.locals.produces = produces || [];
			})
			.catch(err => next(err))
			.finally(() => next());
	}
};
