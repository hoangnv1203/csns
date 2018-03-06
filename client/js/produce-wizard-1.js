;(function() {
	var URL_TEMPLATES = {};
	var HTML_TEMP = $('#produce-template-options').html();
	Mustache.parse(HTML_TEMP);

	$(document).ready(function() {
		for (var i = 0; i < TEMPS.length; i++) {
			var temp = TEMPS[i];
			var arr = URL_TEMPLATES[temp.category] = URL_TEMPLATES[temp.category] || [];
			arr.push(temp);
		}

		$('#produce-category-selection').dropdown({
			allowAdditions: true,
			onChange: function() {
				populateProduceTemplates();

				$('#produce-template-selection').dropdown('clear');
			}
		});

		populateProduceTemplates();

		$('#produce-template-selection').dropdown({
			allowAdditions: true
		});
	});

	function populateProduceTemplates() {
		var cat = $('#produce-category-selection').dropdown('get value');

		var templates = URL_TEMPLATES[cat] || [];

		var rendered = Mustache.render(HTML_TEMP, {
			templates: templates
		});

		$('#produce-template-selection .menu').html(rendered);

		$('#produce-template-selection').dropdown('refresh');
	}
})();
