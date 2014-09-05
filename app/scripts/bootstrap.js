/*jshint unused: vars */
require.config({
  paths: {
    angular: '../../bower_components/angular/angular',
    angularRoute: '../../bower_components/angular-route/angular-route',
    angularCookies: '../../bower_components/angular-cookies/angular-cookies',
    angularSanitize: '../../bower_components/angular-sanitize/angular-sanitize',
    angularResource: '../../bower_components/angular-resource/angular-resource',
    angularMocks: '../../bower_components/angular-mocks/angular-mocks',
    jquery: '../../bower_components/jquery/jquery',
    underscore: '../../bower_components/underscore/underscore',
    charts: 'http://echarts.baidu.com/build/echarts-plain'

//    angular: '../../bower_components/angular/angular.min',
//    angularRoute: '../../bower_components/angular-route/angular-route.min',
//    angularCookies: '../../bower_components/angular-cookies/angular-cookies.min',
//    angularSanitize: '../../bower_components/angular-sanitize/angular-sanitize.min',
//    angularResource: '../../bower_components/angular-resource/angular-resource.min',
//    angularMocks: '../../bower_components/angular-mocks/angular-mocks',
//    jquery: '../../bower_components/jquery/jquery.min',
//    underscore: '../../bower_components/underscore/underscore.min'
  },
  shim: {
    'angular' : {'exports' : 'angular'},
    'angularRoute': ['angular'],
    'angularCookies': ['angular'],
    'angularSanitize': ['angular'],
    'angularResource': ['angular'],
    'angularMocks': {
      deps:['angular'],
      'exports':'angular.mock'
    }
  },
  priority: [
    'angular'
  ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
  'app',
  'angular',
  'angularRoute',
  'angularCookies',
  'angularSanitize',
  'angularResource',
  'jquery',
  'underscore',
  'charts'
], function(app, angular, ngRoutes, ngCookies, ngSanitize, ngResource, $, _, charts) {
  'use strict';
  /* jshint ignore:start */
  var $html = angular.element(document.getElementsByTagName('html')[0]);
  /* jshint ignore:end */
  /**
   * 给每个链接添加点击事件， 如果该链接指向的地址是本服务器的地址， 则判断是否属于angular.js app已经定义的路由链接，
   * 如果是则使用angular.js的导航，如果不是则使用浏览器默认处理方式
   */
  app.directive('a', ['$rootScope', '$location', '$route', function($rootScope, $location, $route) {
    return {
      restrict: 'E',
      link: function(scope, elem, attrs) {
        elem.on('click', function(e) {
          var href = attrs.href;
          if(href.indexOf('/') === 0) {
            var findRoute = _.find($route.routes, function(route) {
              if(route.regexp.test(href)) {
                return true;
              }
              return false;
            });
            if(findRoute) {
              e.preventDefault();
              $location.path(href);
              $rootScope.$apply();
            }
          }
        });
      }
    };
  }]);

  angular.element().ready(function() {
    angular.resumeBootstrap([app.name]);
  });
});