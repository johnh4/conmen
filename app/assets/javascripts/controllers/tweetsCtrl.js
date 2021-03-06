app.controller('TweetsCtrl',['$scope','CommonCon','Tweets','$q','Sunlight',
	function($scope,CommonCon,Tweets,$q,Sunlight){

		var setChamber = CommonCon.setChamber;
		var getCurrentChamber = CommonCon.getCurrentChamber;

		$scope.getMemberVotes = CommonCon.getMemberVotes;
		$scope.fetchMemberVotes = CommonCon.fetchMemberVotes;

		var clearIntervals = CommonCon.clearIntervals;
		var addInterval = CommonCon.addInterval;
		var formatTweets = CommonCon.formatTweets;
		var updateTweets =CommonCon.updateTweets;
		var setTweets = CommonCon.setTweets;

		$scope.getTweetHL = CommonCon.getTweetHL;
		$scope.getTweets = CommonCon.getTweets;

		/************ APIs ***************/

		Tweets.get({}).$promise.then(function(data){
			formatTweets(data.tweets);
			setTweets(data.tweets);
			console.log('$scope.tweets', $scope.tweets);	

		  lastTweetId = data.last_id;
			console.log('lastTweetId initially set to', lastTweetId);
			console.log("that tweet's text was", data.tweets[0].text);

			clearIntervals();
			var newInterval = window.setInterval(function(){
				console.log('triggering refresh.');
				Tweets.refresh({lastId: lastTweetId}, function(new_data){
					updateTweets(new_data);
				});
			}, 30000);
			addInterval(newInterval);
		});

}]);
