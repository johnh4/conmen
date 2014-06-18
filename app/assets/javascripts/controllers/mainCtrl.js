app.controller('MainCtrl', 
	['$scope','GovTrack','Tweets','Sunlight','NYTimes','Influencer','CommonCon',
	 '$location','$anchorScroll','$timeout',
	function($scope,GovTrack,Tweets,Sunlight,NYTimes,Influencer,CommonCon,
	$location, $anchorScroll,$timeout){
		var useState = false;
		var intervals = [];
		var lastTweetId;
		$scope.showPhone = false;
		$scope.currentView = "tweets";

		/**************** COMMON ******************/

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
		//$scope.currentCon = CommonCon.currentCon;

		$scope.states = CommonCon.states;


		/**************** VIEWS ****************/

		$scope.setCurrentView = function(view){
			console.log('in setCurrentView');
			$scope.currentView = view;
			console.log('$scope.currentView', $scope.currentView);
		}
		$scope.viewSelected = function(view){
			return $scope.currentView == view;
		}
		$scope.togglePhone = function(){
			$scope.showPhone = !$scope.showPhone;
		}
		$scope.noConSelected = function(){
			var con = $scope.getCurrentCon();
			return Object.keys(con).length === 0;
		}
		$scope.noStateSelected = function(){
			state = $scope.getCurrentState();
			return state === null;
		}

		$scope.test = 'scope test';					

		/*
		$scope.$on('$locationChangeStart', function(ev) {
			ev.preventDefault();
		});
		*/

		$scope.scrollToSection = function(section){
			var old = $location.hash();
			//reset to old to keep any additional routing logic from kicking in
			if(section === "votes-sect"){
				$scope.setCurrentView('votes');
			} else if(section === "contributions-sect"){
				$scope.setCurrentView('money');
			}
			$timeout(function(){
				$location.hash(section);
				$anchorScroll();
				$location.hash(old);
			},100);
		}
	}
]);
