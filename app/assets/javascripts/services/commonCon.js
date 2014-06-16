app.service('CommonCon', 
	['Sunlight','Influencer', 'NYTimes','Tweets','$q',
	function(Sunlight,Influencer,NYTimes,Tweets,$q){

		var self = this;
		var currentCon = {};
		var currentChamber = "senate";
		var currentState = null;
		var sunCons = null;
		var stateSunCons = null;
		var conContributors = null;
		var conSectors = null;
		var type = null;
		var memberVotes = null;
		var tweets = null;
		var tweetHL = "Tweets from Members of Congress";

		var entityDefer;

		/************ GENERAL ************/

		this.setCurrentCon = function(con){
			currentCon = con;
			console.log('currentCon in serv', currentCon);
			currentChamber = currentCon.chamber;
			console.log('currentChamber in setCurrentCon serv', currentChamber);
			self.getMoney();
			self.fetchMemberVotes();
		}

		this.onlySetCurrentCon = function(con){
			currentCon = con;
			console.log('onlySetCurrentCon in serv', currentCon);
			currentChamber = currentCon.chamber;
			console.log('currentChamber in onlySetCurrentCon serv', currentChamber);
			currentState = currentCon.state;
			console.log('currentState in onlySetCurrentCon serv', currentState);
		}

		this.getCurrentCon = function(){
			return currentCon;
		}

		this.setChamber = function(chamber){
			currentChamber = chamber;
			console.log('currentChamber', currentChamber);
		}

		this.getCurrentChamber = function(){
			return currentChamber;
		}

		this.setCurrentState = function(state){
			currentState = state;
		}
		this.getCurrentState = function(){
			return currentState;
		}

		this.getConContributors = function(){
			return conContributors;
		}
		this.getConSectors = function(){
			return conSectors;
		}
		this.getType = function(){
			return type;
		}

		this.genStateCons = function(){	
			console.log('in serv genStateCons');
			console.log('currentState in serv', currentState);
			stateSunCons = sunCons.filter(function(sunCon){
				return sunCon.state === currentState;
			});
			console.log('stateSunCons in serv', stateSunCons);

			/*
			// promise 
			entityDefer = $q.defer();
			var entityPromise = entityDefer.promise;
			entityPromise.then(function(){
				console.log('entity ids unlocked. stateSunCons:', stateSunCons);
				// could move setCurrentCon to here
			});
			*/

			// get transparency_ids for influencer api call
			getEntityIDs();

			// return array of twitter ids
			var stateCongTwitterIDs = stateSunCons.map(function(obj){
				return obj.twitter_id;
			});
			stateCongTwitterIDs = stateCongTwitterIDs.filter(function(id){
				return id !== null && (id !== undefined);
			});
			return stateCongTwitterIDs;
		};

		this.getStateSunCons = function(){
			return stateSunCons;
		}

		this.getSunCons = function(){
			return sunCons;
		}

		function getEntityIDs(){
			stateSunCons.forEach(function(con, index){
				Influencer.idLookup({ bioguide_id: con.bioguide_id }).$promise.
				then(function(data){
					// add the transparency_id to each congressperson in our state list
					con.transparency_id = data[0].id;
					console.log('con in influencer', con);
					// set the current congressperson now that we can make the api calls
					if (currentCon.bioguide_id === con.bioguide_id && 
							currentCon.state === currentState){
						// if con is current one and is already current, make the calls
						self.setCurrentCon(currentCon);
					}
					else if(index === 0 && currentCon.state != currentState){
						// otherwise first in index will be current, make the calls with it
						self.setCurrentCon(con);
					}
				});
			});
			//entityDefer.resolve();
		}

		// initial get of congressperson data from the Sunlight service
		// put in init() or run() function to run on page load
		this.run = function(){
			Sunlight.all({ page: '1' }).$promise.then(function(data){
				console.log('sunlight data in serv page 1', data);
				// can only retrieve 50 results at a time, so manage multiple calls
				//var count = data.count;
				var total = data.count;
				// pages default to 1 when total isn't available
				var pages = Math.ceil(total/50) || 1;
				formatSunRes(data.results);
				var results = data.results;
				if(pages <= 1) sunCons = results;
				for(var i=2; i <= pages; i++){
					Sunlight.all({ page: i }).$promise.then(function(nextData){
						// set the full name for each congressperson
						formatSunRes(nextData.results);
						results = results.concat(nextData.results);
						if(results.length > 520){
							console.log('sunlight results', results);
						}
						sunCons = results;
					});
				}
			});
		}

		this.run();

		// add a full name to each congressperson object
		function formatSunRes(results){
			results.forEach(function(con){
				con.name = con.first_name + " " + con.last_name;
			});
		}

		/************** TWEETS **************/

		this.getTweets = function(){
			return tweets;
		}

		this.setTweets = function(newTweets){
			tweets = newTweets;
		}

		this.updateTweets = function(new_data){
			self.formatTweets(new_data.tweets);
			var newTweets = new_data.tweets;
			console.log('newTweets', newTweets);
			console.log("new_data.last_id", new_data.last_id);
			//set new lastTweetId
			if(newTweets.length > 0) {
				lastTweetId = new_data.last_id;
				for(var i = newTweets.length - 1; i >= 0; i--){
					tweets.unshift(newTweets[i]);
				}
			}
		}

		this.getTweetHL = function(){
			return tweetHL;
		}

		this.setTweetHL = function(HL){
			tweetHL = HL;
		}
		
		var useState = false;
		var intervals = [];
		this.getTweetStateData = function(stateCongTwitterIDs){
			console.log('in getTweetStateData() in serv');
			Tweets.state({stateCongs:stateCongTwitterIDs}).$promise.then(function(data){
				console.log('data.tweets', data.tweets);
				self.formatTweets(data.tweets);
				tweets = data.tweets;
				useState = true;
				lastTweetId = data.last_id;
				console.log('lastTweetId initially set to', lastTweetId);
				console.log("that tweet's text was", data.tweets[0].text);

				self.clearIntervals();
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
								self.updateTweets(refreshed);
								/*
								var newTweets = refreshed.tweets;
								console.log('newTweets', newTweets);
								console.log("refreshed.last_id", refreshed.last_id);
								//set new lastTweetId
								if(newTweets.length > 0) {
									lastTweetId = refreshed.last_id;
									for(var i = newTweets.length - 1; i >= 0; i--){
										tweets.unshift(newTweets[i]);
									}
								}
								*/
							}
						);
					}
				}, 30000);
				intervals.push(newInterval);
			});
		}

		// manage setInterval stack
		this.clearIntervals = function(){
			intervals.forEach(function(interval){
				window.clearInterval(interval);
			});
		}
		this.addInterval = function(newInterval){
			intervals.push(newInterval);
		}

		//get stack of tweets from congress list
		this.formatTweets = function(dataTweets){
			dataTweets.forEach(function(dataTweet){
				dataTweet.profile_image_url.path = 
									dataTweet.profile_image_url.scheme +
									'://'+ dataTweet.profile_image_url.host + 
									dataTweet.profile_image_url.path 
				// get larger photos
				dataTweet.profile_image_url.path = 
									dataTweet.profile_image_url.path.replace(/_normal/,"_bigger");
				// workaround link filter bug
				dataTweet.text = dataTweet.text.replace(/\.@/,". @");
			});
		}

		/************** VOTES **************/

		this.fetchMemberVotes = function(){
			console.log('in fetchMemberVotes in serv');
			console.log('currentCon in fetchMemberVotes', currentCon);
			NYTimes.memberVotes({ memberID: currentCon.bioguide_id }).$promise.then(function(data){
					self.formatVotes(data.results[0].votes);
					console.log('nyt member vote data', data);
					memberVotes = data.results[0].votes;
					console.log('memberVotes', memberVotes);
				}
			);
		}

		this.getMemberVotes = function(){
			return memberVotes;
		}
		this.formatVotes = function(votes){
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

		/************** MONEY **************/

		this.getMoney = function(){
			console.log('get money in serv.');
			// memoize this
			Influencer.contributors({ entityID: currentCon.transparency_id }).$promise
			.then(function(conData){
					conContributors = conData;
					console.log('conContributors in serv getMoney', conContributors);
				}
			);
			Influencer.sectors({ entityID: currentCon.transparency_id }).$promise
			.then(function(conData){
					conData.forEach(function(sector){
						sectorName(sector);
					});
					conSectors = conData;
					console.log('conSectors in serv getMoney', conSectors);
				}
			);
			Influencer.typeBreakdown({ entityID: currentCon.transparency_id }).$promise
			.then(function(typeData){
					console.log('typeData in serv getMoney', typeData);
					type = typeData;
					console.log('type in serv getMoney', type);
				}
			);

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
		this.states = [
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
}]);
