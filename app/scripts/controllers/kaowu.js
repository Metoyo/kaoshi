define(['jquery', 'underscore', 'angular', 'config'], // 000 开始
  function ($, _, angular, config) { // 001 开始
  'use strict';

  angular.module('kaoshiApp.controllers.KaowuCtrl', []) //controller 开始
    .controller('KaowuCtrl', ['$rootScope', '$scope', '$location', '$http', 'urlRedirect', '$q',
      function ($rootScope, $scope, $location, $http, $q) { // 002 开始
        /**
         * 操作title
         */
        $rootScope.pageName = "考务"; //page title
        $rootScope.styles = ['styles/kaowu.css'];

        /**
         * 定义变量
         */
        var userInfo = $rootScope.session.userInfo,
          baseKwAPIUrl = config.apiurl_kw, //考务的api
          token = config.token,
          caozuoyuan = userInfo.UID,//登录的用户的UID   chaxun_kaoshi_liebiao
          jigouid = userInfo.JIGOU[0].JIGOU_ID,
          lingyuid = userInfo.LINGYU[0].LINGYU_ID,
          qryKaoChangListUrl = baseKwAPIUrl + 'chaxun_kaodiankaochang_liebiao?token=' + token + '&caozuoyuan='
            + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考场列表的url
          qryKaoChangDetailBaseUrl = baseKwAPIUrl + 'chaxun_kaodiankaochang?token=' + token + '&caozuoyuan='
            + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考场详细的url
          qryKaoShiListUrl = baseKwAPIUrl + 'chaxun_kaoshi_liebiao?token=' + token + '&caozuoyuan='
            + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考试列表的url
          qryKaoShiDetailBaseUrl = baseKwAPIUrl + 'chaxun_kaoshi?token=' + token + '&caozuoyuan='
            + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考试详细的url
          kaoshiNumsPerPage = 10; //每页显示多少条考试

        /**
         * 考务页面加载时，加载考试列表
         */
        var loadKaoShi = function(){
          //先查询所有考试的Id
          $http.get(qryKaoShiListUrl).success(function(kslst){
            if(kslst.length){
              var kaoshiSubIds = kslst.slice(0, kaoshiNumsPerPage), //截取数组
                kaoshiSelectIdsArr = _.map(kaoshiSubIds, function(ksid){ return ksid.KAOSHI_ID; }), //提取KAOSHI_ID
                qrySelectKaoShisUrl = qryKaoShiDetailBaseUrl + '&kaoshiid=' + kaoshiSelectIdsArr.toString();
              $http.get(qrySelectKaoShisUrl).success(function(ksdtl){
                if(ksdtl.length){
                  $scope.kaoshiList = ksdtl;
                }
              });
            }
          });
        };
        loadKaoShi();

      } // 002 结束
    ]); //controller 结束
  } // 001 结束
); // 000 结束
