starter.controller("weatherCtrl", function($scope, $http, $q) {

	var weather = this;

	$scope.lat = "--";
	$scope.long = "--";

	weather.temp = "--";
	weather.desc = "--";

	var weatherIcons = {
		fog: "../img/weather-icons/day-light-clouds.png",
		chancerain: "../img/weather-icons/day-light-rain.png",
		clear: "../img/weather-icons/day-clear.png",
		rain: "../img/weather-icons/day-heavy-rain.png",
		cloudy: "../img/weather-icons/day-light-clouds.png",
		mostlycloudy: "../img/weather-icons/day-cloudy.png",
		partlycloudy: "../img/weather-icons/sun-clouds.png",
		snow: "../img/weather-icons/day-snowy.png"
	};

	function setValues(result) {
		const iconName = result.data.current_observation.icon;
		weather.bkgd = iconName;
		weather.allIcons = weatherIcons;
		weather.icon = weatherIcons[iconName];
		weather.forecastData = result.data.forecast.simpleforecast.forecastday;
		weather.temp = result.data.current_observation.temp_f;
		weather.desc = result.data.current_observation.weather;
		weather.city = result.data.current_observation.display_location.full;
	}

	function setLocalStorage(result) {
		console.log(result);
		var history = JSON.parse(localStorage.getItem('searchHistory')) || {};
		var city = result.data.current_observation.display_location.full;
		var id = result.data.current_observation.station_id
		history[city] = id;
		localStorage.setItem('searchHistory', JSON.stringify(history));
		weather.searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
	}


	//----------------//
	// GET SEARCH DATA
	//----------------//
	$scope.getZipWeather = function(event, search) {
		if (event.keyCode === 13) {
			$http.get("http://api.wunderground.com/api/c038c875c4755d69/conditions/forecast/q/" + search + ".json")
			.then(function(result) {
				console.log("all weather", result);
				setValues(result);
				setLocalStorage(result);
			});
		}
	};

	$scope.getOldSearch = function(search) {
		$http.get("http://api.wunderground.com/api/c038c875c4755d69/conditions/forecast/q/" + search + ".json")
		.then(function(result) {
			setValues(result);
			setLocalStorage(result);
		});
	};



	//------------//
	// AUTOIP DATA
	//------------//
	$q(function(resolve, reject) {
		// gets user's ip address
		$http.get("http://api.wunderground.com/api/c038c875c4755d69/geolookup/q/autoip.json")
		.success(function(ipdata) {
			resolve(ipdata);
		}, function(error) {
			console.log("there was an error", error);
			reject(error);
		});
	})
	// gets weather based on user's ip address
	.then(function(ipdata) {
		var lat = ipdata.location.lat;
		var long = ipdata.location.lon;
		$http.get("http://api.wunderground.com/api/c038c875c4755d69/conditions/forecast/q/" + lat + "," + long + ".json")
		.then(function(result) {
			setValues(result);
			setLocalStorage(result);
		});
	});; //end q




	//-----------------//
	// GEOLOCATION DATA
	//-----------------//
	// if user allows geolocation data
	$q(function(resolve, reject) {
		navigator.geolocation.getCurrentPosition(function(geopos) {
			resolve(geopos);
		}, function(error) {
			console.log("there was an error", error);
			reject(error);
		})
	})
	.then(function(geopos) {
		var lat = geopos.coords.latitude;
		var long = geopos.coords.longitude;
		$http.get("http://api.wunderground.com/api/c038c875c4755d69/conditions/forecast/q/" + lat + "," + long + ".json")
		.then(function(result) {
			setValues(result);
			setLocalStorage(result);
		});
	});; //end q




});
