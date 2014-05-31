app.factory('GovTrack', ['$http','$resource', 
	function($http,$resource){

		var url ='https://www.govtrack.us/api/v2/:action';
		var congResource = $resource(url, {action: 'role', current: 'true', limit: '600'},
												{get: {}, isArray: true});
		return congResource;

	}
]);
