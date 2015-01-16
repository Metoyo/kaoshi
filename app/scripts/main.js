/*jshint unused: vars */
require.config({
  paths: {
    angular: '../../bower_components/angular/angular',
    'angular-animate': '../../bower_components/angular-animate/angular-animate',
    'angular-cookies': '../../bower_components/angular-cookies/angular-cookies',
    'angular-mocks': '../../bower_components/angular-mocks/angular-mocks',
    'angular-resource': '../../bower_components/angular-resource/angular-resource',
    'angular-route': '../../bower_components/angular-route/angular-route',
    'angular-sanitize': '../../bower_components/angular-sanitize/angular-sanitize',
    'angular-scenario': '../../bower_components/angular-scenario/angular-scenario',
    'angular-touch': '../../bower_components/angular-touch/angular-touch',
    jquery: '../../bower_components/jquery/dist/jquery.min',
    underscore: '../../bower_components/underscore/underscore',
    charts: '../../bower_components/echarts/echarts-plain',
    bootstrap: '../../bower_components/bootstrap/dist/js/bootstrap',
    sizzle: '../../bower_components/sizzle/dist/sizzle'
  },
  shim: {
    angular: {
      exports: 'angular'
    },
    'angular-route': [
      'angular'
    ],
    'angular-cookies': [
      'angular'
    ],
    'angular-sanitize': [
      'angular'
    ],
    'angular-resource': [
      'angular'
    ],
    'angular-animate': [
      'angular'
    ],
    'angular-touch': [
      'angular'
    ],
    jquery: {
      exports: 'jquery'
    },
    underscore: {
      deps: [
        'jquery'
      ],
      exports: 'underscore'
    },
    'angular-mocks': {
      deps: [
        'angular'
      ],
      exports: 'angular.mock'
    },
    zrender: {
      deps: [
        'underscore'
      ],
      exports: 'zrender'
    }
  },
  priority: [
    'angular'
  ],
  packages: [

  ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
  'app',
  'angular',
  'angular-route',
  'angular-cookies',
  'angular-sanitize',
  'angular-resource',
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