'use strict';

exports.name = '/config/datetime-formatter';
exports.requires = [
	'@moment',
	'/config/app'
];
exports.factory = (moment, app) => {
	app.use((req, res, next) => {
		res.locals._formatDate = formatDate;
		res.locals._parseDate = parseDate;

		next();
	});

	function formatDate(dateObj, pattern) {
		return moment(dateObj).format(pattern);
	}

	function parseDate(text, pattern) {
		return moment(text, pattern).toDate();
	}
};
