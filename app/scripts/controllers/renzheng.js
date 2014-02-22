define(['jquery', 'angular'], function ($, angular) {
  'use strict';

  angular.module('kaoshiApp.controllers.RenzhengCtrl', [])
    .controller('RenzhengCtrl', function ($rootScope, $scope, $http) {
      $rootScope.pageName = "认证";//页面名称
      $scope.cssPath = "renzheng";//调用dagang.css
    });
});
