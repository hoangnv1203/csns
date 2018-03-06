$(document).ready(function() {
	$('.ui.form.user')
		.form({
			fields: {
				displayName: {
					rules: [
						{
							type: 'empty',
							prompt: 'Tên hiển thị chưa nhập, vui lòng nhập tên hiển thị!'
						}
					]
				},
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
				},
				confirmPassword: {
					rules: [
						{
							type: 'empty',
							prompt: 'Xác nhận Password chưa nhập!'
						}
					]
				}
			}
		});
});