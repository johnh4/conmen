app.factory('Tweets', ['$http', '$resource',
	function($http, $resource){
		var url = '/home/all_tweets/:twitter_ids';
		var tweetResource = $resource(url, {twitter_ids: []},
				{ get: {
							  method: 'GET',
								headers: {'Content-Type': 'application/json'}
								}
				});
		return tweetResource;
	}	
]);
