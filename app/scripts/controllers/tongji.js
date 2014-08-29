define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';
  angular.module('kaoshiApp.controllers.TongjiCtrl', [])
    .controller('TongjiCtrl', ['$rootScope', '$scope', '$http',
      function ($rootScope, $scope, $http) {
        /**
         * 操作title//
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
          queryTiMuBase = baseTjAPIUrl + 'query_timu?token=' + token, //查询题目数据
          dataNumOfPerPage = 10, //每页显示多少条数据
          paginationLength = 11, //分页部分，页码的长度，目前设定为11
          pagesArr = [], //定义考试页码数组
          tjNeedData, //存放查询出来的统计数数据
          lastPage, //符合条件的考试一共有多少页
          tjKaoShiData = '',
          tjShiJuanData = '',
          backToWhere = '', //返回按钮返回到什么列表
          tjDataPara = '', //存放目前统计的是什么数据
          tjIdType = ''; //存放ID类型

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
          tjKaoShiData = '';
          pagesArr = [];
          tjNeedData = '';
          $scope.tj_tabActive = 'kaoshiTj';
          $http.get(queryKaoShi).success(function(data){
            if(!data.error){
              tjNeedData = data;
              tjKaoShiData = data;
              lastPage = Math.ceil(data.length/dataNumOfPerPage); //得到所有考试的页码
              $scope.lastPageNum = lastPage;
              for(var i = 1; i <= lastPage; i++){
                pagesArr.push(i);
              }
              $scope.tjPaging();
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
          tjShiJuanData = '';
          pagesArr = [];
          tjNeedData = '';
          $scope.tj_tabActive = 'shijuanTj';
          $http.get(queryShiJuan).success(function(data){
            if(!data.error){
              data = _.sortBy(data, function(sj){
                return sj.LAST_TIME;
              }).reverse();
              tjNeedData = data;
              tjShiJuanData = data;
              lastPage = Math.ceil(data.length/dataNumOfPerPage); //得到所有考试的页码
              $scope.lastPageNum = lastPage;
              for(var i = 1; i <= lastPage; i++){
                pagesArr.push(i);
              }
              $scope.tjPaging();
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
        $scope.tjShowStudentInfo = function(id, idType, comeForm){
          var queryKaoSheng, totalScore, avgScore;
          tjDataPara = '';
          tjIdType = '';
          if(idType == 'ksId'){
            queryKaoSheng = queryKaoShengBase + '&kaoshiid=' + id;
          }
          if(idType == 'sjId'){
            queryKaoSheng = queryKaoShengBase + '&shijuanid=' + id;
          }
          $http.get(queryKaoSheng).success(function(data){
            if(!data.error){
              $scope.tjKaoShengDetail = data;
              backToWhere = comeForm;
              tjDataPara = id;
              tjIdType = idType;
              //求平均分
              totalScore = _.reduce(data, function(memo, stu){ return memo + stu.ZUIHOU_PINGFEN; }, 0);
              avgScore = totalScore/data.length;
              $scope.myAvgScore = avgScore;
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
        $scope.tjShowItemInfo = function(id, idType, comeForm){
          var queryTiMu, newCont,
            tgReg = new RegExp('<\%{.*?}\%>', 'g');
          tjDataPara = '';
          tjIdType = '';
          if(idType == 'ksId'){
            queryTiMu = queryTiMuBase + '&kaoshiid=' + id;
          }
          if(idType == 'sjId'){
            queryTiMu = queryTiMuBase + '&shijuanid=' + id;
          }
          $http.get(queryTiMu).success(function(data){
            if(!data.error){
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
                backToWhere = comeForm;
                tjDataPara = id;
                tjIdType = idType;
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
          $scope.myAvgScore = '';
          $scope.tjSubTpl = 'views/partials/tj_sj_detail.html';
        };

        /**
         * 二级导航上的分数统计//
         */
        $scope.tjSubShowStudentInfo = function(){
          var queryKaoSheng, totalScore, avgScore;
          if(tjIdType == 'ksId'){
            queryKaoSheng = queryKaoShengBase + '&kaoshiid=' + tjDataPara;
          }
          if(tjIdType == 'sjId'){
            queryKaoSheng = queryKaoShengBase + '&shijuanid=' + tjDataPara;
          }
          $http.get(queryKaoSheng).success(function(data){
            if(!data.error){
              $scope.tjKaoShengDetail = data;
              //求平均分
              totalScore = _.reduce(data, function(memo, stu){ return memo + stu.ZUIHOU_PINGFEN; }, 0);
              avgScore = totalScore/data.length;
              $scope.myAvgScore = avgScore;
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
         * 二级导航上的题目统计
         */
        $scope.tjSubShowItemInfo = function(){
          var queryTiMu, newCont,
            tgReg = new RegExp('<\%{.*?}\%>', 'g');
          if(tjIdType == 'ksId'){ //考试统计
            queryTiMu = queryTiMuBase + '&kaoshiid=' + tjDataPara;
          }
          if(tjIdType == 'sjId'){ //试卷统计
            queryTiMu = queryTiMuBase + '&shijuanid=' + tjDataPara;
          }
          $http.get(queryTiMu).success(function(data){
            if(!data.error){
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
          $scope.myAvgScore = '';
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
          if(backToWhere == 'ksList'){ //考试统计的返回按钮
            $scope.showKaoShiTjList();
          }
          if(backToWhere == 'sjList'){ //试卷统计的返回按钮
            $scope.showShiJuanTjList(); //试卷详情如果是由试卷统计
          }
          $scope.myAvgScore = '';
        };

        /**
         * 考试的分页数据
         */
        $scope.tjPaging = function(pg){
          //得到分页数组的代码
          var currentPage = $scope.currentPage = pg ? pg : 1;
          if(lastPage <= paginationLength){
            $scope.tjPages = pagesArr;
          }
          if(lastPage > paginationLength){
            if(currentPage > 0 && currentPage <= 6 ){
              $scope.tjPages = pagesArr.slice(0, paginationLength);
            }
            else if(currentPage > lastPage - 5 && currentPage <= lastPage){
              $scope.tjPages = pagesArr.slice(lastPage - paginationLength);
            }
            else{
              $scope.tjPages = pagesArr.slice(currentPage - 5, currentPage + 5);
            }
          }
          //查询数据的代码
          $scope.tjData = tjNeedData.slice((currentPage-1)*10, currentPage*10);
        };

        /**
         * 上次考试统计
         */
        $scope.lastKaoShiTongJi = function(){
          if(tjKaoShiData.length){
            $scope.tjShowStudentInfo(tjKaoShiData[0].KAOSHI_ID, 'ksId', 'ksList');
          }
          else{
            $http.get(queryKaoShi).success(function(data){
              if(!data.error){
                $scope.tjShowStudentInfo(data[0].KAOSHI_ID, 'ksId', 'ksList');
              }
              else{
                alertInfFun('err', data.error);
              }
            });
          }
        };

        /**
         * 上次试卷统计
         */
        $scope.lastShiJuanTongJi = function(){
          if(tjShiJuanData.length){
            $scope.tjShowItemInfo(tjShiJuanData[0].SHIJUAN_ID, 'sjId', 'sjList');
          }
          else{
            $http.get(queryShiJuan).success(function(data){
              if(!data.error){
                data = _.sortBy(data, function(sj){
                  return sj.LAST_TIME;
                }).reverse();
                $scope.tjShowItemInfo(data[0].SHIJUAN_ID, 'sjId', 'sjList');
              }
              else{
                alertInfFun('err', data.error);
              }
            });
          }
        };

        /**
         * 重新加载mathjax
         */
        $scope.$on('onRepeatLast', function(scope, element, attrs){
          $('.reloadMath').click();
        });

    }]);
});
