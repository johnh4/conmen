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
					},
					state: {
						url: '/tweets/state_tweets/:stateCongs/',
						method: 'GET',
						params: { stateCongs: "@stateCongs" },
						headers: { 'Content-Type': 'application/json' }
					},
					refresh_state: {
						url: '/tweets/state_tweets/:stateCongs/:lastId',
						method: 'GET',
						params: { stateCongs: "@stateCongs", lastId: "@lastId" },
						headers: { 'Content-Type': 'application/json' }
					}
				});
		return tweetResource;
	}	
]);
