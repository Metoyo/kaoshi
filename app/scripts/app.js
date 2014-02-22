/*jshint unused: vars */
define([
    'jquery',
    'underscore',
    'angular',
    'controllers/main',
    'controllers/renzheng',
    'controllers/mingti',
    'controllers/dagang',
    'controllers/user',
    'config'
   ], function ($, _, angular, MainCtrl, RenzhengCtrl, MingtiCtrl, DagangCtrl, UserCtrl, config) {
  'use strict';

  return angular.module('kaoshiApp', ['kaoshiApp.controllers.MainCtrl',
'kaoshiApp.controllers.MingtiCtrl',
'kaoshiApp.controllers.DagangCtrl',
'kaoshiApp.controllers.RenzhengCtrl',
'kaoshiApp.controllers.UserCtrl',
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

    }]).run(['$rootScope', '$location', '$route', function($rootScope, $location, $route) {
      /**
       * 确保所有需要登陆才可以访问的链接进行用户登陆信息验证，如果没有登陆的话，则导向登陆界面
       */
      $rootScope.$on("$locationChangeStart", function(event, next, current) {
        var routes = config.routes,
            nextUrlPattern,
            nextRoute,
            currentUrlParser = document.createElement('a'),
            nextUrlParser = document.createElement('a'),
            nextPath;

        currentUrlParser.href = current;
        nextUrlParser.href = next;

        if(currentUrlParser.protocol === nextUrlParser.protocol
            && currentUrlParser.host === nextUrlParser.host) {

          nextPath = nextUrlParser.hash.substr(1);

          var findRoute = _.find($route.routes, function(route, urlPattern) {
            if(route.regexp.test(nextPath)) {
              nextUrlPattern = urlPattern;
              return true;
            }
            return false;
          });

          if(findRoute) {
            nextRoute = routes[nextUrlPattern];
            if(nextRoute && nextRoute.requireLogin && !($rootScope.session && $rootScope.session.info)) {
              event.preventDefault();
              $location.path('/renzheng');
              $rootScope.$apply();
            }
          }
        }
      });
    }]);
});
