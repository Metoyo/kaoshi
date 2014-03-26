define([
  'jquery',
  'underscore',
  'angular',
  'config',
  'services/urlredirect'
], function ($, _, angular, config, UrlredirectService) {
  'use strict';

  angular.module('kaoshiApp.controllers.LogoutCtrl', [])
    .controller('LogoutCtrl', ['$rootScope', '$scope', '$location', '$http', 'urlRedirect',
      function ($rootScope, $scope, $location, $http, urlRedirect) {
        setTimeout(function() {
          delete $rootScope.session;
          urlRedirect.goTo($location.$$path, '/renzheng');
        }, 500);
    }]);
});
