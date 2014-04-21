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
          baseMtAPIUrl = config.apiurl_mt, //mingti的api
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
          kaoshiNumsPerPage = 10, //每页显示多少条考试
          qryCxsjlbUrl = baseMtAPIUrl + 'chaxun_shijuanliebiao?token=' + token + '&caozuoyuan=' + caozuoyuan +
            '&jigouid=' + jigouid + '&lingyuid=' + lingyuid; //查询试卷列表url


        /**
         * 初始化加载的东西
         */


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

        /**
         * 新增一个考试 //
         */
        var kaoshi_data;
        $scope.addNewKaoShi = function(){
          kaoshi_data = { //考试的数据格式
            token: token,
            caozuoyuan: caozuoyuan,
            jigouid: jigouid,
            lingyuid: lingyuid,
            shuju:{
              KAOSHI_ID: '',
              KAOSHI_MINGCHENG: '',
              KAISHISHIJIAN: '',
              JIESHUSHIJIAN: '',
              SHICHANG: '',
              XINGZHI: '',
              LEIXING: '',
              XUZHI: '',
              SHIJUAN_ID: '',
              ZHUANGTAI: 0
            }
          };
          $scope.kaoshiData = kaoshi_data;
          $scope.txTpl = 'views/partials/editKaoShi.html';
        };

        /**
         * 显示试卷列表
         */
        $scope.showPaperList = function(){
          $http.get(qryCxsjlbUrl).success(function(data){
            if(data.length){
              $scope.paperListData = data;
              $scope.showAddKaoShiBackBtn = true;
              $scope.txTpl = 'views/partials/paperList.html'; //加载试卷列表模板
            }
          }).error(function(err){
            alert(err);
          });
        };

        /**
         * backToAddKaoShi
         */
        $scope.backToAddKaoShi = function(){
          $scope.txTpl = 'views/partials/editKaoShi.html';
        };

        /**
         * 保存考试
         */
        $scope.saveKaoShi = function(){
          console.log(kaoshi_data);
        };

      } // 002 结束 //
    ]); //controller 结束
  } // 001 结束
); // 000 结束
