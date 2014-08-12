/*jshint unused: vars */
define([
    'jquery',
    'underscore',
    'angular',
    'services/urlredirect',
    'controllers/renzheng',
    'controllers/nav',
    'controllers/mingti',
    'controllers/dagang',
    'controllers/user',
    'controllers/logout',
    'controllers/register',
    'controllers/zujuan',
    'controllers/kaowu',
    'controllers/lingyu',
    'controllers/tongji',
    'filters/mylocaldate',
    'filters/mylocaldatewithweek',
    'filters/examstatus',
    'filters/outputdaan',
    'filters/outtigan',
    'services/myfileupload',
    'directives/nandustar',
    'directives/passwordverify',
    'directives/bnslideshow',
    'directives/hoverslide',
    'directives/repeatdone',
    'directives/fileupload',
    'config'
   ], function ($, _, angular, UrlredirectService, RenzhengCtrl, NavCtrl, MingtiCtrl, DagangCtrl,UserCtrl, LogoutCtrl,
                RegisterCtrl, ZujuanCtrl, KaowuCtrl, LingyuCtrl, TongjiCtrl,MylocaldateFilter, MylocaldatewithweekFilter,
                ExamstatusFilter, OutputdaanFilter, OuttiganFilter, MyfileuploadService, NandustarDirective,
                PasswordverifyDirective, BnslideshowDirective, HoverslideDirective, FileuploadDirective,
                RepeatdoneDirective, config) {
  'use strict';

  return angular.module('kaoshiApp', [
    'kaoshiApp.services.Urlredirect',
    'kaoshiApp.services.Myfileupload',
    'kaoshiApp.controllers.RenzhengCtrl',
    'kaoshiApp.controllers.NavCtrl',
    'kaoshiApp.controllers.MingtiCtrl',
    'kaoshiApp.controllers.DagangCtrl',
    'kaoshiApp.controllers.UserCtrl',
    'kaoshiApp.controllers.LogoutCtrl',
    'kaoshiApp.controllers.RegisterCtrl',
    'kaoshiApp.controllers.ZujuanCtrl',
    'kaoshiApp.controllers.KaowuCtrl',
    'kaoshiApp.controllers.LingyuCtrl',
    'kaoshiApp.controllers.TongjiCtrl',
    'kaoshiApp.filters.Mylocaldate',
    'kaoshiApp.filters.Mylocaldatewithweek',
    'kaoshiApp.filters.Examstatus',
    'kaoshiApp.filters.Outputdaan',
    'kaoshiApp.filters.Outtigan',
    'kaoshiApp.directives.Hoverslide',
    'kaoshiApp.directives.Repeatdone',
    'kaoshiApp.directives.Fileupload',
    'kaoshiApp.directives.Bnslideshow',
    'kaoshiApp.directives.Nandustar',
    'kaoshiApp.directives.Passwordverify',
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
    }]).run(['$rootScope', '$location', '$route', 'urlRedirect', function($rootScope, $location,
                                                                                $route, urlRedirect) {

      /**
       * 确保所有需要登陆才可以访问的链接进行用户登陆信息验证，如果没有登陆的话，则导向登陆界面
       */
      $rootScope.$on("$locationChangeStart", function(event, next, current) {
        var routes = config.routes,
            nextUrlPattern,
            nextRoute,
            currentUrlParser = document.createElement('a'), // 使用浏览器内置的a标签进行url的解析判断
            nextUrlParser = document.createElement('a'),
            nextPath,
            currentPath,
            checkUrlAppliedPromise;

        currentUrlParser.href = current; // current为当前的url地址
        nextUrlParser.href = next; // next为即将要访问的url地址

        if(currentUrlParser.protocol === nextUrlParser.protocol
            && currentUrlParser.host === nextUrlParser.host) { // 确保current与next的url地址都是属于同一个网站的链接地址

          nextPath = nextUrlParser.hash.substr(1); // 因为我们使用的是hash即#开头的浏览器端路由， 在这儿解析的时候要去掉#

          /**
           * 测试即将要访问的路由是否已经在我们的angular.js程序中定义
           * @type {*|Mixed}
           */
          var findRoute = _.find($route.routes, function(route, urlPattern) {
            if(route && route !== 'null' && route.regexp) { // 测试即将要访问的url是否否何定义的路由规则
              if(route.regexp.test(nextPath)) {
                nextUrlPattern = urlPattern; // 记录即将要访问的路由模式，i.e: /user/:name
                return true;
              }
            }
            return false;
          });

          if(findRoute) { // 如果在我们的路由表中已找到即将要访问的路由， 那么执行以下代码
            nextRoute = routes[nextUrlPattern]; // 找到即将要访问的路由的配置信息
            /**
             * 判断即将要访问的路由是否需要登陆验证， 并且确保如果当前用户没有登陆的话，将用户重定向至登陆界面
             */
            if(nextRoute && nextRoute.requireLogin && !($rootScope.session && $rootScope.session.info)) {
              event.preventDefault(); // 取消访问下一个路由地址
              currentPath = $location.$$path;
              urlRedirect.goTo(currentPath, '/renzheng');
            }
          }
        }
      });
    }]);
});
