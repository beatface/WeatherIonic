starter.controller("weatherCtrl", function($scope, $http, $q, $ionicSlideBoxDelegate) {


	// var weather = this;

	$scope.lat = "--";
	$scope.long = "--";

	$scope.temp = "--";
	$scope.desc = "--";

	var searchArray;

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
		$scope.bkgd = iconName;
		$scope.allIcons = weatherIcons;
		$scope.icon = weatherIcons[iconName];
		$scope.forecastData = result.data.forecast.simpleforecast.forecastday;
		$scope.temp = result.data.current_observation.temp_f;
		$scope.desc = result.data.current_observation.weather;
		$scope.city = result.data.current_observation.display_location.full;
	}

	function setLocalStorage(result) {
		console.log(result);
		var history = JSON.parse(localStorage.getItem('searchHistory')) || {};
		var city = result.data.current_observation.display_location.full;
		var id = result.data.current_observation.station_id
		history[city] = id;
		localStorage.setItem('searchHistory', JSON.stringify(history));
		// get updated search history
		$scope.searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
		// convert search history to array for use with ionic slide changes
		searchArray = Object.keys($scope.searchHistory);
		$ionicSlideBoxDelegate.update();
	}
	// Called to navigate to the main app
	$scope.startApp = function() {
		$state.go('main');
	};
	$scope.next = function() {
		$ionicSlideBoxDelegate.next();
	};
	$scope.previous = function() {
		$ionicSlideBoxDelegate.previous();
	};

	// Called each time the slide changes
	$scope.slideChanged = function(index) {
		$scope.getOldSearch(searchArray[index]);
		$scope.slideIndex = index;
	};


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


	setTimeout(function(){
		$ionicSlideBoxDelegate.update();
	},1000);


});
