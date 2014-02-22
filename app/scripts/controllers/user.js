define(['angular'], function (angular) {
  'use strict';

  angular.module('kaoshiApp.controllers.UserCtrl', [])
    .controller('UserCtrl', function ($rootScope, $scope) {
      $rootScope.pageName = "认证";//页面名称
      $rootScope.styles = [
        'styles/renzheng.css'
      ];
      $rootScope.dashboard_shown = false;
      $scope.addedContainerClass = 'userBox';
    });
});
