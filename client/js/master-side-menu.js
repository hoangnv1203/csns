;(function() {
	$(document).ready(function() {
		// create sidebar and attach to menu open
		$('.ui.sidebar').sidebar('attach events', '.pusher > .ui.top.menu .toc.item');
	});
})();
