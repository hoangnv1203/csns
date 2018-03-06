'use strict';

require('di-linker')
	.walk([
		'server/*.js',
		'server/**/*.js'
	], require)
	.then(context => {
		context
			.config({
				// verboseLog: true
			})
			.bootstrap(['/']);
	})
	.catch(err => console.error(err));
