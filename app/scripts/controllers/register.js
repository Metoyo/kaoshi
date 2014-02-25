define([
  'jquery',
  'underscore',
  'angular',
  'config',
  'services/urlredirect'
], function ($, _, angular, config, UrlredirectService) {
  'use strict';

  angular.module('kaoshiApp.controllers.RegisterCtrl', [])
    .controller('RegisterCtrl', ['$rootScope', '$scope', '$http', '$q', 'urlRedirect',
      function ($rootScope, $scope, $http, $q, urlRedirect) {
        var apiUrlLy = config.apiurl_rz + 'lingYu?token=' + config.token + '&leibieid=1', //lingYu 学科领域的api
            apiUrlJglb = config.apiurl_rz + 'jiGou_LeiBie?token=' + config.token, //jiGouLeiBie 机构类别的api
            apiUrlJueSe = config.apiurl_rz + 'jueSe?token=' + config.token,
           jiGou_LeiBieUrl = config.apiurl_rz + 'jiGou?token=' + config.token + '&leibieid='; //jueSe 查询科目权限的数据的api

        $rootScope.pageName = "新用户注册";//页面名称
        //$scope.cssPath = "renzheng";//调用dagang.css
        $rootScope.styles = [
          'styles/renzheng.css'
        ];
        $rootScope.dashboard_shown = false;

        $scope.jigoulb_list = [];
        $scope.lingyu_list = [];

        $http.get(apiUrlJglb).success(function(data) {
          console.log('apiURLJglb:::');
          console.log(data);
          $scope.jigoulb_list = data;
        });

        $http.get(apiUrlLy).success(function(data) {
          console.log('apiUrlLy:::');
          console.log(data);
          $scope.lingyu_list = data;
        });

        $scope.personalInfo = {
          yonghuming: '',
          mima: '',
          confirmPassword: '',
          youxiang: '',
          xingming: '',
          shouji: ''
        };

        $scope.selectJiGou = function(jgLeiBieId) {
          $http.get(jiGou_LeiBieUrl + jgLeiBieId).success(function(data) {
            console.log(data);
          });
        };


    }]);
});
