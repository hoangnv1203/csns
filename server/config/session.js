'use strict';

exports.name = '/config/session';
exports.requires = [
	'@uuid',
	'@express-session',
	'/config/app',
	'/config/env'
];
exports.factory = (uuid, session, app, env) => {
	app.set('trust proxy', 1);

	app.use((req, res, next) => {
		// get sessionID or generate one
		req.sessionID = req.signedCookies[env.session.name] || uuid.v4();

		res.cookie(env.session.name, req.sessionID, {
			maxAge: env.session.maxAge,
			secure: env.cookie.secure,
			httpOnly: true,
			signed: true
		});

		next();
	});

	app.use(session({
		secret: env.cookie.secret,
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: env.cookie.secure,
			maxAge: env.session.maxAge
		}
	}));
};
