app.factory('Sunlight', ['$http', '$resource',
	function($http, $resource){
		var url = 'http://congress.api.sunlightfoundation.com/:action';
		var sunResource = $resource(url,
				{
					action: 'legislators',
					apikey: 'ffa2e6cde3af41d7b500ea5ab166f59c',
					per_page: '50',
					in_office: 'true',
				},  
				{ all: {
						method: 'GET',
						params: { page: "@page" },
						headers: {'Content-Type': 'application/json'}
					},
					page: {
						method: 'GET',
						params: { page: "@page" },
						headers: { 'Content-Type': 'application/json' }
					}
				});
		return sunResource;
	}	
]);
