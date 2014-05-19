app.controller('MainCtrl', ['$scope', 'GovTrack',
	function($scope,GovTrack){
		$scope.allCong = GovTrack.allCong();
		$scope.test = 'scope test';					
	}
]);
