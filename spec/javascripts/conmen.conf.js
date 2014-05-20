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
      'app/assets/javascripts/main.js',
      'app/assets/javascripts/services/govTrack.js',
      'app/assets/javascripts/controllers/mainCtrl.js',
      'spec/javascripts/*_spec.js'
    ]  
  });
};
