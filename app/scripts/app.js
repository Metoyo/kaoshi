/*jshint unused: vars */
define(['angular', 'controllers/main', 'controllers/mingti']/*deps*/, function (angular, MainCtrl, MingtiCtrl)/*invoke*/ {
  'use strict';

  return angular.module('kaoshiApp', ['kaoshiApp.controllers.MainCtrl',
'kaoshiApp.controllers.MingtiCtrl',
/*angJSDeps*/
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .when('/mingti', {
          templateUrl: 'views/mingti.html',
          controller: 'MingtiCtrl'
        })
        .otherwise({
          redirectTo: '/'
        });
    });
});
