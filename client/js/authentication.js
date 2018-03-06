;(function() {
	$(document).ready(function() {
		$('.ui.form.authentication')
			.form({
				fields: {
					email: {
						indentifier: 'email',
						rules: [
							{
								type: 'email',
								prompt: 'Địa chỉ email chưa đúng định dạng, vui lòng nhập lại!'
							}
						]
					},
					password: {
						rules: [
							{
								type: 'empty',
								prompt: 'Password chưa nhập vui lòng nhập password!'
							}
						]
					}
				}
			});
	});
})();