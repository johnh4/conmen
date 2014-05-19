app.controller('MainCtrl', ['$scope', 'GovTrack',
	function($scope,GovTrack){
		
		var polObjs = null;
		GovTrack.get(function(pols){
				console.log('pols', pols);	
				$scope.congress = pols.objects;
				var names = pols.objects.map(function(pol){
					return pol.person.name;
				});
				$scope.allNames = names;
		});
		$scope.test = 'scope test';					

	}
]);
