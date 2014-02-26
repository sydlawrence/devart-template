'use strict';

angular.module('LocalStorageModule').value('prefix', 'standingnovation');

// Declare app level module which depends on filters, and services
angular.module('standingNovation', [
  'ngRoute',
  'angularFileUpload',
  'standingNovation.filters',
  'standingNovation.services',
  'standingNovation.directives',
  'standingNovation.controllers',
  'LocalStorageModule',
  'relativeDate'
]).
config(['$routeProvider',function($routeProvider) {

  $routeProvider.when('/default', {templateUrl: 'partials/main.html', controller: 'MainCtrl'});
  $routeProvider.otherwise({redirectTo: '/default'});

}]).run(["$rootScope","$timeout","$http",function($rootScope, $timeout, $http){


}]);
