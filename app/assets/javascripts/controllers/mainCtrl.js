app.controller('MainCtrl', ['$scope', 'GovTrack', 'Tweets',
	function($scope,GovTrack,Tweets){
		
		//get congress obj from govtrack
		GovTrack.get(function(pols){
				console.log('pols', pols);	
				$scope.congress = pols.objects;

				//get their names from the returned obj
				var names = pols.objects.map(function(pol){
					return pol.person.name;
				});
				$scope.allNames = names;

				//get the twitter ids from the returned obj
				var twitterIds = [];
				pols.objects.forEach(function(pol){
					var tID = pol.person.twitterid;
					if(tID != null) twitterIds.push(tID);
				});
				$scope.twitIds = twitterIds;
				console.log('$scope.twitIds', $scope.twitIds);

				var twits = {};
				twits.ids = twitterIds;
				twits = JSON.stringify(twits);
				Tweets.get({}, function(data){
					console.log('data', data);	
				});
		});
		$scope.test = 'scope test';					

	}
]);
