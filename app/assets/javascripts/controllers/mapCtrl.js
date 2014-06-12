app.controller('MapCtrl',['$scope','CommonCon','Tweets',
	function($scope,CommonCon,Tweets){

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
		var getCurrentState = CommonCon.getCurrentState;

		var getTweetStateData = CommonCon.getTweetStateData;
		var clearIntervals = CommonCon.clearIntervals;
		var addInterval = CommonCon.addInterval;
		var formatTweets = CommonCon.formatTweets;
		$scope.getTweetHL = CommonCon.getTweetHL;
		var setTweetHL = CommonCon.setTweetHL;
		
		$scope.getTweets = CommonCon.getTweets;

		$scope.$watch('$viewContentLoaded', function() {
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
					setCurrentState(code.substring(3));
					console.log('getCurrentState()', getCurrentState());
					var stateCongTwitterIDs = getStateCongs();
					console.log('stateCongTwitterIDs', stateCongTwitterIDs);
					setTweetHL("Tweets from Members of Congress Representing "
												 + getCurrentState());
					// make request for tweet state data
					getTweetStateData(stateCongTwitterIDs);
				}
			});
    });
}]);
