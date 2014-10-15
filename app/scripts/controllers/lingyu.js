define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) { // 00
  'use strict';

  angular.module('kaoshiApp.controllers.LingyuCtrl', [])
    .controller('LingyuCtrl', ['$rootScope', '$scope', '$location', 'urlRedirect', '$cookieStore', //11
      function ($rootScope, $scope, $location, urlRedirect, $cookieStore) {
        /**
         * 定义变量和初始化
         */
        var currentPath = $location.$$path,
          session = $rootScope.session,
          lingyu = $cookieStore.get('lingyuCk');
        $rootScope.pageName = "选择默认科目";//页面名称
        $rootScope.isRenZheng = true; //判读页面是不是认证
        $rootScope.dashboard_shown = false;
        $scope.linyuInfo = lingyu.lingyu;

        /**
         * 设置默认的领域
         */
        $scope.goToTargetWeb = function(ly){
          var jsUrl = '', urlShowAndHideArr = [];
          //在session中记录作为默认的领域id和领域名称
          session.defaultLyId = ly.LINGYU_ID;
          session.defaultLyName = ly.LINGYUMINGCHENG;
          //根据权限判断导向
          _.each(config.quanxianObj, function(qx, idx, lst){
            //默认导向的url
            var inQx = _.contains(qx.qxArr, ly.quanxian[0]),
              navName = _.intersection(qx.qxArr, ly.quanxian).length;
            if(inQx){
              jsUrl = qx.targetUrl;
            }
            //显示和隐藏url
            if(navName > 0){
              urlShowAndHideArr.push(qx.navName);
            }
          });
          //cookies代码
          var userCookie = $cookieStore.get('logged');
          userCookie.defaultLyId = ly.LINGYU_ID;
          userCookie.defaultLyName = ly.LINGYUMINGCHENG;
          userCookie.quanxianStr = urlShowAndHideArr.join();
          $cookieStore.put('logged', userCookie);

          urlRedirect.goTo(currentPath, jsUrl);
        }

    }]); //11
}); //00
