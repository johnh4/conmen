app.controller('MainCtrl', 
	['$scope','GovTrack','Tweets','Sunlight','NYTimes','Influencer',
	function($scope,GovTrack,Tweets,Sunlight,NYTimes,Influencer){
		var useState = false;
		var intervals = [];
		$scope.currentCon = 0;
		$scope.stateCongs = [];
		$scope.showPhone = false;
		$scope.tweetHL = "Tweets from Members of Congress"
		$scope.currentView = "tweets";

		$scope.setCurrentView = function(view){
			console.log('in setCurrentView');
			$scope.currentView = view;
			console.log('$scope.currentView', $scope.currentView);
		}

		$scope.viewSelected = function(view){
			return $scope.currentView == view;
		}

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
					$scope.tweetHL = "Tweets from Members of Congress Representing "
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
			$scope.currentCon = $scope.stateSunCons[0];
			console.log('$scope.stateSunCons', $scope.stateSunCons);
			getEntityIDs();
			var stateCongTwitterIDs = stateCongs.map(function(obj){
				return obj.person.twitterid;
			});
			stateCongTwitterIDs = stateCongTwitterIDs.filter(function(id){
				return id !== null;
			});
			return stateCongTwitterIDs;
		};

		$scope.setCurrentCon = function(con){
			$scope.currentCon = con;
			console.log('$scope.CurrentCon', $scope.currentCon);
			getMoney();
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
				tweet.text = tweet.text.replace(/\.@/,". @");
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
		/*
		Sunlight.votes({ page: '1' }, function(data){
			console.log('sundlight vote data', data);
			$scope.votes = data.results;
		});
		*/

		// give the votes a supported by party percentage
		function formatVotes(votes){
			votes.forEach(function(vote){
				var percent = parseInt(vote.democratic.yes) / 
											(parseInt(vote.democratic.yes) + 
											parseInt(vote.democratic.no) + 
											parseInt(vote.democratic.not_voting) + 
											parseInt(vote.democratic.present)) * 100;
				vote.democratic.percent = "" + Math.round(percent) + "%";
				percent = parseInt(vote.republican.yes) / 
											(parseInt(vote.republican.yes) + 
											parseInt(vote.republican.no) + 
											parseInt(vote.republican.not_voting) + 
											parseInt(vote.republican.present)) * 100;
				vote.republican.percent = "" + Math.round(percent) + "%";
				vote.time = Date.parseExact(vote.time, "HH:mm:ss").toString("hh:mm tt");
				vote.date = Date.parseExact(vote.date, 
												"yyyy-MM-dd").toString("MMMM dS, yyyy");
			});
		}

		// get recent vote data from the nytimes api
		NYTimes.votes({}, function(data){
			console.log('nyt vote data', data);
			formatVotes(data.results.votes);
			$scope.votes = data.results.votes;
		});
		
		function getEntityIDs(){
			$scope.stateSunCons.forEach(function(con){
				Influencer.idLookup({ bioguide_id: con.bioguide_id }, function(data){
					con.name = con.first_name + " " + con.last_name;
					con.transparency_id = data[0].id;
				});
			});
		}

		function getMoney(){
			console.log('get money.');
			Influencer.contributors({ entityID: $scope.currentCon.transparency_id }, 
				function(conData){
					$scope.conContributors = conData;
					console.log('$scope.conContributors', $scope.conContributors);
				}
			);
			Influencer.sectors({ entityID: $scope.currentCon.transparency_id }, 
				function(conData){
					conData.forEach(function(sector){
						sectorName(sector);
					});
					$scope.conSectors = conData;
					console.log('$scope.conSectors', $scope.conSectors);
				}
			);
			function sectorName(sector){
				switch (sector.sector){
					case "A":
						sector.name = "Agribusiness";
						break;
					case "B":
						sector.name = "Communications/Electronics";
						break;
					case "C":
						sector.name = "Construction";
						break;
					case "D":
						sector.name = "Defense";
						break;
					case "E":
						sector.name = "Energe/Natural Resources";
						break;
					case "F":
						sector.name = "Finance/Insurance/Real Estate";
						break;
					case "H":
						sector.name = "Health";
						break;
					case "K":
						sector.name = "Lawyers and Lobbyists";
						break;
					case "M":
						sector.name = "Transportation";
						break;
					case "N":
						sector.name = "Misc. Business";
						break;
					case "Q":
						sector.name = "Ideology/Single Issue";
						break;
					case "P":
						sector.name = "Labor";
						break;
					case "W":
						sector.name = "Other";
						break;
					case "Y":
						sector.name = "Unknown";
						break;
					case "Z":
						sector.name = "Administrative Use";
						break;
				}
				console.log('sector.name', sector.name);
			}
		}

		$scope.test = 'scope test';					
		$scope.togglePhone = function(){
			$scope.showPhone = !$scope.showPhone;
		}
	}
]);
