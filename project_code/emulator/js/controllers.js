'use strict';

/* Controllers */

angular.module('standingNovation.controllers', ['LocalStorageModule'])
  .controller('MainCtrl', ['$scope', 'Grid',function(scope, Grid) {

    var grid = new Grid();

    grid.light("red_high");

    window.grid = grid;

    scope.launchpads = grid.launchpads;

    scope.beginTest = function() {
        window.beginTest();
    }
    scope.finishTest = function(){
        window.finishTest();
    }
  }]);
