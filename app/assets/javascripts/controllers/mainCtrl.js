app.controller('MainCtrl', 
	['$scope','GovTrack','Tweets','Sunlight','NYTimes','Influencer','CommonCon',
	function($scope,GovTrack,Tweets,Sunlight,NYTimes,Influencer,CommonCon){
		var useState = false;
		var intervals = [];
		var lastTweetId;
		$scope.showPhone = false;
		$scope.currentView = "votes";

		/**************** COMMON ******************/

		$scope.getPres = CommonCon.getPres;

		$scope.setChamber = CommonCon.setChamber;

		$scope.getCurrentChamber = CommonCon.getCurrentChamber;

		$scope.getCurrentState = CommonCon.getCurrentState;

		$scope.setCurrentState = CommonCon.setCurrentState;

		$scope.sunCons = CommonCon.getSunCons;
		$scope.getStateCongs = CommonCon.genStateCons;

		$scope.stateSunCons = CommonCon.getStateSunCons;

		$scope.setCurrentCon = CommonCon.setCurrentCon;
		$scope.onlySetCurrentCon = CommonCon.onlySetCurrentCon;
		$scope.getCurrentCon = CommonCon.getCurrentCon;

		$scope.togglePhone = function(){
			$scope.showPhone = !$scope.showPhone;
		}

		/**************** VIEWS ****************/

		$scope.setCurrentView = function(view){
			console.log('in setCurrentView');
			$scope.currentView = view;
			console.log('$scope.currentView', $scope.currentView);
		}
		$scope.viewSelected = function(view){
			return $scope.currentView == view;
		}

		$scope.test = 'scope test';					
	}
]);
