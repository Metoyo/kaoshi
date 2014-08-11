define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';
  angular.module('kaoshiApp.controllers.TongjiCtrl', [])
    .controller('TongjiCtrl', ['$rootScope', '$scope', '$http',
      function ($rootScope, $scope, $http) {
        /**
         * 操作title
         */
        $rootScope.pageName = "统计";
        $rootScope.dashboard_shown = true;
        $rootScope.isRenZheng = false; //判读页面是不是认证

        /**
         * 声明变量
         */
        var userInfo = $rootScope.session.userInfo,
          baseMtAPIUrl = config.apiurl_mt, //mingti的api
          baseRzAPIUrl = config.apiurl_rz, //renzheng的api
          token = config.token,
          caozuoyuan = userInfo.UID,//登录的用户的UID
          jigouid = userInfo.JIGOU[0].JIGOU_ID,
          lingyuid = $rootScope.session.defaultLyId;

        $scope.showKaoShiTjList = function(){
          alert('hello！');
        }
    }]);
});
