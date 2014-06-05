app.factory('NYTimes', ['$http', '$resource',
	function($http, $resource){
		var	startDate = Date.today().add(-30).days().toString("yyyy-MM-dd"),
				endDate = Date.today().toString("yyyy-MM-dd");
		console.log('startDate', startDate);
		console.log('endDate', endDate);
		var url = 'http://api.nytimes.com/svc/politics/:version/us/legislative/congress/:chamber/votes/:startDate/:endDate.json?api-key=e7d192c3056e60e9f1f93bc79f5be35d:10:69455457';
		var nytResource = $resource(url,
				{
					version: 'v3'
				},  
				{ votes: {
						method: 'GET',
						params: { chamber: 'senate', 
											startDate: startDate,
											endDate: endDate },
						headers: { 'Content-Type': 'application/json' }
					}
				});
		return nytResource;
	}	
]);
