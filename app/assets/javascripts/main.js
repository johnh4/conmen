var app = angular.module('ConMen', ['ngRoute','ngResource','angularMoment','ngSanitize']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: '../templates/main.html',
		controller: 'MainCtrl'
	})
	.when('/congress/:id', {
		templateUrl: '../templates/show.html',
		controller: 'ConCtrl'
	});
}]);
