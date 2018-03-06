;(function() {
	var districtsId = $('#districts');
	var citiesStringify = $('#citiesStringify').val();
	var cityHasSave = $('#city-has-save');
	var districtHasSave = $('#district-has-save');

	$(document).ready(function() {
		$('#city')
			.dropdown({
				allowAdditions: true,
				onChange: onChangeValueCity
			})
			.dropdown('set selected', cityHasSave.val());

		$('#district')
			.dropdown({
				allowAdditions: true,
			})
			.dropdown('set selected', districtHasSave.val());

		$('.close.icon')
			.on('click', function() {
				$(this).parent().transition('fade');
			});
	});

	function onChangeValueCity(value, text) {
		districtsId.html('');
		$('#district .text').html('<div class="default text">Chọn quận/huyện</div>');
		var districts;

		for (var i = 0; i < LOCATION_DATA.length; i++) {
			if (value === LOCATION_DATA[i].name) {
				districts = LOCATION_DATA[i].district;
				break;
			}
		}

		addDistricts(districts || []);
	}

	function addDistricts(districts) {
		for (var i = 0; i < districts.length; i++) {
			$(districtsId)
				.append('<div class="item" data-value="' + districts[i].name + '">'+ districts[i].name +'</div>');
		}
	}
})();
