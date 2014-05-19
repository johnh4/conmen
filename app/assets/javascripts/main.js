
var app = angular.module('ConMen', ['ngRoute','ngResource']);


app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: '../assets/main.html',
		controller: 'MainCtrl'
	});
}]);
