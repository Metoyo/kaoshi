define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.NavCtrl', [])
    .controller('NavCtrl', ['$rootScope', '$scope', '$location', '$http',
      function ($rootScope, $scope, $location, $http) {

      /**
       * 定义变量//
       */
      var baseRzAPIUrl = config.apiurl_rz, //renzheng的api
        token = config.token,
        alterYongHu = baseRzAPIUrl + 'xiugai_yonghu';

      $scope.userInfoLayer = false;
      $scope.navData = {
        newPsd: ''
      };

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
        var user = {},
          jueseDist,
          yhxxxxApiUrl = baseRzAPIUrl + 'yonghu_xiangxi_xinxi?token=' + token + '&yonghuid=' +
            $rootScope.session.info.UID; //通过UID查询用户详细的url

        $http.get(yhxxxxApiUrl).success(function(data){
          if(data.JIGOU.length){
            user.LINGYU = [];
            jueseDist = _.groupBy(data.JUESE, function(js){ return js.LINGYUMINGCHENG; });
            _.each(data.LINGYU, function(ly){
              var jsName = _.map(jueseDist[ly.LINGYUMINGCHENG], function(js){ return js.JUESEMINGCHENG; }),
                lyObj = {
                  LINGYUMINGCHENG: '',
                  jueseStr: ''
                };
              lyObj.LINGYUMINGCHENG = ly.LINGYUMINGCHENG;
              lyObj.jueseStr = jsName.join();
              user.LINGYU.push(lyObj);
            });
            user.YONGHUMING = data.YONGHUMING;
            user.XINGMING = data.YONGHUXINXI[0].XINGMING;
            user.YOUXIANG = data.YOUXIANG;
            user.SHOUJI = data.SHOUJI;
            user.JIGOUMINGCHENG = data.JIGOU[0].JIGOUMINGCHENG;
            user.SHOUJI = data.SHOUJI;
            $('.modifuMiMaInfo').html('');
            $scope.usr = user;
            $scope.userInfoLayer = true;
          }
        });
      };

      /**
       * 关闭个人详情页
       */
      $rootScope.closeUserInfoLayer = function(){
        $scope.userInfoLayer = false;
      };

      /**
       * 修改密码
       */
      $scope.modifyPassWord = function(){
        var newPsdData = {
          token: token,
          yonghuid: '',
          mima: ''
        },
        userInfo = $rootScope.session.userInfo;
        newPsdData.yonghuid = userInfo.UID;
        newPsdData.mima = $scope.navData.newPsd;
        $('.modifuMiMaInfo').html('');
        $http.post(alterYongHu, newPsdData).success(function(data){
          if(data.result){
            $('.modifuMiMaInfo').html('密码修改成功!').fadeOut(5000);
          }
          else{
            $('.modifuMiMaInfo').html(data.error).fadeOut(5000);
          }
        });
      };

    }]);
});