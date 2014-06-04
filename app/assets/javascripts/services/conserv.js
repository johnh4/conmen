app.factory('Conserv', ['$http', '$resource',
	function($http, $resource){
		var url = '/conmen/:govtrackId/ideology';
		var conResource = $resource(url,{},  
				{ get: {
						method: 'GET',
						params: { govtrackId: '@govtrackId' },
						headers: {'Content-Type': 'application/json'}
					},
					similar: {
						url: '/conmen/:govtrackId/similar',
						method: 'GET',
						params: { govtrackId: '@govtrackId' },
						headers: {'Content-Type': 'application/json'}
					}
				}
		);
		return conResource;
	}	
]);
