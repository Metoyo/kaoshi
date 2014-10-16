define([
  'jquery',
  'underscore',
  'angular'
], function ($, _, angular) {
  'use strict';

  angular.module('kaoshiApp.controllers.LogoutCtrl', [])
    .controller('LogoutCtrl', ['$rootScope', '$location', 'urlRedirect', '$cookieStore',
      function ($rootScope, $location, urlRedirect, $cookieStore) {
        setTimeout(function () {
          delete $rootScope.session;
          $cookieStore.remove('logged');
          $cookieStore.remove('lingyuCk');
          $cookieStore.remove('lastUrl');
          urlRedirect.goTo($location.$$path, '/renzheng');
        }, 500);
      }]);
});
