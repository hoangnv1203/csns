'use strict';

exports.name = '/services/permission';
exports.factory = () => {
	return {
		hasAdminRole
	}

	function hasAdminRole(user) {
		const roles = user.roles;

		if (!roles) {
			return false;
		}

		return roles.includes('admin');
	}
}
