module.exports = function(config) {
  config.set({
    basePath: '../..',

    frameworks: ['jasmine'],

    autoWatch: true,

    files: [
      'app/assets/javascripts/angular/angular.js',
      'app/assets/javascripts/angular/angular-route.js',
      'app/assets/javascripts/angular/angular-resource.js',
      'app/assets/javascripts/angular/angular-mocks.js',
      'app/assets/javascripts/angular/angular-sanitize.js',
			'vendor/assets/javascripts/moment-with-langs.min.js',
			'vendor/assets/javascripts/angular-moment.min.js',
			'vendor/assets/javascripts/date.min.js',
      'app/assets/javascripts/main.js',
      'app/assets/javascripts/services/govTrack.js',
      'app/assets/javascripts/services/commonCon.js',
      'app/assets/javascripts/services/conserv.js',
      'app/assets/javascripts/services/influencer.js',
      'app/assets/javascripts/services/nyTimes.js',
      'app/assets/javascripts/services/sunlight.js',
      'app/assets/javascripts/services/tweetsFact.js',
      'app/assets/javascripts/controllers/mainCtrl.js',
      'app/assets/javascripts/controllers/conCtrl.js',
      'app/assets/javascripts/controllers/mapCtrl.js',
      'app/assets/javascripts/controllers/moneyCtrl.js',
      'app/assets/javascripts/controllers/tweetsCtrl.js',
      'app/assets/javascripts/controllers/votesCtrl.js',
      'app/assets/javascripts/directives/directives.js',
      'spec/javascripts/*_spec.js'
    ]  
  });
};
