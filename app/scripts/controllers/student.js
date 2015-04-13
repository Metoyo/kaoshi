define(['jquery', 'underscore', 'angular', 'config'], function (JQ, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.StudentCtrl', [])
    .controller('StudentCtrl', ['$rootScope', '$scope', '$location', '$http', 'DataService',
      function ($rootScope, $scope, $location, $http, DataService) {
        /**
         * 定义变量
         */
        $rootScope.isRenZheng = false; //判读页面是不是认证
        /**
         * 声明变量
         */
        var userInfo = $rootScope.session.userInfo,
          defaultJg = userInfo.JIGOU,
          xuehao = userInfo.xuehao,
          baseBmAPIUrl = config.apiurl_bm, //报名的api
          token = config.token,
          queryKaoShi = baseBmAPIUrl + 'chaxun_baoming?token=' + token + '&jigouid=' + defaultJg + '&xuehao=' + xuehao;

        /**
         * 根据机构和学号查询报名信息
         */
        $scope.chaXunBaoMing = function(){
          DataService.getData(queryKaoShi).then(function(data){
            if(data && data.length){
              console.log(data);
            }
            else{
              DataService.alertInfFun('err', '没有符合的数据！');
            }
          });
        };
        $scope.chaXunBaoMing();


      }]);
});
