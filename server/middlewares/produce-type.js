'use strict';

exports.name = '/middlewares/produce-type';
exports.requires = [
	'/models/produce-type'
];
exports.factory = ProduceType => {
	return {
		get,
		insert,
		update,
		listing
	};

	function get(req, res, next) {
		const id = req.params.id;

		if (id === 'new') {
			let produceType = res.locals.produceType = new ProduceType();

			produceType._id = null;

			return next();
		}

		ProduceType
			.findById(id)
			.exec()
			.then(produceType => {
				if (!produceType) {
					throw new Error('Not found');
				}
				res.locals.produceType = produceType;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function insert(req, res, next) {
		const produceType = new ProduceType({
			name: req.body.name,
			description: req.body.description,
			lastModifiedAt: new Date(),
			lastModifiedBy: res.locals.authentication._id
		});

		produceType
			.save()
			.then(produceType => {
				res.locals.produceType = produceType;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function update(req, res, next) {
		const id = req.params.id;

		ProduceType
			.findByIdAndUpdate(id, {
				name: req.body.name,
				description: req.body.description,
				lastModifiedAt: new Date(),
				lastModifiedBy: res.locals.authentication._id
			}, {
				safe: true,
				new: true
			})
			.exec()
			.then(produceType => {
				res.locals.produceType = produceType;
			})
			.catch(err => next(err))
			.finally(() => next());
	}

	function listing(req, res, next) {
		ProduceType
			.find()
			.exec()
			.then(produceTypes => {
				res.locals.produceTypes = produceTypes || [];
			})
			.catch(err => next(err))
			.finally(() => next());
	}
};
