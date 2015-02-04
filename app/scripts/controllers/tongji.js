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
          //tjDataPara = '', //存放目前统计的是什么数据
          //tjIdType = '', //存放ID类型
          //tjNamePara = '', //存放统计名称
          tjParaObj = {}, //存放统计参数的Object
          //tjPieDataBanJi = [], //饼状图数据，单个班级
          tjBarData = [], //柱状图数据
          //tjLineData = [], //折线图数据
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
         * 试卷统计详情
         */
        $scope.tjShowItemInfo = function(id, idType, comeForm, tjName){
          var queryTiMu, newCont,
            tgReg = new RegExp('<\%{.*?}\%>', 'g');
          //tjDataPara = '';
          //tjIdType = '';
          //tjNamePara = '';
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
                //tjDataPara = id;
                //tjIdType = idType;
                //tjNamePara = tjName;
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
         * 统计函数，饼图加柱状图
         */
        var chartFunPieAndBar = function(kind){
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
                data : ''
                //data : kind = 'all' ? tjParaObj.pieDataAll : tjParaObj.pieDataBanJi
                //data : tjPieData
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
                  data: tjParaObj.lineDataAll
                },
                {
                  name: '本班考生',
                  type: 'line',
                  data: tjParaObj.lineDataBanJi || ''
                }
              ]
            };
          //饼状图数据
          if(kind == 'all'){
            optPie.series[0].data = tjParaObj.pieDataAll;
          }
          else{
            optPie.series[0].data = tjParaObj.pieDataBanJi;
          }
          //柱状图数据
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
          tjParaObj.pieBox.setOption(optPie);
          tjParaObj.barBox.setOption(optBar);
          tjParaObj.lineBox.setOption(optLine);
          //chartPie.connect(chartBar);
          //chartBar.connect(chartPie);
          $timeout(function (){
            window.onresize = function () {
              tjParaObj.pieBox.resize();
              tjParaObj.barBox.resize();
              tjParaObj.lineBox.resize();
            }
          }, 200);
          function eConsole(param) {
            console.log(param);
          }
          tjParaObj.barBox.on(echarts.config.EVENT.CLICK, eConsole);
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
            disByScore, //按分数分组
            tjPieDataAll = [ //饼状图学生信息，全部学生
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
          //tjLineData = [];
          $scope.tjParas.selectBanJi = '所有班级';
          queryKaoSheng = queryKaoShengBase + '&kaoshiid=' + ks.KAOSHI_ID;
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
                //饼图用到的数据，全部班级
                _.each(v, function(stuScore, idx, lst){
                  if(stuScore.ZUIHOU_PINGFEN < 60){
                    tjPieDataAll[0].value ++;
                  }
                  if(stuScore.ZUIHOU_PINGFEN >= 60 && stuScore.ZUIHOU_PINGFEN < 70){
                    tjPieDataAll[1].value ++;
                  }
                  if(stuScore.ZUIHOU_PINGFEN >= 70 && stuScore.ZUIHOU_PINGFEN < 80){
                    tjPieDataAll[2].value ++;
                  }
                  if(stuScore.ZUIHOU_PINGFEN >= 80 && stuScore.ZUIHOU_PINGFEN < 90){
                    tjPieDataAll[3].value ++;
                  }
                  if(stuScore.ZUIHOU_PINGFEN >= 90){
                    tjPieDataAll[4].value ++;
                  }
                });
                tjParaObj.pieDataAll = tjPieDataAll; //饼图统计数据，全部班级考生
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
              tjParaObj.lineDataAll = [];
              disByScore = _.groupBy(data, function(stu){return stu.ZUIHOU_PINGFEN});
              _.each(disByScore, function(v, k, l){
                var ary = [];
                ary[0] = parseInt(k);
                ary[1] = v.length;
                tjParaObj.lineDataAll.push(ary);
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
          var addActiveFun = function() {
              tjParaObj.pieBox = echarts.init(document.getElementById('chartPie'));
              tjParaObj.barBox = echarts.init(document.getElementById('chartBar'));
              tjParaObj.lineBox = echarts.init(document.getElementById('chartLine'));
              chartFunPieAndBar('all');
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
          var tjPieDataBanJi = [ //饼状图学生信息，单个班级
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
            ],
            disByScore;
          $('.banJiUl li').removeClass('active');
          $(event.target).closest('li').addClass('active');
          $scope.tjParas.lastSelectBj = {
            pageNum: $scope.tjPages.tjBjNum,
            banJiIdx: idx
          };
          if(bj == 'all'){
            $scope.tjParas.selectBanJi = '所有班级';
            tjParaObj.lineDataBanJi = [];
            //饼图数据，单个班级
            var addActiveFunAll = function() {
              chartFunPieAndBar('all');
            };
            $timeout(addActiveFunAll, 500);
          }
          else{
            $scope.tjParas.selectBanJi = bj.bjName;
            //饼状图数据，单个班级
            _.each(bj.bjStu, function(stuScore, idx, lst){
              if(stuScore.ZUIHOU_PINGFEN < 60){
                tjPieDataBanJi[0].value ++;
              }
              if(stuScore.ZUIHOU_PINGFEN >= 60 && stuScore.ZUIHOU_PINGFEN < 70){
                tjPieDataBanJi[1].value ++;
              }
              if(stuScore.ZUIHOU_PINGFEN >= 70 && stuScore.ZUIHOU_PINGFEN < 80){
                tjPieDataBanJi[2].value ++;
              }
              if(stuScore.ZUIHOU_PINGFEN >= 80 && stuScore.ZUIHOU_PINGFEN < 90){
                tjPieDataBanJi[3].value ++;
              }
              if(stuScore.ZUIHOU_PINGFEN >= 90){
                tjPieDataBanJi[4].value ++;
              }
            });
            tjParaObj.pieDataBanJi = tjPieDataBanJi;
            //折线图，班级数据
            tjParaObj.lineDataBanJi = [];
            disByScore = _.groupBy(bj.bjStu, function(stu){return stu.ZUIHOU_PINGFEN});
            _.each(disByScore, function(v, k, l){
              var ary = [];
              ary[0] = parseInt(k);
              ary[1] = v.length;
              tjParaObj.lineDataBanJi.push(ary);
            });
            //饼图数据
            var addActiveFunBanJi = function() {
              chartFunPieAndBar();
            };
            $timeout(addActiveFunBanJi, 500);
          }
        };

    }]);
});
