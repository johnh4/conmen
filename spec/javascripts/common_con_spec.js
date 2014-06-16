describe("CommonCon Service", function(){

	var commonCon;
	var $q, $rootScope;
	var mockSunlight;
	var idLookupDeferreds = [];
	var promises = [];
	var mockInfluencer;
	var mockTwitter;
	var mockTimes;

	var sunCons = { results:
		[
			{
				first_name: "Nancy",
				last_name: "Pelosi",
				state: "CA",
				twitter_id: "@RepPelosi",
				bioguide_id: "111",
				chamber: "house"
			},
			{
				first_name: "John",
				last_name: "Boehner",
				state: "OH",
				twitter_id: "@RepBoehner",
				bioguide_id: "222",
				chamber: "house"
			},
			{
				first_name: "Marco",
				last_name: "Rubio",
				state: "FL",
				twitter_id: "@SenRubio",
				bioguide_id: "333",
				chamber: "senate"
			},
			{
				first_name: "Bill",
				last_name: "Nelson",
				state: "FL",
				twitter_id: "@SenNelson",
				bioguide_id: "444",
				chamber: "senate"
			}
		]
	};
	beforeEach(function(){
		module("ConMen", function($provide){
			mockSunlight = {
				all: function() {
					allDeferred = $q.defer();
					return {$promise: allDeferred.promise};
				}
			};
			mockInfluencer = {
				idLookup: function() {
					idLookupDeferred = $q.defer();
					idLookupDeferreds.push(idLookupDeferred);
					$promise = idLookupDeferred.promise;
					promises.push($promise);
					return {$promise: idLookupDeferred.promise};
				},
				contributors: function() {
					contributorsDeferred = $q.defer();
					return {$promise: contributorsDeferred.promise};
				},
				sectors: function() {
					sectorsDeferred = $q.defer();
					return {$promise: sectorsDeferred.promise};
				},
				typeBreakdown: function() {
					typeDeferred = $q.defer();
					return {$promise: typeDeferred.promise};
				}
			};
			mockTimes = {
				memberVotes: function() {
					timesDeferred = $q.defer();
					return {$promise: timesDeferred.promise};
				}
			};
			mockTwitter = {
				state: function() {
					twitterDeferred = $q.defer();
					return {$promise: twitterDeferred.promise};
				}
			};
			spyOn(mockSunlight, 'all').andCallThrough();
			spyOn(mockInfluencer, 'idLookup').andCallThrough();
			spyOn(mockTwitter, 'state').andCallThrough();
			spyOn(mockTimes, 'memberVotes').andCallThrough();
			$provide.value('Sunlight', mockSunlight);
			$provide.value('Influencer', mockInfluencer);
			$provide.value('Tweets', mockTwitter);
			$provide.value('NYTimes', mockTimes);
		});
	});

	beforeEach(inject(function(_$q_, _$rootScope_){
		$q = _$q_;
		$rootScope = _$rootScope_;
	}));

	beforeEach(inject(function(_CommonCon_, _Sunlight_){
		commonCon = _CommonCon_;
	}));

	// spy on service calls, specify return vals
	describe("sunlight", function(){
		beforeEach(function() {
			allDeferred.resolve(sunCons);
			$rootScope.$apply();
		});
		
		it("should call sunlight.all", function(){
			expect(mockSunlight.all).toHaveBeenCalled();
		});
		it("should populate sunCons", function(){
			var cons = commonCon.getSunCons();
			expect(cons).toEqual(sunCons.results);
		});

		describe("currentCon functions", function(){
			it("should default to an empty object", function(){
				expect(commonCon.getCurrentCon()).toEqual({});
			});
			it("onlySetCurrentCon should set con, and chamber", function(){
				con = { name: "Nancy Pelosi", chamber: "house" };
				commonCon.onlySetCurrentCon(con);
				expect(commonCon.getCurrentCon()).toEqual(con);
				expect(commonCon.getCurrentChamber()).toBe("house");
			});
			describe("setCurrentCon", function(){
				var sunCons;
				beforeEach(function(){
					//con = { name: "Nancy Pelosi", chamber: "house" };
					spyOn(commonCon, "getMoney");
					spyOn(commonCon, "fetchMemberVotes");

					promises = [];
					idLookupDeferreds = [];
					commonCon.setCurrentState("FL");
					commonCon.genStateCons();
					sunCons = commonCon.getSunCons();
					con = sunCons[0];
					idLookupDeferreds.forEach(function(idDef, index){
						idDef.resolve([{ id: "810" }]);
					});
					$rootScope.$apply();

					commonCon.setCurrentCon(con);
				});
				it("should call getMoney and fetchMemberVotes", function(){
					commonCon.setCurrentCon(con);
					expect(commonCon.getMoney).toHaveBeenCalled();
					expect(commonCon.fetchMemberVotes).toHaveBeenCalled();
				});
				it("should set the con, and chamber", function(){
					commonCon.setCurrentCon(con);
					expect(commonCon.getCurrentCon()).toEqual(con);
					expect(commonCon.getCurrentChamber()).toBe("house");
				});
			});
		});

		describe("genStateCons", function(){
			var twitter_ids;
			var stateSunCons;
			beforeEach(function(){
				spyOn(commonCon, "setCurrentCon");
				promises = [];
				idLookupDeferreds = [];
				commonCon.setCurrentState("FL");
				twitter_ids = commonCon.genStateCons();
				stateSunCons = commonCon.getStateSunCons();
				idLookupDeferreds.forEach(function(idDef, index){
					idDef.resolve([{ id: "810" }]);
				});
				$rootScope.$apply();
			});
			it("should calculate the correct stateSunCons", function(){
				expect(stateSunCons).toEqual([
					{
						first_name: "Marco",
						last_name: "Rubio",
						state: "FL",
						twitter_id: "@SenRubio",
						bioguide_id: "333",
						chamber: "senate",
						name: "Marco Rubio",
						transparency_id: "810"
					},
					{
						first_name: "Bill",
						last_name: "Nelson",
						state: "FL",
						twitter_id: "@SenNelson",
						bioguide_id: "444",
						chamber: "senate",
						name: "Bill Nelson",
						transparency_id: "810"
					}
				]);
			});
			it("should generate the correct array of twitter_ids", function(){
				expect(twitter_ids).toContain("@SenRubio", "@SenNelson");
			});
			it("should add the transparency_id", function(){
				stateSunCons.forEach(function(con){
					expect(con.transparency_id).toBeDefined();
				});
			});
			it("should add the full name", function(){
				stateSunCons.forEach(function(con){
					expect(con.name).toEqual(con.first_name + " " + con.last_name);
				});
			});

			/*************** TWEETS **************/

			describe("Tweets", function(){
				var tweets;
				var inputTweet;
				var expectedURL;
				var newTweets;
				beforeEach(function(){
					tweets = { 
						last_id: 5, 
						tweets: [
							{ text: "hi",
								profile_image_url: {
									path: "/mypick_normal.jpg",
									scheme: "http",
									host: "img.twitter.com"
								}
							},
							{ text: "bye",
								profile_image_url: {
									path: "/bye_normal.jpg",
									scheme: "http",
									host: "img.twitter.com"
								}
							},
							{ text: "live",
								profile_image_url: {
									path: "/live_normal.jpg",
									scheme: "http",
									host: "img.twitter.com"
								}
							}
						]
					};
					newTweets = { 
						last_id: 10, 
						tweets: [
							{ text: "angular",
								profile_image_url: {
									path: "/mypick_normal.jpg",
									scheme: "http",
									host: "img.twitter.com"
								}
							},
							{ text: "rails",
								profile_image_url: {
									path: "/bye_normal.jpg",
									scheme: "http",
									host: "img.twitter.com"
								}
							},
							{ text: "node",
								profile_image_url: {
									path: "/live_normal.jpg",
									scheme: "http",
									host: "img.twitter.com"
								}
							}
						]
					};
					inputTweet = tweets.tweets[0];
					// build the expected tweet
					expectedURL = inputTweet.profile_image_url.scheme +
								'://'+ inputTweet.profile_image_url.host + 
								inputTweet.profile_image_url.path;
					expectedURL = expectedURL.replace(/_normal/,"_bigger");
					commonCon.getTweetStateData();
					twitterDeferred.resolve(tweets);
					$rootScope.$apply();
				});

				it("should call Tweet.state", function(){
					expect(mockTwitter.state).toHaveBeenCalled();
				});
				xit("should be able to getTweetStateData", function(){
				});

				describe("formatting the tweets", function(){
					var returnedTweets,
							retTweet,
							retURL;
					beforeEach(function(){
						returnedTweets = commonCon.getTweets();
						retTweet = returnedTweets[0];
						retURL = retTweet.profile_image_url.path;
					});
					it("should assemble the full profile image url", function(){
						expect(retURL).toEqual(expectedURL);
					});
					it("use the bigger profile photo", function(){
						expect(retURL).
							toContain("_bigger");
						expect(retURL).
							not.toContain("_normal");
					});
				});

				describe("Tweets Service API", function(){
					it("should be able to getTweets", function(){
						var storedTweets = commonCon.getTweets();
						expect(storedTweets.length).toBe(3);
						expect(storedTweets[0].text).toEqual("hi");
					});
					describe("should updateTweets", function(){
						var updatedTweets;
						beforeEach(function(){
							commonCon.updateTweets(newTweets);
							updatedTweets = commonCon.getTweets();
						});
						it("and return the correct # of tweets", function(){
							expect(updatedTweets.length).toBe(6);
						});
						it("and return the correct # of tweets", function(){
							expect(updatedTweets[0].text).toEqual("angular");
						});
					});
					describe("can setTweets", function(){
						var replacementTweets, storedTweets;
						beforeEach(function(){
							replacementTweets = [
									{ text: "back-end",
										profile_image_url: {
											path: "/mypick_normal.jpg",
											scheme: "http",
											host: "img.twitter.com"
										}
									},
									{ text: "front-end",
										profile_image_url: {
											path: "/live_normal.jpg",
											scheme: "http",
											host: "img.twitter.com"
										}
									}
							];
							commonCon.setTweets(replacementTweets);
						  storedTweets = commonCon.getTweets();
						});
						it("should set the correct tweets", function(){
							expect(storedTweets.length).toBe(2);
							expect(storedTweets[0].text).toEqual("back-end");
							expect(storedTweets[1].text).toEqual("front-end");
						});
					});
				});
			});
		});

		/*************** VOTES **************/

		describe("Votes", function(){
			var votes;
			beforeEach(function(){
				spyOn(commonCon, "getMoney");
				spyOn(commonCon, "formatVotes").andCallThrough();
				//spyOn(mockTimes, "memberVotes").andCallThrough();

				commonCon.setCurrentState("FL");
				commonCon.genStateCons();
				var sunCons = commonCon.getSunCons();
				var con = sunCons[0];
				commonCon.setCurrentCon(con);
				votes = { results: [
					{ votes: [{
							democratic: {
								yes: 30,
								no: 20,
								not_voting: 2,
								present: 1
							},
							republican: {
								yes: 0,
								no: 44,
								not_voting: 2,
								present: 1
							},
							id: "1",
							time: "19:44:22",
							date: "2014-06-16"
						}]
					}
				]};
				//var voteBefore = votes[0];
				timesDeferred.resolve(votes);
				$rootScope.$apply();
			});

			it("should call NYTimes memberVotes", function(){
				expect(mockTimes.memberVotes).toHaveBeenCalled();
			});
			it("getMemberVotes", function(){
				var votes = commonCon.getMemberVotes();
				expect(votes).toBeDefined();
			});
			it("should call NYTimes memberVotes", function(){
				expect(mockTimes.memberVotes).toHaveBeenCalled();
			});
			it("getMemberVotes should get the correct votes", function(){
				var retVotes = commonCon.getMemberVotes();
				var votesBefore = votes.results[0].votes; 
				expect(votesBefore).toEqual(retVotes);
			});
			describe("formatting votes", function(){
				it("should call formatVotes", function(){
					expect(commonCon.formatVotes).toHaveBeenCalled();
				});
				it("should add party percentages", function(){
					var votesAfter = commonCon.getMemberVotes();
					var voteAfter = votesAfter[0];
					var expDemPer = "" + Math.round(100*30/(30+20+2+1)) + "%";
					var expRepPer = "" + Math.round(100*0/(44+0+2+1)) + "%";
					expect(voteAfter.democratic.percent).toEqual(expDemPer);
					expect(voteAfter.republican.percent).toEqual(expRepPer);
				});
			});

		});

		/************* MONEY **************/

		describe("getMoney", function(){
			beforeEach(function(){
				spyOn(mockInfluencer, "contributors").andCallThrough();
				spyOn(mockInfluencer, "sectors").andCallThrough();
				spyOn(mockInfluencer, "typeBreakdown").andCallThrough();
				spyOn(commonCon, "fetchMemberVotes");

				promises = [];
				idLookupDeferreds = [];
				commonCon.setCurrentState("FL");
				commonCon.genStateCons();
				var sunCons = commonCon.getSunCons();
				var con = sunCons[0];
				idLookupDeferreds.forEach(function(idDef, index){
					idDef.resolve([{ id: "810" }]);
				});
				$rootScope.$apply();
			});
			it("true should be true", function(){
				expect(true).toBe(true);
			});
			describe("contributors", function(){
				var storedContrib;
				beforeEach(function(){
					var contributors = [{ name: "Money Bags" }, { name: "Scrooge" }];
					contributorsDeferred.resolve(contributors);
					$rootScope.$apply();
				});
				it("should be called", function(){
					expect(mockInfluencer.contributors).toHaveBeenCalled();
				});
				it("should be able to be retrieved", function(){
					var storedContrib = commonCon.getConContributors();
					expect(storedContrib).toBeDefined();
					expect(storedContrib).not.toBe(null);
				});
			});
			describe("sectors", function(){
				var storedSectors;
				beforeEach(function(){
					var sectors = [{ sector: "A" },{ sector: "D" }];
					sectorsDeferred.resolve(sectors);
					$rootScope.$apply();
					storedSectors = commonCon.getConSectors();
				});
				it("should be called", function(){
					expect(mockInfluencer.sectors).toHaveBeenCalled();
				});
				it("should be able to be retrieved", function(){
					expect(storedSectors).toBeDefined();
					expect(storedSectors).not.toBe(null);
				});
				it("should correct add the sector name", function(){
					expect(storedSectors[0].name).toEqual("Agribusiness");
					expect(storedSectors[1].name).toEqual("Defense");
				});
			});
			describe("type", function(){
				beforeEach(function(){
					var type = [{ typeStuff: "value" }];
					typeDeferred.resolve(type);
					$rootScope.$apply();
				});
				it("should be called", function(){
					expect(mockInfluencer.typeBreakdown).toHaveBeenCalled();
				});
				it("should be able to be retrieved", function(){
					var storedType = commonCon.getType();
					expect(storedType).toBeDefined();
					expect(storedType).not.toBe(null);
				});
			});
		});

		describe("currentChamber", function(){
			it("should default to the senate", function(){
				expect(commonCon.getCurrentChamber()).toBe("senate");
			});
			it("should be settable", function(){
				commonCon.setChamber("house");
				expect(commonCon.getCurrentChamber()).toBe("house");
			});
		});
		describe("setting and getting currentState", function(){
			it("should default to null", function(){
				expect(commonCon.getCurrentState()).toBe(null);
			});
			it("should be settable", function(){
				commonCon.setCurrentState("CA");
				expect(commonCon.getCurrentState()).toBe("CA");
			});
		});
		describe("states array", function(){
			it("should have at least 50 states", function(){
				expect(commonCon.states.length).toBeGreaterThan(49);
			});
		});

	});
});
