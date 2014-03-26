define(['jquery', 'angular'], function ($, angular) {
  'use strict';

  angular.module('kaoshiApp.controllers.NavCtrl', [])
    .controller('NavCtrl', function ($rootScope, $scope, $location) {
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
        }
      };

    });
});