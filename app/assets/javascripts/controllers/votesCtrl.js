app.controller('VotesCtrl',['$scope','CommonCon','NYTimes',
	function($scope,CommonCon,NYTimes){

		var setChamber = CommonCon.setChamber;
		var getCurrentChamber = CommonCon.getCurrentChamber;

		$scope.states = CommonCon.states;
		$scope.onlySetCurrentCon = CommonCon.onlySetCurrentCon;
		$scope.getMemberVotes = CommonCon.getMemberVotes;
		$scope.fetchMemberVotes = CommonCon.fetchMemberVotes;

		var formatVotes = CommonCon.formatVotes;
		var getCurrentCon = CommonCon.getCurrentCon;
		var getStateCongs = CommonCon.genStateCons;
		var setCurrentState = CommonCon.setCurrentState;

		$scope.voteView = 'individual';
		/************ APIs ***************/

		// get vote data for the specified chamber
		$scope.getVotes = function(chamber){
			setChamber(chamber);
			// get recent vote data from the nytimes api
			NYTimes.votes({ chamber: getCurrentChamber() }).$promise.then(function(data){
				console.log('nyt vote data', data);
				formatVotes(data.results.votes);
				$scope.votes = data.results.votes;
			});
		}
		
		/********* VIEW ACTIONS **********/

		$scope.selState = function(){
			CommonCon.setCurrentState($scope.currentState);
			getStateCongs();
			//CommonCon.genStateCons();
		}

		$scope.selConFromState = function(){
			$scope.onlySetCurrentCon($scope.currentCon);
			$scope.fetchMemberVotes();
		}

		$scope.votesFromAll = function(){
			$scope.onlySetCurrentCon($scope.currentCon);
			getStateCongs();
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
}]);
