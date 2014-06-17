describe("VotesCtrl", function(){
	var votesCtrl, scope, mockTwitter, votesDeferred, retVotes,
			MockCommonCon;

	beforeEach(function(){
		MockCommonCon = function() {
			this.formatTweets = function(){}
			this.setTweets = function(){}
			this.clearIntervals = function(){}
			this.addInterval = function(){}
			this.setChamber = function(){}
			this.getCurrentChamber = function(){ return "senate" }
			this.formatVotes = function(){}
			this.setCurrentState = function(state){}
			this.onlySetCurrentCon = function(){}
			retVotes = [
				{
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
				}
			];
			this.getMemberVotes = function(){ return retVotes }
			this.fetchMemberVotes = function(){ return retVotes }
			this.genStateCons = function(){ return [] }
		}

		CommonCon = {};
		CommonCon.formatTweets = jasmine.createSpy();
		CommonCon.setTweets = jasmine.createSpy();
		CommonCon.clearIntervals = jasmine.createSpy();
		CommonCon.addInterval = jasmine.createSpy();
		CommonCon.setChamber = jasmine.createSpy();
		CommonCon.getCurrentChamber = function(){ return "senate" }
		CommonCon.formatVotes = jasmine.createSpy();
		CommonCon.setCurrentState = jasmine.createSpy();
		CommonCon.onlySetCurrentCon = jasmine.createSpy();
		retVotes = [
			{
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
			}
		];
		CommonCon.getMemberVotes = function(){ return retVotes }
		CommonCon.fetchMemberVotes = function(){ return retVotes }
		CommonCon.genStateCons = jasmine.createSpy();

		module("ConMen", function($provide){
			mockTimes = {
				memberVotes: function() {
					timesDeferred = $q.defer();
					return {$promise: timesDeferred.promise};
				},
				votes: function() {
					votesDeferred = $q.defer();
					return {$promise: votesDeferred.promise};
				}
			};
			//$provide.value('CommonCon', new MockCommonCon);
			$provide.value('CommonCon', CommonCon);
			spyOn(mockTimes, 'memberVotes').andCallThrough();
			$provide.value('NYTimes', mockTimes);
		});
	});

	beforeEach(inject(function($controller, $rootScope,_$q_){
		scope = $rootScope.$new();
		$q = _$q_;
		votesCtrl = $controller("VotesCtrl", { $scope: scope,
																				     $q: $q});
	}));

	describe("getVotes", function(){
		var voteData;
		beforeEach(function(){
			voteData = { results: 
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
			};
			scope.getVotes();
			votesDeferred.resolve(voteData);
			scope.$apply();
		});
		it("gets the correct votes", function(){
			expect(scope.votes).toBeDefined();
			expect(scope.votes.length).toBe(1);
			expect(scope.votes[0].id).toBe('1');
		});
	});

	describe("CommonCon service interaction", function(){
		it("getMemberVotes should call CommonCon getMemberVotes", function(){
			var memberVotes = scope.getMemberVotes();
			expect(memberVotes).toEqual(retVotes);
		});
		it("fetchMemberVotes should access memberVotes", function(){
			var memberVotes = scope.fetchMemberVotes();
			expect(memberVotes).toEqual(retVotes);
		});
	});

	describe("View actions", function(){
		describe("voteView", function(){
			it("voteView defaults to 'individual'", function(){
				expect(scope.voteView).toBe("individual");
			});
			it("setVoteView sets voteView to congress with house view", 
				function(){
					scope.setVoteView('house');
					expect(scope.voteView).toBe("congress");
				}
			);
			it("setVoteView sets voteView to congress with senate view", 
				function(){
					scope.setVoteView('senate');
					expect(scope.voteView).toBe("congress");
				}
			);
			it("setVoteView sets voteView to individual with individual view", 
				function(){
					scope.setVoteView('individual');
					expect(scope.voteView).toBe("individual");
				}
			);
			it("voteViewSelected correctly matches when view is selected",
				function(){
					scope.setVoteView('individual');
					expect(scope.voteViewSelected('individual')).toBe(true);
				}
			);
		});
		it("selState retrieves the current state", function(){
			scope.selState();
			expect(CommonCon.setCurrentState).toHaveBeenCalled();
			expect(CommonCon.genStateCons).toHaveBeenCalled();
		});
		it("selConFromState", function(){
			spyOn(scope, "fetchMemberVotes");
			scope.selConFromState();
			expect(scope.onlySetCurrentCon).toHaveBeenCalled();
			expect(scope.fetchMemberVotes).toHaveBeenCalled();
		});
		it("votesFromAll", function(){
			//spyOn(scope, "onlySetCurrentCon");
			scope.votesFromAll();
			expect(scope.onlySetCurrentCon).toHaveBeenCalled();
			expect(CommonCon.genStateCons).toHaveBeenCalled();
		});
	});

});
