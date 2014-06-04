app.factory('GovTrack', ['$http','$resource', 
	function($http,$resource){
		var url ='https://www.govtrack.us/api/v2/:action';
		var congResource = $resource(url, 
			{
				action: 'role', 
				limit: '600'
			},
			{
				get: {
					//isArray: true
					params: { current: 'true' }
				},
				latestVotes: {
					method: 'GET',
					params: { 
						action: 'vote_voter', person: '@person', limit: "6", sort: "-created"
					},
					headers: { 'Content-Type': 'application/json' }
				}
			}
		);
		return congResource;
	}
]);
