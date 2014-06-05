app.factory('Sunlight', ['$http', '$resource',
	function($http, $resource){
		var url = 'http://congress.api.sunlightfoundation.com/:action';
		var sunResource = $resource(url,
				{
					action: 'legislators',
					apikey: 'ffa2e6cde3af41d7b500ea5ab166f59c',
					per_page: '50'
				},  
				{ all: {
						method: 'GET',
						params: { in_office: 'true',page: "@page" },
						headers: {'Content-Type': 'application/json'}
					},
					votes: {
						method: 'GET',
						action: 'votes',
						params: { action: 'votes',page: "@page", order: "voted_at" },
						headers: { 'Content-Type': 'application/json' }
					}
				});
		return sunResource;
	}	
]);
