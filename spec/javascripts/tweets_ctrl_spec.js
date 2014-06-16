describe("TweetsCtrl", function(){
	var tweetsCtrl, scope, mockTwitter, Sunlight;

	beforeEach(function(){
		function MockCommonCon(){
			this.formatTweets = function(){}
			this.setTweets = function(){}
			this.clearIntervals = function(){}
			this.addInterval = function(){}
			this.getTweets = function(){ 
				return [{ text: "hi" }, { text: "bye" }, { text: "later" }] 
			}
			this.getTweetHL = function() { return "Tweet HL" }
		}

		module("ConMen", function($provide){
			mockTwitter = {
				state: function() {
					twitterDeferred = $q.defer();
					return {$promise: twitterDeferred.promise};
				},
				get: function() {
					twitterGetDeferred = $q.defer();
					return {$promise: twitterGetDeferred.promise};
				}
			};
			spyOn(mockTwitter, "state").andCallThrough();
			spyOn(mockTwitter, "get").andCallThrough();
			$provide.value('CommonCon', new MockCommonCon);
			$provide.value('Tweets', mockTwitter);
		});
	});

	beforeEach(inject(function($controller, $rootScope,_$q_){
		scope = $rootScope.$new();
		$q = _$q_;
		tweetsCtrl = $controller("TweetsCtrl", { $scope: scope,
																				     $q: $q});
	}));

	describe("initial controller get", function(){
		var data = { 
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
		beforeEach(function(){
			twitterGetDeferred.resolve(data);
			scope.$apply();
		});
		it("should call Tweets.get", function(){
			expect(mockTwitter.get).toHaveBeenCalled();
		});
		xit("should not call Sunlight.all", function(){
			expect(Sunlight.all).not.toHaveBeenCalled();
		});
	});

	describe("CommonCon service interaction", function(){
		describe("getTweets", function(){
			it("should be able to getTweets", function(){
				var tweets = scope.getTweets();
				expect(tweets.length).toBe(3);
				expect(tweets[0].text).toEqual("hi");
			});
		});
		describe("getTweetHL", function(){
			it("should be able to access the TweetHL", function(){
				var tweetHL = scope.getTweetHL();
				expect(tweetHL).toEqual("Tweet HL");
			});
		});
	});

});
