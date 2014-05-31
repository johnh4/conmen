app.controller('MainCtrl', ['$scope', 'GovTrack', 'Tweets',
	function($scope,GovTrack,Tweets){
		var useState = false;
		$scope.$on('$viewContentLoaded', function() {
			$('#map').vectorMap({
				map: 'us_aea_en',
				onRegionClick: function(e, code){
					console.log('in onRegionClick');
					console.log('e', e);
					console.log('code', code);
					$scope.currentState = code.substring(3);
					console.log('$scope.currentState', $scope.currentState);
					var stateCongTwitterIDs = getStateCongs($scope.currentState);
					console.log('stateCongTwitterIDs', stateCongTwitterIDs);

					Tweets.state({ stateCongs: stateCongTwitterIDs }, function(data){
						console.log('data.tweets', data.tweets);
						$scope.tweets = data.tweets;
						useState = true;
					});
				}
			});
    });
		function getStateCongs(state){	
			var stateCongs = $scope.congress.filter(function(pol){
				return pol.state === state;
			});
			var stateCongTwitterIDs = stateCongs.map(function(obj){
				return obj.person.twitterid;
			});
			stateCongTwitterIDs = stateCongTwitterIDs.filter(function(id){
				return id !== null;
			});
			return stateCongTwitterIDs;
		};

		function onlyStateTweets(stateCongs){
		}
		//get congress obj from govtrack
		GovTrack.get(function(pols){
				console.log('pols', pols);	
				$scope.congress = pols.objects;

				//get their names from the returned obj
				var names = pols.objects.map(function(pol){
					return pol.person.name;
				});
				$scope.allNames = names;

		});

		var lastTweetId;
		//get stack of tweets from congress list
		Tweets.get({}, function(data){
			$scope.tweets = data.tweets;
			console.log('$scope.tweets', $scope.tweets);	

		  lastTweetId = data.last_id;
			console.log('lastTweetId initially set to', lastTweetId);
			console.log("that tweet's text was", data.tweets[0].text);

			window.setInterval(function(){
				if (useState === false){
					console.log('triggering refresh.');
					Tweets.refresh({lastId: lastTweetId}, function(refreshed){
						var newTweets = refreshed.tweets;
						console.log('newTweets', newTweets);
						console.log("refreshed.last_id", refreshed.last_id);
						//set new lastTweetId
						if(newTweets.length > 0) {
							lastTweetId = refreshed.last_id;
							for(var i = newTweets.length - 1; i >= 0; i--){
								$scope.tweets.unshift(newTweets[i]);
							}
						}
					});
				}
			}, 30000);
		});


		$scope.test = 'scope test';					

	}
]);
