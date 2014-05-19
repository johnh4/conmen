app.controller('MainCtrl', ['$scope', 'GovTrack',
	function($scope,GovTrack){
		getAllCong();
		function getAllCong(){
			GovTrack.allCong()
				.success(function(data){
					congress = data;	
					console.log('data', data);
					$scope.allCong = data;
				})
				.error(function(){
					console.log('allCong api access error.');
				});
		}
		$scope.test = 'scope test';					
	}
]);
