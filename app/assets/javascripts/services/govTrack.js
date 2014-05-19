app.factory('GovTrack', ['$http', 
	function($http){

		var congress = {};
		congress.allCong = function(){
			return $http.get('https://www.govtrack.us/api/v2/role?current=true');
		};

		return congress;
	}
]);
