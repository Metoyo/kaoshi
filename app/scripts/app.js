/*jshint unused: vars */
define([
    'jquery',
    'angular',
    'controllers/main',
    'controllers/renzheng',
    'controllers/mingti',
    'controllers/dagang',
    'config'
   ], function ($, angular, MainCtrl, RenzhengCtrl, MingtiCtrl, DagangCtrl, config) {
  'use strict';

  return angular.module('kaoshiApp', ['kaoshiApp.controllers.MainCtrl',
'kaoshiApp.controllers.MingtiCtrl',
'kaoshiApp.controllers.DagangCtrl',
'kaoshiApp.controllers.RenzhengCtrl',
/*angJSDeps*/
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
    .config(['$routeProvider',  function ($routeProvider, $rootScope) {
      var routes = config.routes;

      /**
       * 根据config文件中的路由配置信息加载本应用中要使用到的路由规则
       */
      for(var path in routes) {
        $routeProvider.when(path, routes[path]);
      }
      $routeProvider.otherwise({redirectTo: '/renzheng'});

    }]).run(['$rootScope', '$location', function($rootScope, $location) {
      /**
       * 确保所有需要登陆才可以访问的链接进行用户登陆信息验证，如果没有登陆的话，则导向登陆界面
       */
      $rootScope.$on("$locationChangeStart", function(event, next, current) {
        var routes = config.routes;
        for(var i in routes) {
          if(next.indexOf(i) != -1) {
            if(routes[i].requireLogin && !($rootScope.session && $rootScope.session.info)) {
              event.preventDefault();
              $location.path('/renzheng');
              $rootScope.$apply();
            }
          }
        }
      });
    }]);
});
