define(['../../jquery/jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) { // 00
  'use strict';

  angular.module('kaoshiApp.controllers.LingyuCtrl', [])
    .controller('LingyuCtrl', ['$rootScope', '$scope', '$location', '$http', 'urlRedirect',  //11
      function ($rootScope, $scope, $location, $http, urlRedirect) {
        /**
         * 定义变量和初始化
         */
        var currentPath = $location.$$path,
          session = $rootScope.session;
        $rootScope.pageName = "选择默认科目";//页面名称
        $rootScope.isRenZheng = true; //判读页面是不是认证
        $rootScope.dashboard_shown = false;
        $scope.linyuInfo = session.userInfo.LINGYU;

        /**
         * 设置默认的领域
         */
        $scope.goToTargetWeb = function(ly){
          //在session中记录作为默认的领域id和领域名称
          session.defaultLyId = ly.LINGYU_ID;
          session.defaultLyName = ly.LINGYUMINGCHENG;
          var needLyArr = _.chain(session.userInfo.JUESE)
              .filter(function(js){if(js.LINGYU_ID == ly.LINGYU_ID){ return js;}})
              .sortBy(function(js){ return js.JUESE_ID; })
              .map(function(js){ return js.JUESE_ID; })
              .uniq().value(), //得到角色的数组
            jsUrl = config.quanxianObj[parseInt(needLyArr[0]) - 1].juese_url; //得到要跳转的url
          session.jueseStr = _.map(needLyArr, function(jsm){return 'juese' + jsm}).join();
          urlRedirect.goTo(currentPath, jsUrl);
        }

    }]); //11
}); //00
