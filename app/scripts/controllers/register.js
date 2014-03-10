define([
  'jquery',
  'underscore',
  'angular',
  'config',
  'services/urlredirect',
  'directives/passwordverify'
], function ($, _, angular, config, UrlredirectService, passwordVerify) {
  'use strict';

  angular.module('kaoshiApp.controllers.RegisterCtrl', [])
    .controller('RegisterCtrl', ['$rootScope', '$scope', '$http', '$q', 'urlRedirect',
      function ($rootScope, $scope, $http, $q, urlRedirect) {
        var apiUrlLy = config.apiurl_rz + 'lingYu?token=' + config.token + '&leibieid=1', //lingYu 学科领域的api
            apiUrlJglb = config.apiurl_rz + 'jiGou_LeiBie?token=' + config.token, //jiGouLeiBie 机构类别的api
            apiUrlJueSe = config.apiurl_rz + 'jueSe?token=' + config.token,
           jiGou_LeiBieUrl = config.apiurl_rz + 'jiGou?token=' + config.token + '&leibieid='; //jueSe 查询科目权限的数据的api

        $rootScope.pageName = "新用户注册";//页面名称
        $rootScope.styles = [
          'styles/renzheng.css'
        ];
        $rootScope.dashboard_shown = false;
        $scope.phoneRegexp = /^[1][3458][0-9]{9}$/; //验证手机的正则表达式
        $scope.emailRegexp = /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9]\.[a-z\.]{1,}[a-z]$/; //验证邮箱的正则表达式
        $scope.userNameRegexp = /^.{4,30}$/;//用户名的正则表达式
        $scope.passwordRegexp = /^.{6,20}$/;//密码的正则表达式

        $scope.jigoulb_list = [];
        $scope.lingyu_list = [];

        $http.get(apiUrlJglb).success(function(data) {
          $scope.jigoulb_list = data;
        });

        $http.get(apiUrlLy).success(function(data) {
          $scope.lingyu_list = data;
        });

        $scope.personalInfo = {
          yonghuming: '',
          mima: '',
          youxiang: '',
          xingming: '',
          shouji: ''
        };

        $scope.validatePersonalInfo = function(){
          $('.tab-pane').removeClass('active');
          $('.tab-pane').eq(1).addClass('active');
        };

        $scope.selectJiGou = function(jgLeiBieId) {
          $http.get(jiGou_LeiBieUrl + jgLeiBieId).success(function(data) {
            console.log(data);
          });
        };


    }]);
});
