'use strict';

exports.name = '/middlewares/wizard';
exports.requires = [
	'@querystring',
	'@shortid',
	'/services/session-storage'
];
exports.factory = (querystring, shortId, storage) => {
	return {
		init,
		restore,
		store
	};

	function init(req, res, next) {
		const query = req.query;

		if (query.w) {
			res.locals.wizardId = query.w;

			return next();
		}

		query.w = shortId.generate();

		var newPath = req.path + '?' + querystring.stringify(query);

		res.redirect(newPath);
	}

	function restore(req, res, next) {
		const id = res.locals.wizardId;

		storage
			.get(id)
			.then(value => {
				res.locals.wizardObject = value;

				next();
			})
			.catch(err => next(err));
	}

	function store(req, res, next) {
		const id = res.locals.wizardId;

		storage
			.set(id, res.locals.wizardObject)
			.then(() => next())
			.catch(err => next(err));
	}
};
