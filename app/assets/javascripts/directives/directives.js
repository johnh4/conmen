app.directive('viewBar', function(){
	return {
		restrict: 'E',
		templateUrl: '../templates/directives/view-bar.html'
	}
})
.directive('tweets',function(){
	return {
		restrict: 'E',
		templateUrl: '../templates/directives/tweets.html'
	}
})
.directive('votes',function(){
	return {
		restrict: 'E',
		templateUrl: '../templates/directives/votes.html'
	}
})
.directive('conDetails',function(){
	return {
		restrict: 'E',
		templateUrl: '../templates/directives/con-details.html'
	}
})
.directive('conImages',function(){
	return {
		restrict: 'E',
		templateUrl: '../templates/directives/con-images.html'
	}
});
