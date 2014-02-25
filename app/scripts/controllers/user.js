define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.UserCtrl', [])
    .controller('UserCtrl', ['$rootScope', '$scope', '$http', '$q', function ($rootScope, $scope, $http, $q) {
      var session = $rootScope.session,
          dshyhjsUrl = config.apiurl_rz + 'daishenhe_yonghu_juese?token='
                         + config.token + '&caozuoyuan=' + session.info.UID,
          shyhjsUrl = config.apiurl_rz + 'shenhe_yonghu_juese';

      $rootScope.pageName = "认证";//页面名称
      $rootScope.styles = [
        'styles/renzheng.css'
      ];
      $rootScope.dashboard_shown = false;
      $scope.addedContainerClass = 'userBox';

      $scope.shenheList = [];
      $scope.showShenhe = false;

      $scope.setPermissions = function() {
        $http.get(dshyhjsUrl).success(function(data) {
          $scope.showShenhe = true;
          _.each(data, function(sh, indx, lst) {
            sh.AUTH_BTN_HIDE = true;
            _.each(sh.JUESE, function(js, indx, jsLst) {
              js.JUESE_CHECKED = js.ZHUANGTAI > -1;
              if(js.ZHUANGTAI === 0) {
                sh.AUTH_BTN_HIDE = false;
              }
            });
          });
          $scope.shenheList = data;
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

            if(js.JUESE_CHECKED && (js.ZHUANGTAI === -1 || js.zhuangtai === 0)) {
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
                console.log(data);
              }
            }).error(function(data) {
                alert(data.error);
              });

            //console.log(authParam);

          }).value();
      };

    }]);
});
