define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name kaoshiApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the kaoshiApp
   */
  angular.module('kaoshiApp.controllers.MainCtrl', [])
    .controller('MainCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });
});
