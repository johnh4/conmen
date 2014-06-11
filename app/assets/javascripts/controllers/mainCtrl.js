app.controller('MainCtrl', 
	['$scope','GovTrack','Tweets','Sunlight','NYTimes','Influencer',
	function($scope,GovTrack,Tweets,Sunlight,NYTimes,Influencer){
		var useState = false;
		var intervals = [];
		var lastTweetId;
		$scope.currentCon = 0;
		$scope.stateCongs = [];
		$scope.showPhone = false;
		$scope.tweetHL = "Tweets from Members of Congress"
		$scope.currentView = "votes";
		$scope.contribTab = 'total';
		$scope.currentChamber = "senate";
		$scope.voteView = 'congress';

		/**************** COMMON ******************/

		$scope.setCurrentView = function(view){
			console.log('in setCurrentView');
			$scope.currentView = view;
			console.log('$scope.currentView', $scope.currentView);
		}

		$scope.viewSelected = function(view){
			return $scope.currentView == view;
		}

		$scope.setChamber = function(chamber){
			$scope.currentChamber = chamber;
			console.log('$scope.currentChamber', $scope.currentChamber);
		}

		$scope.getStateCongs = function(){	
			var stateCongs = $scope.congress.filter(function(pol){
				return pol.state === $scope.currentState;
			});
			$scope.stateCongs = stateCongs;

			var stateSunCongs = $scope.sunCons.filter(function(sunCon){
				return sunCon.state === $scope.currentState;
			});
			$scope.stateSunCons = stateSunCongs;
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
			$scope.currentChamber = $scope.currentCon.chamber;
			console.log('$scope.currentChamber', $scope.currentChamber);
			$scope.getMoney();
			$scope.getMemberVotes();
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

		function formatSunRes(results){
			results.forEach(function(con){
				con.name = con.first_name + " " + con.last_name;
			});
		}

		Sunlight.all({ page: '1' }, function(data){
			console.log('sundlight data', data);
			var count = data.count;
			var total = count;
			var pages = Math.ceil(total/50);
			formatSunRes(data.results);
			var results = data.results;
			for(var i=2; i <= pages; i++){
				Sunlight.all({ page: i }, function(nextData){
					// set the full name for each congressperson
					formatSunRes(nextData.results);
					results = results.concat(nextData.results);
					console.log('nextData', nextData);
					console.log('results', results);
					$scope.sunCons = results;
				});
			}
		});

		/**************** TWEETS/MAP *****************/

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
					var stateCongTwitterIDs = $scope.getStateCongs();
					console.log('stateCongTwitterIDs', stateCongTwitterIDs);
					$scope.tweetHL = "Tweets from Members of Congress Representing "
												 + $scope.currentState;

					// make request for tweet state data
					getTweetStateData(stateCongTwitterIDs);
				}
			});
    });

		function getTweetStateData(stateCongTwitterIDs){
			console.log('in getTweetStateData()');
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

		//get stack of tweets from congress list
		function formatTweets(tweets){
			tweets.forEach(function(tweet){
				tweet.profile_image_url.path = 
									tweet.profile_image_url.scheme +
									'://'+ tweet.profile_image_url.host + 
									tweet.profile_image_url.path 
				// get larger photos
				tweet.profile_image_url.path = 
									tweet.profile_image_url.path.replace(/_normal/,"_bigger");
				// workaround link filter bug
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

		$scope.togglePhone = function(){
			$scope.showPhone = !$scope.showPhone;
		}

	  /********************* VOTES *************************/	

		/*
		Sunlight.votes({ page: '1' }, function(data){
			console.log('sundlight vote data', data);
			$scope.votes = data.results;
		});
		*/

		// give the votes a supported by party percentage
		function formatVotes(votes){
			votes.forEach(function(vote){
				if(vote.hasOwnProperty('democratic')){
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
				}
				vote.time = Date.parseExact(vote.time, "HH:mm:ss").toString("hh:mm tt");
				vote.date = Date.parseExact(vote.date, 
												"yyyy-MM-dd").toString("MMMM dS, yyyy");
			});
		}

		// get vote data for the specified chamber
		$scope.getVotes = function(chamber){
			$scope.setChamber(chamber);
			// get recent vote data from the nytimes api
			NYTimes.votes({ chamber: $scope.currentChamber }, function(data){
				console.log('nyt vote data', data);
				formatVotes(data.results.votes);
				$scope.votes = data.results.votes;
			});
		}
		/*
		$scope.getMemberVotes = function(){
			//$scope.setCurrentCon($scope.currentCon);
			console.log('$scope.currentCon in getMemberVotes', $scope.currentCon);
			$scope.memberVotes();
		}
		*/

		$scope.votesFromAll = function(){
			$scope.currentState = $scope.currentCon.state;
			$scope.getStateCongs();
			//$scope.getMemberVotes();
		}

		$scope.getMemberVotes = function(){
			console.log('in $scope.memberVotes');
			console.log('$scope.currentCon in memberVotes', $scope.currentCon);
			//$scope.currentState = $scope.currentCon.state;
			//$scope.getStateCongs();
			NYTimes.memberVotes({ memberID: $scope.currentCon.bioguide_id }, 
				function(data){
					formatVotes(data.results[0].votes);
					console.log('nyt member vote data', data);
					//$scope.memberVotes = data.results[0].votes;
					//console.log('$scope.memberVotes', $scope.memberVotes);
					$scope.memberVotes = data.results[0].votes;
					console.log('$scope.memberVotes', $scope.memberVotes);
				}
			);
		}

		$scope.setVoteView = function(view) {
			if(view === "house"){
				$scope.voteView = 'congress';
				$scope.getVotes('house');
			} else if (view === "senate") {
				$scope.voteView = 'congress';
				$scope.getVotes('senate');
			} else {
				$scope.voteView = view;
			}
			console.log('$scope.voteView', $scope.voteView);
		}

		$scope.voteViewSelected = function(view){
			return $scope.voteView === view;
		}

		/********************* MONEY *************************/

		function getEntityIDs(){
			$scope.stateSunCons.forEach(function(con, index){
				Influencer.idLookup({ bioguide_id: con.bioguide_id }, function(data){
					// add the transparency_id to each congressperson in our state list
					con.transparency_id = data[0].id;
					// set the current congressperson now that we can make the api calls
					if ($scope.currentCon.bioguide_id === con.bioguide_id && 
							$scope.currentCon.state === $scope.currentState){
						// if con is current one and is already current, make the calls
						$scope.setCurrentCon($scope.currentCon);
					}
					else if(index === 0 && $scope.currentCon.state != $scope.currentState){
						// otherwise first in index will be current, make the calls with it
						$scope.setCurrentCon(con);
					}
				});
			});
		}

		$scope.getMoney = function(){
			console.log('get money.');
			// memoize this
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
			Influencer.typeBreakdown({ entityID: $scope.currentCon.transparency_id }, 
				function(typeData){
					console.log('typeData', typeData);
					$scope.type = typeData;
					console.log('$scope.type', $scope.type);
				}
			);
			console.log('$scope.currentChamber', $scope.currentChamber);

			function sectorName(sector){
				switch (sector.sector){
					case "A":
						sector.name = "Agribusiness";
						break;
					case "B":
						sector.name = "Communications / Electronics";
						break;
					case "C":
						sector.name = "Construction";
						break;
					case "D":
						sector.name = "Defense";
						break;
					case "E":
						sector.name = "Energy / Natural Resources";
						break;
					case "F":
						sector.name = "Finance / Insurance / Real Estate";
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
						sector.name = "Ideology / Single Issue";
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

		$scope.conFromAll = function(){
			console.log('in conFromAll');
			$scope.currentState = $scope.currentCon.state;
			$scope.getStateCongs();
		}

		$scope.contribTabSelected = function(tab){
		  return $scope.contribTab === tab;
		}

		$scope.setContribTab = function(tab){
			$scope.contribTab = tab;
			console.log('$scope.contribTab', $scope.contribTab);
		}

		$scope.states = [
			{
			"name": "Alabama",
			"abbreviation": "AL"
			},
			{
			"name": "Alaska",
			"abbreviation": "AK"
			},
			{
			"name": "American Samoa",
			"abbreviation": "AS"
			},
			{
			"name": "Arizona",
			"abbreviation": "AZ"
			},
			{
			"name": "Arkansas",
			"abbreviation": "AR"
			},
			{
			"name": "California",
			"abbreviation": "CA"
			},
			{
			"name": "Colorado",
			"abbreviation": "CO"
			},
			{
			"name": "Connecticut",
			"abbreviation": "CT"
			},
			{
			"name": "Delaware",
			"abbreviation": "DE"
			},
			{
			"name": "District Of Columbia",
			"abbreviation": "DC"
			},
			{
			"name": "Florida",
			"abbreviation": "FL"
			},
			{
			"name": "Georgia",
			"abbreviation": "GA"
			},
			{
			"name": "Guam",
			"abbreviation": "GU"
			},
			{
			"name": "Hawaii",
			"abbreviation": "HI"
			},
			{
			"name": "Idaho",
			"abbreviation": "ID"
			},
			{
			"name": "Illinois",
			"abbreviation": "IL"
			},
			{
			"name": "Indiana",
			"abbreviation": "IN"
			},
			{
			"name": "Iowa",
			"abbreviation": "IA"
			},
			{
			"name": "Kansas",
			"abbreviation": "KS"
			},
			{
			"name": "Kentucky",
			"abbreviation": "KY"
			},
			{
			"name": "Louisiana",
			"abbreviation": "LA"
			},
			{
			"name": "Maine",
			"abbreviation": "ME"
			},
			{
			"name": "Maryland",
			"abbreviation": "MD"
			},
			{
			"name": "Massachusetts",
			"abbreviation": "MA"
			},
			{
			"name": "Michigan",
			"abbreviation": "MI"
			},
			{
			"name": "Minnesota",
			"abbreviation": "MN"
			},
			{
			"name": "Mississippi",
			"abbreviation": "MS"
			},
			{
			"name": "Missouri",
			"abbreviation": "MO"
			},
			{
			"name": "Montana",
			"abbreviation": "MT"
			},
			{
			"name": "Nebraska",
			"abbreviation": "NE"
			},
			{
			"name": "Nevada",
			"abbreviation": "NV"
			},
			{
			"name": "New Hampshire",
			"abbreviation": "NH"
			},
			{
			"name": "New Jersey",
			"abbreviation": "NJ"
			},
			{
			"name": "New Mexico",
			"abbreviation": "NM"
			},
			{
			"name": "New York",
			"abbreviation": "NY"
			},
			{
			"name": "North Carolina",
			"abbreviation": "NC"
			},
			{
			"name": "North Dakota",
			"abbreviation": "ND"
			},
			{
			"name": "Northern Mariana Islands",
			"abbreviation": "MP"
			},
			{
			"name": "Ohio",
			"abbreviation": "OH"
			},
			{
			"name": "Oklahoma",
			"abbreviation": "OK"
			},
			{
			"name": "Oregon",
			"abbreviation": "OR"
			},
			{
			"name": "Palau",
			"abbreviation": "PW"
			},
			{
			"name": "Pennsylvania",
			"abbreviation": "PA"
			},
			{
			"name": "Puerto Rico",
			"abbreviation": "PR"
			},
			{
			"name": "Rhode Island",
			"abbreviation": "RI"
			},
			{
			"name": "South Carolina",
			"abbreviation": "SC"
			},
			{
			"name": "South Dakota",
			"abbreviation": "SD"
			},
			{
			"name": "Tennessee",
			"abbreviation": "TN"
			},
			{
			"name": "Texas",
			"abbreviation": "TX"
			},
			{
			"name": "Utah",
			"abbreviation": "UT"
			},
			{
			"name": "Vermont",
			"abbreviation": "VT"
			},
			{
			"name": "Virgin Islands",
			"abbreviation": "VI"
			},
			{
			"name": "Virginia",
			"abbreviation": "VA"
			},
			{
			"name": "Washington",
			"abbreviation": "WA"
			},
			{
			"name": "West Virginia",
			"abbreviation": "WV"
			},
			{
			"name": "Wisconsin",
			"abbreviation": "WI"
			},
			{
			"name": "Wyoming",
			"abbreviation": "WY"
			}
		];
		$scope.test = 'scope test';					
	}
]);
