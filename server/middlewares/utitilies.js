'use strict';

exports.name = '/middlewares/utilities';
exports.factory = () => {
	return {
		copyToLocals: (fromKey, toKey) => (req, res, next) => {
			res.locals[toKey] = req[fromKey];

			next();
		},
		redirect: route => (req, res, next) => res._redirect(route),
		getMessage: (key) => (req, res, next) => {
			res.locals[key] = req.flash(key);
			
			next();	
		}
	};
};
