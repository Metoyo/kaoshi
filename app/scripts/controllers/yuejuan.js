define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {// 001
  'use strict';

  angular.module('kaoshiApp.controllers.YuejuanCtrl', [])
    .controller('YuejuanCtrl', ['$rootScope', '$scope', '$location', '$http', 'urlRedirect', '$q',
      function ($rootScope, $scope, $location, $http, urlRedirect, $q) { // 002
        /**
         * 操作title
         */
        $rootScope.pageName = "阅卷"; //page title
        $rootScope.dashboard_shown = true;
        $rootScope.isRenZheng = false; //判读页面是不是认证

        /**
         * 声明变量
         */
        var userInfo = $rootScope.session.userInfo,
          baseMtAPIUrl = config.apiurl_mt, //mingti的api
          token = config.token,
          caozuoyuan = userInfo.UID,//登录的用户的UID
          jigouid = userInfo.JIGOU[0].JIGOU_ID,
          lingyuid = $rootScope.session.defaultLyId;

        /**
         * 初始化是DOM元素的隐藏和显示
         */
        $scope.letterArr = config.letterArr; //题支的序号
        $scope.cnNumArr = config.cnNumArr; //汉语的大学数字

    }]);// 002
}); // 001
