define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';
  angular.module('kaoshiApp.controllers.TongjiCtrl', [])
    .controller('TongjiCtrl', ['$rootScope', '$scope', '$http',
      function ($rootScope, $scope, $http) {
        /**
         * 操作title
         */
        $rootScope.pageName = "统计";
        $rootScope.dashboard_shown = true;
        $rootScope.isRenZheng = false; //判读页面是不是认证

        /**
         * 声明变量
         */
        var userInfo = $rootScope.session.userInfo,
          baseTjAPIUrl = config.apiurl_tj, //统计的api
          token = config.token,
          caozuoyuan = userInfo.UID,//登录的用户的UID
          jigouid = userInfo.JIGOU[0].JIGOU_ID,
          lingyuid = $rootScope.session.defaultLyId,
          letterArr = config.letterArr,
          queryKaoShi = baseTjAPIUrl + 'query_kaoshi?token=' + token + '&caozuoyuan=' + caozuoyuan
            + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考试数据
          queryShiJuan = baseTjAPIUrl + 'query_shijuan?token=' + token + '&caozuoyuan=' + caozuoyuan
            + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询试卷数据
          queryKaoShengBase = baseTjAPIUrl + 'query_kaosheng?token=' + token, //查询考生数据
          queryTiMuBase = baseTjAPIUrl + 'query_timu?token=' + token; //查询题目数据

        /**
         * 信息提示函数
         */
        var alertInfFun = function(megKind, cont){
          $('.messageTd').css('display', 'none').html('');
          if(megKind == 'err'){
            $('.mesError').css('display', 'block').html(cont); //mesSuccess mesPrompt
          }
          if(megKind == 'suc'){
            $('.mesSuccess').css('display', 'block').html(cont); // mesPrompt
          }
          if(megKind == 'pmt'){
            $('.mesPrompt').css('display', 'block').html(cont); //mesSuccess
          }
          $('.popInfoWrap').css('display', 'block').fadeOut(3000);
        };

        /**
         * 显示考试统计列表
         */
        $scope.showKaoShiTjList = function(){
          $http.get(queryKaoShi).success(function(data){
            if(data.length){
              $scope.tjKaoShiData = data;
            }
            else{
              alertInfFun('err', data.error);
            }
          });
          $scope.isTjDetailShow = false;
          $scope.tjSubTpl = 'views/partials/tj_ks.html';
        };

        /**
         * 显示试卷统计列表
         */
        $scope.showShiJuanTjList = function(){
          $http.get(queryShiJuan).success(function(data){
            if(data.length){
              $scope.tjShiJuanData = data;
            }
            else{
              alertInfFun('err', data.error);
            }
          });
          $scope.isTjDetailShow = false;
          $scope.tjSubTpl = 'views/partials/tj_sj.html';
        };

        /**
         * 初始化运行的程序
         */
        $scope.showKaoShiTjList();

        /**
         * 考试统计详情,查询考生
         */
        $scope.showKsTjDetail = function(ksId){
          var queryKaoSheng = queryKaoShengBase + '&shijuanid=' + ksId;
          $http.get(queryKaoSheng).success(function(data){
            if(data.length){
              $scope.tjKaoShengDetail = data;
            }
            else{
              alertInfFun('err', data.error);
            }
          });
          $scope.tjItemName = '考试统计';
          $scope.isTjDetailShow = true;
          $scope.tjSubTpl = 'views/partials/tj_ks_detail.html';
        };

        /**
         * 试卷统计详情
         */
        var comeFormWhere; //从那个列表点进来的
        $scope.showSjTjDetail = function(sjId, comeForm){
          var queryTiMu = queryTiMuBase + '&shijuanid=' + 1040,
            newCont;
          comeFormWhere = comeForm;
          $http.get(queryTiMu).success(function(data){
            if(data.length){
              _.each(data, function(tm, idx, lst){
                tm.TIGAN = JSON.parse(tm.TIGAN);
                if(tm.TIXING_ID <= 3){
                  var daanArr = tm.DAAN.split(','),
                    daanLen = daanArr.length,
                    daan = [];
                  for(var i = 0; i < daanLen; i++){
                    daan.push(letterArr[daanArr[i]]);
                  }
                  tm.DAAN = daan.join(',');
                }
                else if(tm.TIXING_ID == 4){
                  if(tm.DAAN == 1){
                    tm.DAAN = '对';
                  }
                  else{
                    tm.DAAN = '错';
                  }
                }
                else if(tm.TIXING_ID == 6){ //填空题
                  //修改填空题的答案
                  var tkDaAnArr = [],
                    tkDaAn = JSON.parse(tm.DAAN),
                    tkDaAnStr;
                  _.each(tkDaAn, function(da, idx, lst){
                    tkDaAnArr.push(da.answer);
                  });
                  tkDaAnStr = tkDaAnArr.join(';');
                  tm.DAAN = tkDaAnStr;
                  //修改填空题的题干
                  newCont = tm.TIGAN.tiGan.replace(tgReg, function(arg) {
                    var text = arg.slice(2, -2),
                      textJson = JSON.parse(text),
                      _len = textJson.size,
                      i, xhStr = '';
                    for(i = 0; i < _len; i ++ ){
                      xhStr += '_';
                    }
                    return xhStr;
                  });
                  tm.TIGAN.tiGan = newCont;
                }
                else{

                }
              });

              $scope.tjTmQuantity = 5; //加载是显示的题目数量
              $scope.letterArr = config.letterArr; //题支的序号
              $scope.tjTiMuDetail = data;
            }
            else{
              alertInfFun('err', data.error);
            }
          });
          $scope.tjItemName = '试卷统计';
          $scope.isTjDetailShow = true;
          $scope.tjSubTpl = 'views/partials/tj_sj_detail.html';
        };

        /**
         * 显示更多试卷统计详情
         */
        $scope.showTjSjMoreDetail = function(){
          $scope.tjTmQuantity = $scope.tjTiMuDetail.length; //加载是显示的题目数量
        };

        /**
         * 由统计详情返回列表
         */
        $scope.tjDetailToList = function(){
          if($scope.tjItemName == '考试统计'){ //考试统计的返回按钮
            $scope.showKaoShiTjList();
          }
          else{//试卷统计的返回按钮
            if(comeFormWhere == 'ksList'){ //试卷详情如果是由考试统计
              $scope.showKaoShiTjList();
            }
            else{
              $scope.showShiJuanTjList(); //试卷详情如果是由试卷统计
            }
          }
        }

    }]);
});
