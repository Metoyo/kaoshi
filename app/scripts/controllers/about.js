define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name kaoshiApp.controller:AboutCtrl
   * @description
   * # AboutCtrl
   * Controller of the kaoshiApp
   */
  angular.module('kaoshiApp.controllers.AboutCtrl', [])
    .controller('AboutCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });
});
