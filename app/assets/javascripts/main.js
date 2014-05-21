
var app = angular.module('ConMen', ['ngRoute','ngResource']);


app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/',{
		templateUrl: '../templates/main.html',
		controller: 'MainCtrl'
	});
}]);
