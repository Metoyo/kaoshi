/*jshint unused: vars */
define([
    'jquery',
    'angular',
    'directives/lazystyle',
    'controllers/main',
    'controllers/renzheng',
    'controllers/mingti',
    'controllers/dagang'
   ], function ($, angular, LazystyleDirective, MainCtrl, RenzhengCtrl, MingtiCtrl, DagangCtrl) {
  'use strict';

  return angular.module('kaoshiApp', ['kaoshiApp.controllers.MainCtrl',
'kaoshiApp.controllers.MingtiCtrl',
'kaoshiApp.controllers.DagangCtrl',
'kaoshiApp.controllers.RenzhengCtrl',
'kaoshiApp.directives.Lazystyle',
/*angJSDeps*/
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          //templateUrl: 'views/main.html',
          //controller: 'MainCtrl'
          redirectTo: '/renzheng'
        })
        .when('/mingti', {
          templateUrl: 'views/mingti.html',
          controller: 'MingtiCtrl'
        })
        .when('/dagang', {
          templateUrl: 'views/dagang.html',
          controller: 'DagangCtrl'
        })
        .when('/renzheng', {
          templateUrl: 'views/renzheng.html',
          controller: 'RenzhengCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    });
});
