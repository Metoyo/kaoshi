define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.UserCtrl', [])
    .controller('UserCtrl', function ($rootScope, $scope, $http) {
      var session = $rootScope.session,
          dshyhjsUrl = config.apiurl_rz + 'daishenhe_yonghu_juese?token='
                         + config.token + '&caozuoyuan=' + session.info.UID;
      $rootScope.pageName = "认证";//页面名称
      $rootScope.styles = [
        'styles/renzheng.css'
      ];
      $rootScope.dashboard_shown = false;
      $scope.addedContainerClass = 'userBox';

      $scope.shenheList = [];

      $scope.setPermissions = function() {
        $http.get(dshyhjsUrl).success(function(data) {
          $scope.shenheList = data;
        });
      };

    });
});
