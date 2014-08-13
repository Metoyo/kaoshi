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

        /**
         * 显示考试统计列表
         */
        $scope.showKaoShiTjList = function(){
          $scope.isTjDetailShow = false;
          $scope.tjSubTpl = 'views/partials/tj_ks.html';
        };

        /**
         * 显示试卷统计列表
         */
        $scope.showShiJuanTjList = function(){
          $scope.isTjDetailShow = false;
          $scope.tjSubTpl = 'views/partials/tj_sj.html';
        };

        /**
         * 初始化运行的程序//
         */
        $scope.showKaoShiTjList();

        /**
         * 考试统计详情
         */
        $scope.showKsTjDetail = function(){
          $scope.tjItemName = '考试统计';
          $scope.isTjDetailShow = true;
          $scope.tjSubTpl = 'views/partials/tj_ks_detail.html';
        };

        /**
         * 试卷统计详情
         */
        $scope.showSjTjDetail = function(){
          $scope.tjItemName = '试卷统计';
          $scope.isTjDetailShow = true;
          $scope.tjSubTpl = 'views/partials/tj_sj_detail.html';
        };

        /**
         * 由统计详情返回列表
         */
        $scope.tjDetailToList = function(){
          if($scope.tjItemName == '考试统计'){
            $scope.showKaoShiTjList();
          }
          else{
            $scope.showShiJuanTjList();
          }
        }

    }]);
});
