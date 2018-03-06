;(function() {
	$(document).ready(function() {
		$('.close.icon')
			.on('click', function() {
				$(this).parent().transition('fade');
			});
	});
})();
