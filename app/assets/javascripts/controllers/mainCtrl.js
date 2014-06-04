app.controller('MainCtrl', ['$scope', 'GovTrack', 'Tweets', 'Sunlight',
	function($scope,GovTrack,Tweets,Sunlight){
		var useState = false;
		var intervals = [];
		$scope.currentCon = 0;
		$scope.stateCongs = [];
		$scope.showPhone = false;
		$scope.tweetHL = "Tweets from Members of Congress"
		$scope.$on('$viewContentLoaded', function() {
			$('#map').vectorMap({
				map: 'us_aea_en',
				backgroundColor: '#fff',
				zoomButtons: false,
				zoomOnScroll: false,
				regionStyle: {
					initial: {
						fill: 'rgb(0,82,165)'
					},
					selected: {
						fill: 'green'
					}
				},
				onRegionClick: function(e, code){
					console.log('in onRegionClick');
					console.log('e', e);
					console.log('code', code);
					$scope.currentState = code.substring(3);
					console.log('$scope.currentState', $scope.currentState);
					var stateCongTwitterIDs = getStateCongs($scope.currentState);
					console.log('stateCongTwitterIDs', stateCongTwitterIDs);
					$scope.tweetHL = "Tweets from Members of Congress representing "
												 + $scope.currentState;

					// make request for tweet state data
					Tweets.state({ stateCongs: stateCongTwitterIDs }, function(data){
						console.log('data.tweets', data.tweets);
						formatTweets(data.tweets);
						$scope.tweets = data.tweets;
						useState = true;

						lastTweetId = data.last_id;
						console.log('lastTweetId initially set to', lastTweetId);
						console.log("that tweet's text was", data.tweets[0].text);

						clearIntervals();
						// manage state tweet refreshing
						var newInterval = window.setInterval(function(){
							if (useState === true){
								console.log('triggering state refresh.');
								Tweets.refresh_state(
									{
										stateCongs: stateCongTwitterIDs, 
										lastId: lastTweetId
									}, 
									function(refreshed){
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
									}
								);
							}
						}, 30000);
						intervals.push(newInterval);
					});
				}
			});
    });
		function getStateCongs(state){	
			var stateCongs = $scope.congress.filter(function(pol){
				return pol.state === state;
			});
			$scope.stateCongs = stateCongs;

			var stateSunCongs = $scope.sunCons.filter(function(sunCon){
				return sunCon.state === state;
			});
			$scope.stateSunCons = stateSunCongs;
			console.log('$scope.stateCongs', $scope.stateCongs);
			var stateCongTwitterIDs = stateCongs.map(function(obj){
				return obj.person.twitterid;
			});
			stateCongTwitterIDs = stateCongTwitterIDs.filter(function(id){
				return id !== null;
			});
			return stateCongTwitterIDs;
		};

		$scope.setCurrentCon = function(index){
			$scope.currentCon = index;
			$scope.showPhone = false;
			console.log('$scope.CurrentCon', $scope.currentCon);
		}

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
		function formatTweets(tweets){
			tweets.forEach(function(tweet){
				tweet.profile_image_url.path = 
									tweet.profile_image_url.scheme +
									'://'+ tweet.profile_image_url.host + 
									tweet.profile_image_url.path 
				tweet.profile_image_url.path = 
									tweet.profile_image_url.path.replace(/_normal/,"_bigger");
				//console.log('rep', rep);
			});
		}
		Tweets.get({}, function(data){
			formatTweets(data.tweets);
			$scope.tweets = data.tweets;
			console.log('$scope.tweets', $scope.tweets);	

		  lastTweetId = data.last_id;
			console.log('lastTweetId initially set to', lastTweetId);
			console.log("that tweet's text was", data.tweets[0].text);

			clearIntervals();
			var newInterval = window.setInterval(function(){
				//if (useState === false){
					console.log('triggering refresh.');
					Tweets.refresh({lastId: lastTweetId}, function(refreshed){
						formatTweets(refreshed.tweets);
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
				//}
			}, 30000);
			intervals.push(newInterval);
		});

		function clearIntervals(){
			intervals.forEach(function(interval){
				window.clearInterval(interval);
			});
		}

		Sunlight.all({ page: '1' }, function(data){
			console.log('sundlight data', data);
			var count = data.count;
			var total = count;
			var pages = Math.ceil(total/50);
			var results = data.results;
			for(var i=2; i <= pages; i++){
				Sunlight.all({ page: i }, function(nextData){
					results = results.concat(nextData.results);
					console.log('nextData', nextData);
					console.log('results', results);
					$scope.sunCons = results;
				});
			}
		});
		$scope.test = 'scope test';					
		$scope.togglePhone = function(){
			$scope.showPhone = !$scope.showPhone;
		}
		$scope.message = {
			 text: 'hello world!',
			 time: new Date()
		};
	}
]);
