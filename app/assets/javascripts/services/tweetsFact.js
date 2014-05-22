app.factory('Tweets', ['$http', '$resource',
	function($http, $resource){
		var url = '/tweets/all_tweets/:lastId';
		var tweetResource = $resource(url,{},  
				{ get: {
						method: 'GET',
						headers: {'Content-Type': 'application/json'}
					},
					refresh: {
						method: 'GET',
						params: { lastId: "@lastId" },
						headers: { 'Content-Type': 'application/json' }
					}
				});
		return tweetResource;
	}	
]);
