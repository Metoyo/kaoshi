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
        $rootScope.pageName = "新用户注册";//页面名称
        //$scope.cssPath = "renzheng";//调用dagang.css
        $rootScope.styles = [
          'styles/renzheng.css'
        ];
        $rootScope.dashboard_shown = false;

        $scope.personalInfo = {
          yonghuming: '',
          mima: '',
          confirmPassword: '',
          youxiang: '',
          xingming: '',
          shouji: ''
        };

        $scope.validatePersonalInfo = function() {

        };
    }]);
});
