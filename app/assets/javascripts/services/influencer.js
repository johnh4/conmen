app.factory('Influencer', ['$http', '$resource',
	function($http, $resource){
		var url = 'http://transparencydata.com/api/1.0/entities.json?';
		var influencerResource = $resource(url,
				{
					apikey: 'ffa2e6cde3af41d7b500ea5ab166f59c'
				},  
				{
					idLookup: {
						method: 'JSONP',
						url: 'http://transparencydata.com/api/1.0/entities/:action',
						params: { action: 'id_lookup.json',
											bioguide_id: "@bioguide_id",
											callback: 'JSON_CALLBACK' },
						isArray: true,
						headers: {'Content-Type': 'application/json'}
					},
					contributors: {
						method: 'JSONP',
						url: 'http://transparencydata.com/api/1.0/aggregates/pol/:entityID/contributors.json',
						params: { entityID: "@entityID", callback: "JSON_CALLBACK" },
						isArray: true,
						headers: {'Content-Type': 'application/json'}
					}
				}
		);
		return influencerResource;
	}	
]);
