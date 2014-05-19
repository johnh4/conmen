app.factory('GovTrack', ['$http','$q','$rootScope','$timeout',
	function($http,$q,$rootScope,$timeout){

		var congress = {};
		congress.allCong = function(){
			var deferred = $q.defer();
			var promise = deferred.promise;
			$http.get('https://www.govtrack.us/api/v2/role?current=true')
				.success(function(data){
					congress = data;	
					console.log('data', data);
					$timeout(function(){
						$rootScope.$apply(function(){
							deferred.resolve(data);
							console.log('deferred.promise', deferred.promise);
						});
					});
				})
				.error(function(){
					console.log('allCong api access error.');
				});
			return promise;
		};

		return congress;
	}
]);
