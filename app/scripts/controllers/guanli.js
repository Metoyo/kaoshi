define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc function
   * @name kaoshiApp.controller:GuanLiCtrl
   * @description
   * # GuanLiCtrl
   * Controller of the kaoshiApp
   */
  angular.module('kaoshiApp.controllers.GuanLiCtrl', [])
    .controller('GuanLiCtrl', function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    });
});
