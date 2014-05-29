define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.UserCtrl', [])
    .controller('UserCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
      var session = $rootScope.session,
          dshyhjsUrl = config.apiurl_rz + 'daishenhe_yonghu_juese?token='
                         + config.token + '&caozuoyuan=' + session.info.UID,
          shyhjsUrl = config.apiurl_rz + 'shenhe_yonghu_juese';

      $rootScope.pageName = "认证";//页面名称
      $rootScope.isRenZheng = true; //判读页面是不是认证
      $rootScope.dashboard_shown = false;
      $scope.addedContainerClass = 'userBox';

      $scope.shenheList = [];
      $scope.showShenhe = false;

      $scope.setPermissions = function() {
        $scope.loadingImgShow = true; //user.html
        var hasShenHe = [], //定义一个已经通过审核的数组
            notShenHe = []; //定义一个待审核的数组
        $http.get(dshyhjsUrl).success(function(data) {
          if(data){
            $scope.showShenhe = true;
            _.each(data, function(sh, indx, lst) {
              sh.AUTH_BTN_HIDE = true;
              var zeroLength = 0; //判断有几个未审核的角色
              _.each(sh.JUESE, function(js, indx, jsLst) {
                js.JUESE_CHECKED = js.ZHUANGTAI > -1;
                if(js.ZHUANGTAI === 0) {
                  sh.AUTH_BTN_HIDE = false;
                  zeroLength ++;
                }
              });
              if(zeroLength){
                notShenHe.push(sh);
              }
              else{
                hasShenHe.push(sh);
              }
            });
            $scope.loadingImgShow = false; //user.html
            $scope.hasShenHeList = hasShenHe;
            $scope.notShenHeList = notShenHe;
          }
          else{
            alert('没有相关数据！');
            $scope.loadingImgShow = false; //user.html
          }
        });
      };

      $scope.closeShenheBox = function() {
        $scope.showShenhe = false;
      };

      $scope.jueseClicked = function(shenhe, juese) {
        shenhe.AUTH_BTN_HIDE = false;
      };

      $scope.authPerm = function(shenhe) {
        var juese = [],
            authParam = {
              token: config.token,
              caozuoyuan: session.info.UID,
              yonghujuese: [{
                yonghuid: shenhe.UID,
                jigou: shenhe.JIGOU_ID,
                lingyu: shenhe.LINGYU_ID
              }]
            };

        _.chain(shenhe.JUESE)
          .each(function(js, indx, lst) {
            var tmpJS = {};

            if(js.JUESE_CHECKED && (js.ZHUANGTAI === -1 || js.ZHUANGTAI === 0)) {
              tmpJS.juese_id = js.JUESE_ID;
              tmpJS.zhuangtai = 1;
            } else if(!js.JUESE_CHECKED && js.ZHUANGTAI === 1) {
              tmpJS.juese_id = js.JUESE_ID;
              tmpJS.zhuangtai = 0;
            } else if(js.JUESE_CHECKED && js.ZHUANGTAI === 1) {
              tmpJS.juese_id = js.JUESE_ID;
              tmpJS.zhuangtai = 1;
            }

            if(tmpJS.juese_id) {
              juese.push(tmpJS);
            }
          })
          .tap(function(){
            authParam.yonghujuese[0].juese = juese;

            $http.post(shyhjsUrl, authParam).success(function(data) {
              if(data.result) {
                shenhe.AUTH_BTN_HIDE = true;
              }
            }).error(function(data) {
                alert(data.error);
              });

          }).value();
      };

    }]);
});
