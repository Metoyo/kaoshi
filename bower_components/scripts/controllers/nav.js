define(['../../jquery/jquery', 'underscore', 'angular'], function ($, _, angular) {
  'use strict';

  angular.module('kaoshiApp.controllers.NavCtrl', [])
    .controller('NavCtrl', function ($rootScope, $scope, $location) {

      /**
       * 定义变量
       */
      $scope.userInfoLayer = false;

      /**
       * 控制导航的代码
       */
      $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1);
        return page === currentRoute ? 'active' : '';
      };

      /**
       * dashboard的显示和隐藏
       */
      $scope.dsfoldBtn = function (page) {
        var dashboard = angular.element('.dashboard'),
          main = angular.element('.main'),
          dashboardWith = dashboard.width(),
          foldBtn = angular.element('.dsfoldBtn'),
          hideIcon = angular.element('.userInfo,.nav-icon');
        if(dashboardWith == 120){
          hideIcon.hide();
          foldBtn.css('background-position-y','-20px');
          dashboard.animate({
            width: '20px'
          }, 500, function() {

          });
          $('.fixed-top').animate({
            left: '461px'
          }, 500, function() {

          });
          main.animate({
            'padding-left': '20px'
          }, 500, function() {

          });
        }
        else{
          foldBtn.css('background-position-y','5px');
          main.animate({
            'padding-left': '120px'
          }, 500, function() {

          });
          dashboard.animate({
            width: '120px'
          }, 500, function() {
            hideIcon.show();
          });
          $('.fixed-top').animate({
            left: '561px'
          }, 500, function() {

          });
        }
      };

      /**
       * 显示个人详情
       */
      $rootScope.showUserInfo = function(){
        var user = $rootScope.session.userInfo;
        _.each(user.LINGYU, function(ly, index, list){
          ly.jueseArr = [];
          _.each(user.JUESE, function(js, idx, lst){
            if(js.LINGYU_ID == ly.LINGYU_ID){
              ly.jueseArr.push(js.JUESEMINGCHENG);
            }
          });
        });
        $scope.usr = user;
        $scope.userInfoLayer = true;
      };

      /**
       * 关闭个人详情页
       */
      $rootScope.closeUserInfoLayer = function(){
        $scope.userInfoLayer = false;
      };

    });
});