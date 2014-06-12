app.controller('MoneyCtrl',['$scope','CommonCon',
	function($scope,CommonCon){

		$scope.contribTab = 'total';

		/******** DATA *********/

		$scope.conContributors = CommonCon.getConContributors;
		$scope.conSectors = CommonCon.getConSectors;
		$scope.type = CommonCon.getType;

		$scope.getMoney = CommonCon.getMoney;

		/******** VIEW ACTIONS ********/

		$scope.changeState = function(){
			console.log('changing state to', $scope.currentState);
			CommonCon.setCurrentState($scope.currentState);
			$scope.getStateCongs();
		}

		$scope.conFromAll = function(){
			console.log('in conFromAll');
			$scope.onlySetCurrentCon($scope.currentCon);
			CommonCon.setCurrentState($scope.currentCon.state);
			console.log('CommonCon.getCurrentCon() in ctrl conFromAll',
									 CommonCon.getCurrentCon());
			$scope.getStateCongs();
		}

		$scope.conFromStateSel = function(){
			console.log('in conFromStateSel in ctrl');
			$scope.onlySetCurrentCon($scope.currentCon);
			console.log('CommonCon.getCurrentCon() in ctrl conFromStateSel',
									 CommonCon.getCurrentCon());
			$scope.getMoney();
		}

		/******** UI *********/

		$scope.contribTabSelected = function(tab){
		  return $scope.contribTab === tab;
		}

		$scope.setContribTab = function(tab){
			$scope.contribTab = tab;
			console.log('$scope.contribTab', $scope.contribTab);
		}

		/******** CONSTANTS ********/

		$scope.states = CommonCon.states;
}]);
