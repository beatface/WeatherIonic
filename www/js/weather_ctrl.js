starter.controller("weatherCtrl", function($scope, $http, $q) {

	var weather = this;

	$scope.lat = "--";
	$scope.long = "--";
	$scope.poop = "";

	weather.temp = "--";
	weather.desc = "--";

	//------------//
	// GET ZIP DATA
	//------------//
	$scope.getZipWeather = function(event, zip) {
		console.log("you pressed");
		if (event.keyCode === 13) {
			console.log("pressed enter!");
			$http.get("http://api.wunderground.com/api/c038c875c4755d69/conditions/q/" + zip + ".json")
			.then(function(result) {
				console.log("zip weather >>>>>", result);
				weather.temp = result.data.current_observation.temp_f;
				weather.desc = result.data.current_observation.weather;
				weather.icon = result.data.current_observation.icon_url;
			});
		}
	};



	//------------//
	// AUTOIP DATA
	//------------//
	$q(function(resolve, reject) {
		$http.get("http://api.wunderground.com/api/c038c875c4755d69/geolookup/q/autoip.json")
		.success(function(ipdata) {
			resolve(ipdata);
		}, function(error) {
			console.log("there was an error", error);
			reject(error);
		});
	})		
	.then(function(ipdata) {
		console.log("ipdata", ipdata);
		var lat = ipdata.location.lat;
		var long = ipdata.location.lon;
		$http.get("http://api.wunderground.com/api/c038c875c4755d69/conditions/q/" + lat + "," + long + ".json")
		.then(function(result) {
			console.log("zip weather", result);
			weather.temp = result.data.current_observation.temp_f;
			weather.desc = result.data.current_observation.weather;
			weather.icon = result.data.current_observation.icon_url;
		});
	});; //end q


	//-----------------//
	// GEOLOCATION DATA
	//-----------------//
	$q(function(resolve, reject) {
		navigator.geolocation.getCurrentPosition(function(geopos) {
			resolve(geopos);
		}, function(error) {
			console.log("there was an error", error);
			reject(error);
		})
	})		
	.then(function(geopos) {
		console.log("geodata", geopos);
		var lat = geopos.coords.latitude;
		var long = geopos.coords.longitude;
		$http.get("http://api.wunderground.com/api/c038c875c4755d69/conditions/q/" + lat + "," + long + ".json")
		.then(function(result) {
			console.log("zip weather", result);
			weather.temp = result.data.current_observation.temp_f;
			weather.desc = result.data.current_observation.weather;
			weather.icon = result.data.current_observation.icon_url;
		});
	});; //end q


	
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




});