define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';
  angular.module('kaoshiApp.controllers.TongjiCtrl', [])
    .controller('TongjiCtrl', ['$rootScope', '$scope', '$http', '$timeout', 'messageService',
      function ($rootScope, $scope, $http, $timeout, messageService) {
        /**
         * 操作title
         */
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
          backToWhere = '', //返回按钮返回到什么列表
          tjDataPara = '', //存放目前统计的是什么数据
          tjIdType = '', //存放ID类型
          tjNamePara = '', //存放统计名称
          tjPieData = [], //饼状图数据
          tjBarData = [], //柱状图数据
          tjLineData = [], //折线图数据
          exportStuInfoUrl = baseTjAPIUrl + 'export_to_excel',
          downloadTempFileBase = config.apiurl_tj_ori + 'download_temp_file/',
          answerReappearBaseUrl = baseTjAPIUrl + 'answer_reappear?token=' + token; //作答重现的url

        $scope.tjData = [];
        $scope.tjParas = { //统计用到的参数
          stuIdCount: true,
          nameCount: true,
          classCount: true,
          scoreCount: true,
          zdcxKaoShiId: '', //作答重现用到的考试id
          letterArr: config.letterArr, //题支的序号
          cnNumArr: config.cnNumArr, //汉语的大写数字
          tjBjNum: 0, //统计用到的班级列表分页
          tjBjLen: 0, //统计用到的班级列表分页长度
          selectBanJi: '', //当前选中的班级
          lastSelectBj: {
            pageNum: 0,
            banJiIdx: 0
          } //最后选中的班级
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
              messageService.alertInfFun('err', data.error);
            }
          });
          $scope.isTjDetailShow = false;
          $scope.tjSubTpl = 'views/tongji/tj_ks.html';
        };

        /**
         * 显示试卷统计列表  可以删除
         */
        //$scope.showShiJuanTjList = function(){
        //  tjShiJuanData = '';
        //  pagesArr = [];
        //  tjNeedData = '';
        //  $scope.tj_tabActive = 'shijuanTj';
        //  $http.get(queryShiJuan).success(function(data){
        //    if(!data.error){
        //      data = _.sortBy(data, function(sj){
        //        return sj.LAST_TIME;
        //      }).reverse();
        //      tjNeedData = data;
        //      tjShiJuanData = data;
        //      lastPage = Math.ceil(data.length/dataNumOfPerPage); //得到所有考试的页码
        //      $scope.lastPageNum = lastPage;
        //      for(var i = 1; i <= lastPage; i++){
        //        pagesArr.push(i);
        //      }
        //      $scope.tjPaging();
        //    }
        //    else{
        //      messageService.alertInfFun('err', data.error);
        //    }
        //  });
        //  $scope.isTjDetailShow = false;
        //  $scope.tjSubTpl = 'views/tongji/tj_sj.html';
        //};

        /**
         * 显示考生首页
         */
        $scope.showKaoShengTjList = function(){
          $scope.tj_tabActive = 'kaoshengTj';
          $scope.tjSubTpl = 'views/tongji/tj_student.html';
        };

        /**
         * 初始化运行的程序
         */
        $scope.showKaoShiTjList();

        /**
         * 考试统计详情,查询考生
         */
        //$scope.tjShowStudentInfo = function(id, idType, comeForm, tjName, sjArr){
        //  var queryKaoSheng, totalScore, avgScore,
        //    targetIdx, tjDataLen;
        //  $scope.tjParas.zdcxKaoShiId = '';
        //  $scope.kaoShengShiJuan = '';
        //
        //  tjDataPara = '';
        //  tjIdType = '';
        //  tjNamePara = '';
        //  tjPieData = [ //饼状图学生信息
        //    {
        //      name : '不及格',
        //      value : 0
        //    },
        //    {
        //      name : '及格',
        //      value : 0
        //    },
        //    {
        //      name : '良',
        //      value : 0
        //    },
        //    {
        //      name : '优',
        //      value : 0
        //    }
        //  ];
        //  tjBarData = [0, 0, 0, 0];
        //  if(idType == 'ksId'){
        //    queryKaoSheng = queryKaoShengBase + '&kaoshiid=' + id;
        //    $scope.tjParas.zdcxKaoShiId = id; //作答重现用到的考试ID
        //  }
        //  if(idType == 'sjId'){
        //    queryKaoSheng = queryKaoShengBase + '&shijuanid=' + id;
        //  }
        //  $scope.showKaoShengShiJuan = true;
        //  $http.get(queryKaoSheng).success(function(data){
        //    if(!data.error){
        //      $scope.tjKaoShengDetail = data;
        //      backToWhere = comeForm;
        //      tjDataPara = id;
        //      tjIdType = idType;
        //      tjNamePara = tjName;
        //      //求平均分
        //      totalScore = _.reduce(data, function(memo, stu){ return memo + stu.ZUIHOU_PINGFEN; }, 0);
        //      avgScore = totalScore/data.length;
        //      $scope.myAvgScore = avgScore.toFixed(1);
        //      //分数详细统计用到的数据
        //      _.each(data, function(stuScore, idx, lst){
        //        if(stuScore.ZUIHOU_PINGFEN < 60){
        //          tjPieData[0].value ++;
        //          tjBarData[0] ++;
        //        }
        //        if(stuScore.ZUIHOU_PINGFEN >= 60 && stuScore.ZUIHOU_PINGFEN < 80){
        //          tjPieData[1].value ++;
        //          tjBarData[1] ++;
        //        }
        //        if(stuScore.ZUIHOU_PINGFEN >= 80 && stuScore.ZUIHOU_PINGFEN < 90){
        //          tjPieData[2].value ++;
        //          tjBarData[2] ++;
        //        }
        //        if(stuScore.ZUIHOU_PINGFEN >= 90){
        //          tjPieData[3].value ++;
        //          tjBarData[3] ++;
        //        }
        //      });
        //    }
        //    else{
        //      messageService.alertInfFun('err', data.error);
        //    }
        //  });
        //  //统计下面的5条数据
        //  $scope.tjChartNav = [];
        //  tjDataLen = $scope.tjData.length;
        //  if(tjDataLen){
        //    if(comeForm == 'ksList'){
        //      if(idType == 'ksId'){
        //        _.each($scope.tjData, function(tjd, idx, lst){
        //          if(tjd.KAOSHI_ID == id){
        //            targetIdx = idx;
        //          }
        //        });
        //      }
        //      else{
        //        _.each($scope.tjData, function(tjd, idx, lst){
        //          _.each(tjd.SHIJUAN, function(sj){
        //            if(sj.SHIJUAN_ID == id){
        //              targetIdx = idx;
        //            }
        //          });
        //        });
        //      }
        //    }
        //    if(comeForm == 'sjList'){
        //      _.each($scope.tjData, function(tjd, idx, lst){
        //        if(tjd.SHIJUAN_ID == id){
        //          targetIdx = idx;
        //        }
        //      });
        //    }
        //    if(tjDataLen <= 5){
        //      $scope.tjChartNav = $scope.tjData.slice(0);
        //    }
        //    if(tjDataLen > 5){
        //      if(targetIdx <= 2){
        //        $scope.tjChartNav = $scope.tjData.slice(0, 5);
        //      }
        //      else if(targetIdx >= tjDataLen - 3){
        //        $scope.tjChartNav = $scope.tjData.slice(tjDataLen - 5);
        //      }
        //      else{
        //        $scope.tjChartNav = $scope.tjData.slice(targetIdx - 2, targetIdx + 3);
        //      }
        //    }
        //    //为了class active
        //    if(comeForm == 'ksList'){
        //      if(idType == 'ksId'){
        //        _.each($scope.tjChartNav, function(tjd, idx, lst){
        //          if(tjd.KAOSHI_ID == id){
        //            $scope.activeIdx = idx;
        //          }
        //        });
        //      }
        //      else{
        //        _.each($scope.tjChartNav, function(tjd, idx, lst){
        //          _.each(tjd.SHIJUAN, function(sj){
        //            if(sj.SHIJUAN_ID == id){
        //              $scope.activeIdx = idx;
        //            }
        //          });
        //        });
        //      }
        //    }
        //    if(comeForm == 'sjList'){
        //      _.each($scope.tjChartNav, function(tjd, idx, lst){
        //        if(tjd.SHIJUAN_ID == id){
        //          $scope.activeIdx = idx;
        //        }
        //      });
        //    }
        //  }
        //  else{
        //    messageService.alertInfFun('err', '没有考试数据！');
        //  }
        //  $scope.tjItemName = tjName;
        //  $scope.isTjDetailShow = true;
        //  $scope.tjSubTpl = 'views/tongji/tj_ks_detail.html';
        //};

        /**
         * 试卷统计详情
         */
        $scope.tjShowItemInfo = function(id, idType, comeForm, tjName){
          var queryTiMu, newCont,
            tgReg = new RegExp('<\%{.*?}\%>', 'g');
          tjDataPara = '';
          tjIdType = '';
          tjNamePara = '';
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
                tjNamePara = tjName;
              });
              $scope.tjTmQuantity = 5; //加载是显示的题目数量
              $scope.letterArr = config.letterArr; //题支的序号
              $scope.tjTiMuDetail = data;
            }
            else{
              messageService.alertInfFun('err', data.error);
            }
          });
          $scope.tjItemName = tjName;
          $scope.isTjDetailShow = true;
          $scope.myAvgScore = '';
          $scope.tjSubTpl = 'views/tongji/tj_sj_detail.html';
        };

        /**
         * 二级导航上的分数统计
         */
        //$scope.tjSubShowStudentInfo = function(){
        //  var queryKaoSheng, totalScore, avgScore;
        //  if(tjIdType == 'ksId'){
        //    queryKaoSheng = queryKaoShengBase + '&kaoshiid=' + tjDataPara;
        //  }
        //  if(tjIdType == 'sjId'){
        //    queryKaoSheng = queryKaoShengBase + '&shijuanid=' + tjDataPara;
        //  }
        //  $scope.showKaoShengShiJuan = true;
        //  $http.get(queryKaoSheng).success(function(data){
        //    if(!data.error){
        //      $scope.tjKaoShengDetail = data;
        //      //求平均分
        //      totalScore = _.reduce(data, function(memo, stu){ return memo + stu.ZUIHOU_PINGFEN; }, 0);
        //      avgScore = totalScore/data.length;
        //      $scope.myAvgScore = avgScore.toFixed(1);
        //    }
        //    else{
        //      messageService.alertInfFun('err', data.error);
        //    }
        //  });
        //  $scope.tjItemName = tjNamePara;
        //  $scope.isTjDetailShow = true;
        //  $scope.tjSubTpl = 'views/tongji/tj_ks_detail.html';
        //};

        /**
         * 二级导航上的题目统计
         */
//        $scope.tjSubShowItemInfo = function(){
//          var queryTiMu, newCont,
//            tgReg = new RegExp('<\%{.*?}\%>', 'g');
//          if(tjIdType == 'ksId'){ //考试统计
//            queryTiMu = queryTiMuBase + '&kaoshiid=' + tjDataPara;
//          }
//          if(tjIdType == 'sjId'){ //试卷统计
//            queryTiMu = queryTiMuBase + '&shijuanid=' + tjDataPara;
//          }
//          $http.get(queryTiMu).success(function(data){
//            if(!data.error){
//              _.each(data, function(tm, idx, lst){
//                var cclv = new Number(tm.SHIFENLV) * 100;
//                tm.SHIFENLV = cclv.toFixed(2) + '%';
//                tm.TIGAN = JSON.parse(tm.TIGAN);
//                if(tm.TIXING_ID <= 3){
//                  var daanArr = tm.DAAN.split(','),
//                    daanLen = daanArr.length,
//                    daan = [];
//                  for(var i = 0; i < daanLen; i++){
//                    daan.push(letterArr[daanArr[i]]);
//                  }
//                  tm.DAAN = daan.join(',');
//                }
//                else if(tm.TIXING_ID == 4){
//                  if(tm.DAAN == 1){
//                    tm.DAAN = '对';
//                  }
//                  else{
//                    tm.DAAN = '错';
//                  }
//                }
//                else if(tm.TIXING_ID == 6){ //填空题
//                  //修改填空题的答案
//                  var tkDaAnArr = [],
//                    tkDaAn = JSON.parse(tm.DAAN),
//                    tkDaAnStr;
//                  _.each(tkDaAn, function(da, idx, lst){
//                    tkDaAnArr.push(da.answer);
//                  });
//                  tkDaAnStr = tkDaAnArr.join(';');
//                  tm.DAAN = tkDaAnStr;
//                  //修改填空题的题干
//                  newCont = tm.TIGAN.tiGan.replace(tgReg, function(arg) {
//                    var text = arg.slice(2, -2),
//                      textJson = JSON.parse(text),
//                      _len = textJson.size,
//                      i, xhStr = '';
//                    for(i = 0; i < _len; i ++ ){
//                      xhStr += '_';
//                    }
//                    return xhStr;
//                  });
//                  tm.TIGAN.tiGan = newCont;
//                }
//                else{
//
//                }
//              });
//              $scope.tjTmQuantity = 5; //加载是显示的题目数量
//              $scope.letterArr = config.letterArr; //题支的序号
//              $scope.tjTiMuDetail = data;
//            }
//            else{
//              messageService.alertInfFun('err', data.error);
//            }
//          });
//          $scope.tjItemName = tjNamePara;
//          $scope.isTjDetailShow = true;
////          $scope.myAvgScore = '';
//          $scope.tjSubTpl = 'views/tongji/tj_sj_detail.html';
//        };

        /**
         * 显示更多试卷统计详情
         */
        $scope.showTjSjMoreDetail = function(){
          if($scope.tjTiMuDetail){
            $scope.tjTmQuantity = $scope.tjTiMuDetail.length; //加载是显示的题目数量
          }
        };

        /**
         * 由统计详情返回列表
         */
        $scope.tjDetailToList = function(){
          $rootScope.isHaveBg = false;
          if($scope.tj_tabActive == 'kaoshiTj'){ //考试统计的返回按钮
            $scope.showKaoShiTjList();
          }
          if($scope.tj_tabActive == 'kaoshengTj'){ //考生统计的返回按钮
            $scope.showKaoShengTjList();
          }
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
        //$scope.lastKaoShiTongJi = function(){
        //  if(tjKaoShiData.length){
        //    $scope.tjData = tjKaoShiData.slice(0, 10);
        //    $scope.tjShowStudentInfo(tjKaoShiData[0].KAOSHI_ID, 'ksId', 'ksList', tjKaoShiData[0].KAOSHI_MINGCHENG);
        //  }
        //  else{
        //    $http.get(queryKaoShi).success(function(data){
        //      if(!data.error){
        //        $scope.tjData = data.slice(0, 10);
        //        $scope.tjShowStudentInfo(data[0].KAOSHI_ID, 'ksId', 'ksList', data[0].KAOSHI_MINGCHENG);
        //      }
        //      else{
        //        messageService.alertInfFun('err', data.error);
        //      }
        //    });
        //  }
        //};

        /**
         * 上次试卷统计
         */
        //$scope.lastShiJuanTongJi = function(){
        //  if(tjShiJuanData.length){
        //    $scope.tjData = tjShiJuanData.slice(0, 10);
        //    $scope.tjShowStudentInfo(tjShiJuanData[0].SHIJUAN_ID, 'sjId', 'sjList', tjShiJuanData[0].SHIJUAN_MINGCHENG);
        //  }
        //  else{
        //    $http.get(queryShiJuan).success(function(data){
        //      if(!data.error){
        //        data = _.sortBy(data, function(sj){
        //          return sj.LAST_TIME;
        //        }).reverse();
        //        $scope.tjData = data.slice(0, 10);
        //        $scope.tjShowStudentInfo(data[0].SHIJUAN_ID, 'sjId', 'sjList', data[0].SHIJUAN_MINGCHENG);
        //      }
        //      else{
        //        messageService.alertInfFun('err', data.error);
        //      }
        //    });
        //  }
        //};

        /**
         * 统计函数，饼图加柱状图
         */
        var chartFunPieAndBar = function(cont1, cont2, cont3){
          var chartPie = cont1,
            chartBar = cont2,
            chartLine = cont3;
          var optPie = { // 饼状图图
              tooltip : {
                trigger : 'item',
                formatter : "{a} <br/>{b} : {c} ({d}%)"
              },
              legend : {
                orient : 'vertical',
                x : 'left',
                //data : '' //数组
                data : ['不及格', '差', '中', '良', '优']
              },
              calculable : true,
              series : [{
                name : '成绩等级',
                type : 'pie',
                radius : '55%',
                center: ['50%', '50%'],
                itemStyle : {
                  normal : {
                    label : {
                      position : 'outter',
                      formatter: '{b}:{d}%'
                    },
                    labelLine : {
                      show : true
                    }
                  }
                },
                data : tjPieData
              }]
            },
            optBar = {
              tooltip : {
                trigger : 'axis',
                axisPointer : {
                  type : 'shadow'
                }
              },
              legend : {
                data : ['班级平均分']
              },
              calculable : true,
              xAxis : [{
                type : 'category',
                data : [] //此处为变量表示班级数据
              }],
              yAxis : [{
                type : 'value',
                splitArea : {
                  show : true
                }
              }],
              grid : {
                x : 30,
                x2 : 30,
                y : 30
              },
              dataZoom : {
                show : true,
                realtime : true,
                start : 0,
                end : '' //此处为变量，是下面表示拖拽的功能
              },
              series : [{
                name : '班级平均分',
                type : 'bar',
                //barWidth: 30, //柱子的宽度
                itemStyle : {
                  normal: {
                    label : {show: true, position: 'top'},
                    color:'#7FB06B' //柱子的颜色
                  }
                },
                data : [], //此处为变量
                markLine : { //平均值直线
                  itemStyle:{
                    normal:{
                      color:'#9F79EE'
                    }
                  },
                  data : [
                    [
                      {name: '平均值起点', xAxis: -1, yAxis: $scope.singleKaoShi.ksAvgScore, value: $scope.singleKaoShi.ksAvgScore},
                      {name: '平均值终点', xAxis: 1000, yAxis: $scope.singleKaoShi.ksAvgScore}
                    ]
                  ]
                }
              }]
            },
            optLine = {
              tooltip : {
                trigger: 'axis',
                formatter: function (params,ticket,callback) {
                  return params.seriesName + '</br>' + params.data[0] + '分：' +  params.data[1] + '人';
                }
              },
              legend: {
                data:['所有考生','本班考生']
              },
              grid : {
                x : 40,
                x2 : 30,
                y : 30,
                y2 : 30
              },
              calculable : true,
              xAxis : [
                {
                  type : 'value',
                  scale:true,
                  axisLabel : {
                    formatter: '{value}分'
                  }
                }
              ],
              yAxis : [
                {
                  type : 'value',
                  scale:false,
                  axisLabel : {
                    formatter: '{value}人'
                  }
                }
              ],
              series : [
                {
                  name: '所有考生',
                  type: 'line',
                  data: tjLineData
                },
                {
                  name: '本班考生',
                  type: 'line',
                  data: []
                }
              ]
            };
          tjBarData = _.sortBy(tjBarData, function(bj){return -bj.bjAvgScore;});
          _.each(tjBarData, function(bj, idx, lst){
            optBar.xAxis[0].data.push(bj.bjName);
            optBar.series[0].data.push(bj.bjAvgScore);
          });
          if(tjBarData.length <= 5){
            optBar.dataZoom.end = 100;
          }
          else{
            optBar.dataZoom.end = (5 / tjBarData.length) * 100;
          }
          chartPie.setOption(optPie);
          chartBar.setOption(optBar);
          chartLine.setOption(optLine);
          //chartPie.connect(chartBar);
          //chartBar.connect(chartPie);
          $timeout(function (){
            window.onresize = function () {
              chartPie.resize();
              chartBar.resize();
              chartLine.resize();
            }
          }, 200);
          function eConsole(param) {
            console.log(param);
          }
          chartBar.on(echarts.config.EVENT.CLICK, eConsole);
        };

        /**
         * 分数统计，chart形状
         */
        //$scope.showScoreChart = function(){
        //  $scope.tjSubTpl = 'views/tongji/tj_chart_score.html';
        //  var cont1, cont2,
        //    addActiveFun = function() {
        //      cont1 = echarts.init(document.getElementById('score1'));
        //      cont2 = echarts.init(document.getElementById('score2'));
        //      chartFunPieAndBar(cont1, cont2);
        //    };
        //  $timeout(addActiveFun, 500);
        //};

        /**
         * 点击图形下面的考试或试卷名称，显示相应的统计信息
         */
        //$scope.showDiffScoreChart = function(id, idType){
        //  var queryKaoSheng, totalScore, avgScore, cont1, cont2;
        //  tjPieData = [ //饼状图学生信息
        //    {
        //      name : '不及格',
        //      value : 0
        //    },
        //    {
        //      name : '及格',
        //      value : 0
        //    },
        //    {
        //      name : '良',
        //      value : 0
        //    },
        //    {
        //      name : '优',
        //      value : 0
        //    }
        //  ];
        //  tjBarData = [0, 0, 0, 0];
        //  if(idType == 'ksId'){
        //    queryKaoSheng = queryKaoShengBase + '&kaoshiid=' + id;
        //    _.each($scope.tjChartNav, function(tjd, idx, lst){
        //      if(tjd.KAOSHI_ID == id){
        //        $scope.activeIdx = idx;
        //      }
        //    });
        //  }
        //  if(idType == 'sjId'){
        //    queryKaoSheng = queryKaoShengBase + '&shijuanid=' + id;
        //    _.each($scope.tjChartNav, function(tjd, idx, lst){
        //      if(tjd.SHIJUAN_ID == id){
        //        $scope.activeIdx = idx;
        //      }
        //    });
        //  }
        //  $http.get(queryKaoSheng).success(function(data){
        //    if(!data.error){
        //      //求平均分
        //      totalScore = _.reduce(data, function(memo, stu){ return memo + stu.ZUIHOU_PINGFEN; }, 0);
        //      avgScore = totalScore/data.length;
        //      $scope.myAvgScore = avgScore.toFixed(1);
        //      //分数详细统计用到的数据
        //      _.each(data, function(stuScore, idx, lst){
        //        if(stuScore.ZUIHOU_PINGFEN < 60){
        //          tjPieData[0].value ++;
        //          tjBarData[0] ++;
        //        }
        //        if(stuScore.ZUIHOU_PINGFEN >= 60 && stuScore.ZUIHOU_PINGFEN < 80){
        //          tjPieData[1].value ++;
        //          tjBarData[1] ++;
        //        }
        //        if(stuScore.ZUIHOU_PINGFEN >= 80 && stuScore.ZUIHOU_PINGFEN < 90){
        //          tjPieData[2].value ++;
        //          tjBarData[2] ++;
        //        }
        //        if(stuScore.ZUIHOU_PINGFEN >= 90){
        //          tjPieData[3].value ++;
        //          tjBarData[3] ++;
        //        }
        //      });
        //      cont1 = echarts.init(document.getElementById('score1'));
        //      cont2 = echarts.init(document.getElementById('score2'));
        //      chartFunPieAndBar(cont1, cont2);
        //    }
        //    else{
        //      messageService.alertInfFun('err', data.error);
        //    }
        //  });
        //};

        /**
         * 重新加载mathjax
         */
        $scope.$on('onRepeatLast', function(scope, element, attrs){
          $('.reloadMath').click();
        });

        /**
         * 数据排序
         */
        $scope.ksSortDataFun = function(sortItem){
          switch (sortItem){
            case 'stuId' : //学号排序
              if($scope.tjParas.stuIdCount){
                $scope.tjKaoShengDetail = _.sortBy($scope.tjKaoShengDetail, function(stu){
                  return stu.YONGHUHAO;
                });
                $scope.tjParas.stuIdCount = false;
              }
              else{
                $scope.tjKaoShengDetail = _.sortBy($scope.tjKaoShengDetail, function(stu){
                  return stu.YONGHUHAO;
                }).reverse();
                $scope.tjParas.stuIdCount = true;
              }
              break;
            case 'name' : //姓名排序，中文
              if($scope.tjParas.nameCount){
                $scope.tjKaoShengDetail.sort(function(a,b){
                  return a.XINGMING.localeCompare(b.XINGMING);
                });
                $scope.tjParas.nameCount = false;
              }
              else{
                $scope.tjKaoShengDetail.sort(function(a,b){
                  return a.XINGMING.localeCompare(b.XINGMING);
                }).reverse();
                $scope.tjParas.nameCount = true;
              }
              break;
            case 'class' : //班级排序，中文
              if($scope.tjParas.classCount){
                $scope.tjKaoShengDetail.sort(function(a,b){
                  return a.BANJI.localeCompare(b.BANJI);
                });
                $scope.tjParas.classCount = false;
              }
              else{
                $scope.tjKaoShengDetail.sort(function(a,b){
                  return a.BANJI.localeCompare(b.BANJI);
                }).reverse();
                $scope.tjParas.classCount = true;
              }
              break;
            case 'score' : //分数排序
              if($scope.tjParas.scoreCount){
                $scope.tjKaoShengDetail = _.sortBy($scope.tjKaoShengDetail, function(stu){
                  return stu.ZUIHOU_PINGFEN;
                });
                $scope.tjParas.scoreCount = false;
              }
              else{
                $scope.tjKaoShengDetail = _.sortBy($scope.tjKaoShengDetail, function(stu){
                  return stu.ZUIHOU_PINGFEN;
                }).reverse();
                $scope.tjParas.scoreCount = true;
              }
              break;
          }
        };

        /**
         * 导出学生
         */
        $scope.exportKsInfo = function(){
          var ksData = {
              token: token,
              sheetName: $scope.tjItemName + '考生信息',
              data: ''
            },
            ksArr = [];
          ksArr.push({col1: '学号', col2: '姓名', col3: '班级', col4: '成绩'});
          _.each($scope.tjKaoShengDetail, function(ks){
            var ksObj = {YONGHUHAO: '', XINGMING: '', BANJI: '', ZUIHOU_PINGFEN: ''};
            ksObj.YONGHUHAO = ks.YONGHUHAO;
            ksObj.XINGMING = ks.XINGMING;
            ksObj.BANJI = ks.BANJI;
            ksObj.ZUIHOU_PINGFEN = ks.ZUIHOU_PINGFEN;
            ksArr.push(ksObj);
          });
          ksData.data = JSON.stringify(ksArr);
          $http.post(exportStuInfoUrl, ksData).success(function(data){
            var downloadTempFile = downloadTempFileBase + data.filename,
              aLink = document.createElement('a'),
              evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
            aLink.href = downloadTempFile; //url
            aLink.dispatchEvent(evt);
          });
        };

        /**
         * 作答重现
         */
        $scope.zuoDaReappear = function(ksId){
          var answerReappearUrl, dataDis, tmVal,
            finaData = {
              sj_name: '',
              sj_tm: []
            };
          if(ksId){
            answerReappearUrl = answerReappearBaseUrl + '&kaoshengid=' + ksId;
            if($scope.tjParas.zdcxKaoShiId){
              answerReappearUrl += '&kaoshiid=' + $scope.tjParas.zdcxKaoShiId;
              $http.get(answerReappearUrl).success(function(data){
                if(data && data.length > 0){
                  finaData.sj_name = data[0].SHIJUAN_MINGCHENG;
                  dataDis = _.groupBy(data, 'TIXING_ID');
                  _.each(dataDis, function(val, key, list){
                    var dObj = {
                      tx_id: key,
                      tx_name: val[0].DATIMINGCHENG,
                      tm: ''
                    };
                    tmVal = _.each(val, function(tm, idx, lst){
                      if(typeof(tm.TIGAN) == 'string'){
                        tm.TIGAN = JSON.parse(tm.TIGAN);
                      }
                      messageService.formatDaAn(tm);
                    });
                    dObj.tm = tmVal;
                    finaData.sj_tm.push(dObj);
                  });
                  $scope.kaoShengShiJuan = finaData;
                  $scope.showKaoShengShiJuan = false;
                }
                else{
                  messageService.alertInfFun('err', data.error || '没有数据！');
                }
              });
            }
          }
          else{
            messageService.alertInfFun('pmt', '缺少考生ID');
          }
        };

        /**
         *关闭作答重现试卷层
         */
        $scope.closeZuoDaReappear = function(){
          $scope.showKaoShengShiJuan = true;
        };

        /**
         * 显示考试统计的首页
         */
        $scope.tjShowKaoShiChart = function(ks){
          var queryKaoSheng,
            totalScore = 0, //考试总分
            avgScore, //本次考试的平均分
            disByBanJi, //按班级分组obj
            banJiArray = [], //最终班级数组
            disByScore; //按分数分组
          tjLineData = [];
          $scope.tjParas.selectBanJi = '所有班级';
          //$scope.kaoShengShiJuan = '';
          queryKaoSheng = queryKaoShengBase + '&kaoshiid=' + ks.KAOSHI_ID;
          tjPieData = [ //饼状图学生信息
            {
              name : '不及格',
              value : 0
            },
            {
              name : '差',
              value : 0
            },
            {
              name : '中',
              value : 0
            },
            {
              name : '良',
              value : 0
            },
            {
              name : '优',
              value : 0
            }
          ];
          $http.get(queryKaoSheng).success(function(data){
            if(!data.error){
              $scope.tjKaoShengDetail = data;
              /* 按班级分组统计数据，用在按班级统计柱状图中 */
              disByBanJi = _.groupBy(data, function(stu){
                if(!stu.BANJI){
                  stu.BANJI = '其他';
                }
                return stu.BANJI;
              });
              //重组数据改变数据形式，最终存储在banJiArray里
              _.each(disByBanJi, function(v, k, l){
                var banJiObj = {
                  bjName: '',
                  bjStu: '',
                  bjAvgScore: ''
                };
                banJiObj.bjName = k;
                banJiObj.bjStu = v;
                banJiObj.bjAvgScore = (_.reduce(v, function(memo, stu){ return memo + stu.ZUIHOU_PINGFEN; }, 0) / v.length).toFixed(1);
                totalScore += parseInt(banJiObj.bjAvgScore);
                banJiArray.push(banJiObj);
                //饼图用到的数据，全部学生
                _.each(v, function(stuScore, idx, lst){
                  if(stuScore.ZUIHOU_PINGFEN < 60){
                    tjPieData[0].value ++;
                  }
                  if(stuScore.ZUIHOU_PINGFEN >= 60 && stuScore.ZUIHOU_PINGFEN < 70){
                    tjPieData[1].value ++;
                  }
                  if(stuScore.ZUIHOU_PINGFEN >= 70 && stuScore.ZUIHOU_PINGFEN < 80){
                    tjPieData[2].value ++;
                  }
                  if(stuScore.ZUIHOU_PINGFEN >= 80 && stuScore.ZUIHOU_PINGFEN < 90){
                    tjPieData[3].value ++;
                  }
                  if(stuScore.ZUIHOU_PINGFEN >= 90){
                    tjPieData[4].value ++;
                  }
                });
              });
              avgScore = totalScore / banJiArray.length;
              if(avgScore == 0){
                ks.ksAvgScore = 0;
              }
              else{
                ks.ksAvgScore = avgScore.toFixed(1);
              }
              ks.sjNum = ks.SHIJUAN.length;
              tjBarData = banJiArray;
              ks.BANJIs = banJiArray;
              $scope.singleKaoShi = ks;
              $scope.tjBanJi = banJiArray.slice(0, 5);
              $scope.tjPages.tjBjNum = 0;
              $scope.tjParas.tjBjLen = Math.ceil(banJiArray.length / 5);
              $scope.tjParas.lastSelectBj = {
                pageNum: 0,
                banJiIdx: 0
              };
              /* 按分数分组统计数据，用在按分数和人数统计的折线图中 */
              disByScore = _.groupBy(data, function(stu){return stu.ZUIHOU_PINGFEN});
              _.each(disByScore, function(v, k, l){
                var ary = [];
                ary[0] = parseInt(k);
                ary[1] = v.length;
                tjLineData.push(ary);
              });
            }
            else{
              messageService.alertInfFun('err', data.error);
            }
          });
          $rootScope.isHaveBg = true;
          $scope.tj_tabActive = 'kaoshiTj';
          $scope.tjSubTpl = 'views/tongji/tj_ks_chart.html';
          //考生统计图表
          var cont1, cont2, cont3, addActiveFun;
          addActiveFun = function() {
            cont1 = echarts.init(document.getElementById('chartPie'));
            cont2 = echarts.init(document.getElementById('chartBar'));
            cont3 = echarts.init(document.getElementById('chartLine'));
            chartFunPieAndBar(cont1, cont2, cont3);
          };
          $timeout(addActiveFun, 500);
        };

        /**
         * 班级列表分页
         */
        $scope.banJiPage = function(direction){
          if(direction == 'down'){
            $scope.tjPages.tjBjNum ++;
            if($scope.tjPages.tjBjNum < $scope.tjParas.tjBjLen){
              $scope.tjBanJi = $scope.singleKaoShi.BANJIs.slice($scope.tjPages.tjBjNum * 5, ($scope.tjPages.tjBjNum + 1) * 5);
            }
            else{
              $scope.tjPages.tjBjNum = $scope.tjParas.tjBjLen - 1;
            }
          }
          else{
            $scope.tjPages.tjBjNum --;
            if($scope.tjPages.tjBjNum >= 0){
              $scope.tjBanJi = $scope.singleKaoShi.BANJIs.slice($scope.tjPages.tjBjNum * 5, ($scope.tjPages.tjBjNum + 1) * 5);
            }
            else{
              $scope.tjPages.tjBjNum = 0;
            }
          }
          if($scope.tjParas.lastSelectBj.pageNum == $scope.tjPages.tjBjNum){
            var timeCount = function() {
              $('.banJiUl li').eq($scope.tjParas.lastSelectBj.banJiIdx).addClass('active');
            };
            $timeout(timeCount, 20);
          }
        };

        /**
         * 通过班级统计
         */
        $scope.tjByBanJi = function(bj, event, idx){
          $('.banJiUl li').removeClass('active');
          $(event.target).closest('li').addClass('active');
          $scope.tjParas.lastSelectBj = {
            pageNum: $scope.tjPages.tjBjNum,
            banJiIdx: idx
          };
          if(bj == 'all'){
            $scope.tjParas.selectBanJi = '所有班级';
          }
          else{
            $scope.tjParas.selectBanJi = bj.bjName;

          }
        }

      }]);
});
