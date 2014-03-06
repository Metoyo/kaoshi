define(['jquery', 'angular'], function ($, angular) {
  'use strict';

  angular.module('kaoshiApp.controllers.NavCtrl', [])
    .controller('NavCtrl', function ($rootScope, $scope, $location) {
      $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1);
        return page === currentRoute ? 'active' : '';
      };
    });
});