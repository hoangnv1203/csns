const cityId = '#city';
const districtId = '#district';
const cityHasChoose = '#city-has-choose';
const districtHasChoose = '#district-has-choose';

$(city)
	.change(function() {
		// remove all option districts
		$(districtId).html('');

		let city = $(cityId).val();
		city = city.replace(/ /g,'-');
		let districts = $("#citiesDistricts-" + city).val();
		addSelectDistrict(districts);
	});

const districtsOfCity = $(cityHasChoose).val();
const districtValue = $(districtHasChoose).val();

if (districtsOfCity) {
	addSelectDistrict(districtsOfCity, districtValue);
}

function addSelectDistrict(districts, district) {
	districts = districts.split(',');

	for (var i = 0; i < districts.length; i++) {
		if (district === districts[i]) {
			$(districtId)
				.append('<option selected value="' + districts[i] + '">' + districts[i] + '</option>');
		} else {
			$(districtId)
				.append('<option value="' + districts[i] + '">' + districts[i] + '</option>');
		}
	}
}