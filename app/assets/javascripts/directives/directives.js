app.directive('viewBar', function(){
	return {
		restrict: 'E',
		templateUrl: '../templates/directives/view-bar.html'
	}
})
.directive('tweets',function(){
	return {
		restrict: 'E',
		controller: 'TweetsCtrl',
		templateUrl: '../templates/directives/tweets.html'
	}
})
.directive('votes',function(){
	return {
		restrict: 'E',
		controller: 'VotesCtrl',
		templateUrl: '../templates/directives/votes.html'
	}
})
.directive('money',function(){
	return {
		restrict: 'E',
		controller: 'MoneyCtrl',
		templateUrl: '../templates/directives/money.html'
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
})
.directive('votesIndividual',function(){
	return {
		restrict: 'E',
		templateUrl: '../templates/directives/votes-individual.html'
	}
})
.directive('votesCongress',function(){
	return {
		restrict: 'E',
		templateUrl: '../templates/directives/votes-congress.html'
	}
})
.directive('directions',function(){
	return {
		restrict: 'E',
		templateUrl: '../templates/directives/directions.html'
	}
});
