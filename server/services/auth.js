'use strict';

exports.name = '/services/auth';
exports.requires = [
	'/services/session-storage',
];
exports.factory = sessionStorage => {
	return {
		getSignedInUser: sid => sessionStorage.get(genSessionKey(sid)),
		signIn: (sid, user) => sessionStorage.set(genSessionKey(sid), user),
		signOut: sid => sessionStorage.remove(genSessionKey(sid))
	};

	function genSessionKey(sid) {
		return 'session:' + sid;
	}
};
