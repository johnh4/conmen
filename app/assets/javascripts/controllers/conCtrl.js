app.controller('ConCtrl', ['$scope', 'GovTrack', 'Tweets', '$routeParams','Conserv',
	function($scope,GovTrack,Tweets,$routeParams,Conserv){
		$scope.govtrack_id = $routeParams.id;
		console.log('$scope.govtrack_id', $scope.govtrack_id);

		GovTrack.latestVotes({ person: $scope.govtrack_id }, function(data){
			console.log('data',data);
			$scope.votes = data.objects;
		});

		Conserv.get({ govtrackId: $scope.govtrack_id }, function(data){
			console.log('ideology data',data);
			$scope.ideology = data.description;

			Conserv.similar({ govtrackId: $scope.govtrack_id }, function(data){
				console.log('similar data',data);
				$scope.similar = data.conmen;
			});
		});
	}
]);
