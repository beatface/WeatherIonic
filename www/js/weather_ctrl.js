starter.controller("weatherCtrl", ["$scope", "$http", function($scope, $http) {

	// // var apikey = 'de14a07ec9b33cefc10004ceeb682b09';
	// $scope.weatherctrl = {};

	var weather = this;

	$scope.lat = "--";
	$scope.long = "--";
	$scope.poop = "";

	weather.temp = "--";
	weather.desc = "--";


	$scope.getZipWeather = function(zip) {
		$http.get("http://api.wunderground.com/api/c038c875c4755d69/conditions/q/" + zip + ".json")
		.then(function(result) {
			console.log("zip weather", result);
			weather.temp = result.data.current_observation.temp_f;
			weather.desc = result.data.current_observation.weather;
		});
	};


	$scope.getWeather = function() {
		navigator.geolocation.getCurrentPosition(function(geopos) {
			var lat = geopos.coords.latitude;
			var long = geopos.coords.longitude;
			var apikey = "46e68dca4c818903bec6865e4fa6e4c1";
			var url = "/api/forecast/" + apikey + "/" + lat + "," + long;
			
			$http.get(url)
			.then(function(result) {
				console.log("result from api", result);
				weather.temp = result.data.currently.temperature;
				weather.desc = result.data.currently.summary;
				weather.class = result.data.currently.icon;
			});
		});
	};


	
	$scope.showOther = function() {
		$scope.poop = "POOP";
	}

	$scope.getLocation = function() {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(function(geopos) {
	        	console.log("the geopos are ", geopos);
	        	$scope.lat = geopos.coords.latitude;
	        	$scope.long = geopos.coords.longitude;
	        });
	    } else {
	        weatherctrl.response = "Geolocation is not supported by this browser.";
	    }
	}




}]);