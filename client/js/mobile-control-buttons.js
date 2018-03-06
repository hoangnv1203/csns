;(function() {
	$(document).ready(function() {
		$('a[type="submit"]').click(function(e) {
			e.preventDefault();

			var form = $(this).attr('form');

			$('#' + form).submit();
		});
	});
})();
