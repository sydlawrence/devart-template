module.exports = function(config) {
  'use strict';

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      '*.coffee',
      'test/spec/*.coffee'
    ],
    exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
