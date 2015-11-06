define(['angular', 'config', 'charts', 'mathjax', 'jquery', 'lazy'],
  function (angular, config, charts, mathjax, $, lazy) {
  'use strict';
  angular.module('kaoshiApp.controllers.TongjiCtrl', [])
    .controller('TongjiCtrl', ['$rootScope', '$scope', '$http', '$timeout', 'DataService',
      function ($rootScope, $scope, $http, $timeout, DataService) {
        /**
         * 操作title
         */
        $rootScope.isRenZheng = false; //判读页面是不是认证

        /**
         * 声明变量
         */
        var userInfo = $rootScope.session.userInfo;
        var baseKwAPIUrl = config.apiurl_kw; //考务的api
        var baseTjAPIUrl = config.apiurl_tj; //统计的api
        var token = config.token;
        var caozuoyuan = userInfo.UID;//登录的用户的UID
        var jigouid = userInfo.JIGOU[0].JIGOU_ID;
        var lingyuid = $rootScope.session.defaultLyId;
        //var queryKaoShi = baseTjAPIUrl + 'query_kaoshi?token=' + token + '&caozuoyuan=' + caozuoyuan
        //    + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid; //查询考试数据
        var queryKaoShengBase = baseTjAPIUrl + 'query_kaosheng?token=' + token; //查询考生数据
        var queryZsdBase = baseTjAPIUrl + 'query_zhishidian?token=' + token; //查询带分数的知识点
        var qryKaoShiByXueHaoBase = baseTjAPIUrl + 'query_kaoshi_by_xuehao?token=' + token + '&jigouid=' + jigouid
            + '&lingyuid=' + lingyuid + '&xuehao='; //查询考试通过考生学号
        var dataNumOfPerPage = 10; //每页显示多少条数据
        var paginationLength = 11; //分页部分，页码的长度，目前设定为11
        var pagesArr = []; //定义考试页码数组
        var tjNeedData = []; //存放查询出来的统计数数据
        var lastPage; //符合条件的考试一共有多少页
        var tjParaObj = {
            pieBoxAll: '',
            pieBoxBj: '',
            barBox: '',
            lineBox: '',
            radarBox: '',
            pieData: '',
            lineDataAll: '',
            lineDataBanJi: ''
          }; //存放统计参数的Object
        var tjBarData = []; //柱状图数据
        var exportStuInfoUrl = baseTjAPIUrl + 'export_to_excel'; //导出excel名单
        var downloadTempFileBase = config.apiurl_tj_ori + 'download_temp_file/';
        var answerReappearBaseUrl = baseTjAPIUrl + 'answer_reappear?token=' + token; //作答重现的url
        var tjKaoShiIds = []; //查询考试数据用到的存放考试ID的数组
        var qryItemDeFenLvBase = baseTjAPIUrl + 'query_timu_defenlv?token=' + token + '&kaoshiid='; //查询每道题目的得分率
        var itemDeFenLv = ''; //存放考生得分率的变量
        var qryKaoShiZuListUrl = baseKwAPIUrl + 'query_kaoshizu_liebiao?token=' + token + '&caozuoyuan='
          + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid; //查询考试列表的url
        var chaXunKaoShiZuDetailUrl = baseKwAPIUrl + 'query_kaoshizu_detail?token=' + token + '&caozuoyuan=' +
          caozuoyuan + '&kszid='; //查询考试组详情
        var queryKaoShiZuTongJi = baseTjAPIUrl + 'query_kaoshizu_tongji'; //查询统计数据

        $scope.tjKaoShiList = []; //试卷列表
        $scope.tjParas = { //统计用到的参数
          stuIdCount: true,
          nameCount: true,
          classCount: true,
          scoreCount: true,
          zdcxKaoShiId: '', //作答重现用到的考试id
          letterArr: config.letterArr, //题支的序号
          cnNumArr: config.cnNumArr, //汉语的大写数字
          tjBjPgOn: 0, //统计用到的当前班级页码
          tjBjPgLen: 0, //统计用到的班级总分页数
          selectBanJi: '', //当前选中的班级
          lastSelectBj: {
            pageNum: 0,
            banJiIdx: 0
          }, //最后选中的班级
          allStudents: '',
          zsdOriginData: '', //统计——存放知识点原始数据的变量
          zsdIdArr: '',
          selectedKaoShi: [], //统计时存放已选择的考试
          studentUid: '', //存放考生UID的字段，用于考生统计
          tongJiType: 'keXuHao',
          youXiuFenZhi: 85,
          jiGeFenZhi: 60
        };

        /**
         * 判断是否为数组
         */
        var isArray = function (obj) {
          return obj instanceof Array;
        };

        /**
         * 显示考试统计列表
         */
        $scope.showKaoShiTjList = function(){
          //var kaoShiZuDist;
          //var kaoShiState = [0, 1, 2, 3, 4, 5, 6];
          var kaoShiState = [3, 4, 5, 6];
          if(!($scope.tjKaoShiList && $scope.tjKaoShiList.length > 0)){
            $scope.loadingImgShow = true;
            pagesArr = [];
            tjNeedData = [];
            var qryKaoShiZuList = qryKaoShiZuListUrl + '&zhuangtai=' + kaoShiState;
            $http.get(qryKaoShiZuList).success(function(data) {
              if(data && data.length > 0){
                //kaoShiZuDist = Lazy(data).groupBy(function(ks, idx, lst){
                //  if(!ks.KAOSHIZU_ID){
                //    ks.KAOSHIZU_ID = 'others';
                //    ks.KAOSHIZU_NAME = '其他';
                //  }
                //  return ks.KAOSHIZU_ID;
                //}).toObject();
                //Lazy(kaoShiZuDist).each(function(v, k, lst){
                //  var ksz = {
                //    KAOSHI_MINGCHENG: '',
                //    kaoshizu_id: k,
                //    kaoshiArray: '',
                //    KSRS: '',
                //    LEIXING: '',
                //    KAOSHI_ID: '',
                //    SHIJUAN: ''
                //  };
                //  var rsCont = 0;
                //  var kaoshiId = [];
                //  var shijuan = [];
                //  if(k == 'others'){
                //    Lazy(v).each(function(ks){
                //      tjNeedData.push(ks);
                //    });
                //  }
                //  else{
                //    ksz.KAOSHI_MINGCHENG = v[0].KAOSHIZU_NAME;
                //    ksz.LEIXING = v[0].LEIXING;
                //    Lazy(v).each(function(ks){
                //      rsCont += ks.KSRS;
                //      kaoshiId.push(ks.KAOSHI_ID);
                //      Lazy(ks.SHIJUAN).each(function(sj){
                //        var hasIn = Lazy(shijuan).find(function(osj){
                //          return osj.SHIJUAN_ID = sj.SHIJUAN_ID;
                //        });
                //        if(!hasIn){
                //          shijuan.push(sj);
                //        }
                //      });
                //    });
                //    ksz.KSRS = rsCont;
                //    ksz.KAOSHI_ID = kaoshiId.toString();
                //    ksz.SHIJUAN = shijuan;
                //    ksz.kaoshiArray = v;
                //    tjNeedData.push(ksz);
                //  }
                //});
                tjNeedData = data;
                lastPage = Math.ceil(tjNeedData.length/dataNumOfPerPage); //得到所有考试的页码
                $scope.lastPageNum = lastPage;
                for(var i = 1; i <= lastPage; i++){
                  pagesArr.push(i);
                }
                $scope.tjPaging();
              }
              else{
                DataService.alertInfFun('err', data.error)
              }
            });
          }
          $scope.tj_tabActive = 'kaoshiTj';
          $scope.isTjDetailShow = false;
          $scope.studentData = '';
          $scope.tjSubTpl = 'views/tongji/tj_ks.html';
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
          //$scope.tjKaoShiList = tjNeedData.slice((currentPage-1)*10, currentPage*10);
          var pageKsz = tjNeedData.slice((currentPage-1)*10, currentPage*10);
          if(pageKsz && pageKsz.length > 0){
            var pageKszId = Lazy(pageKsz).map(function(ksz){return ksz.KAOSHIZU_ID;}).join();
            var chaXunKaoShiZuDetail = chaXunKaoShiZuDetailUrl + pageKszId;
            $http.get(chaXunKaoShiZuDetail).success(function(data){
              if(data && data.length > 0){
                $scope.tjKaoShiList = Lazy(data).reverse().toArray();
              }
              else{
                DataService.alert('err', data.error);
              }
              $scope.loadingImgShow = false; //kaoShiList.html
            });
          }
        };

        /**
         * 显示考生首页
         */
        $scope.showKaoShengTjList = function(){
          $scope.tj_tabActive = 'kaoshengTj';
          $scope.studentData = '';
          $scope.tjKaoShiData = '';
          $scope.tjSubTpl = 'views/tongji/tj_student.html';
        };

        /**
         * 初始化运行的程序
         */
        $scope.showKaoShiTjList();

        /**
         * 试卷统计详情
         */
        //$scope.tjShowItemInfo = function(id, idType, comeForm, tjName){
        //  var queryTiMu, newCont,
        //    tgReg = new RegExp('<\%{.*?}\%>', 'g');
        //  if(idType == 'ksId'){
        //    queryTiMu = queryTiMuBase + '&kaoshiid=' + id;
        //  }
        //  if(idType == 'sjId'){
        //    queryTiMu = queryTiMuBase + '&shijuanid=' + id;
        //  }
        //  $http.get(queryTiMu).success(function(data){
        //    if(!data.error){
        //      Lazy(data).each(function(tm, idx, lst){
        //        tm.TIGAN = JSON.parse(tm.TIGAN);
        //        if(tm.TIXING_ID <= 3){
        //          var daanArr = tm.DAAN.split(','),
        //            daanLen = daanArr.length,
        //            daan = [];
        //          for(var i = 0; i < daanLen; i++){
        //            daan.push(letterArr[daanArr[i]]);
        //          }
        //          tm.DAAN = daan.join(',');
        //        }
        //        else if(tm.TIXING_ID == 4){
        //          if(tm.DAAN == 1){
        //            tm.DAAN = '对';
        //          }
        //          else{
        //            tm.DAAN = '错';
        //          }
        //        }
        //        else if(tm.TIXING_ID == 6){ //填空题
        //          //修改填空题的答案
        //          var tkDaAnArr = [],
        //            tkDaAn = JSON.parse(tm.DAAN),
        //            tkDaAnStr;
        //          Lazy(tkDaAn).each(function(da, idx, lst){
        //            tkDaAnArr.push(da.answer);
        //          });
        //          tkDaAnStr = tkDaAnArr.join(';');
        //          tm.DAAN = tkDaAnStr;
        //          //修改填空题的题干
        //          newCont = tm.TIGAN.tiGan.replace(tgReg, function(arg) {
        //            var text = arg.slice(2, -2),
        //              textJson = JSON.parse(text),
        //              _len = textJson.size,
        //              i, xhStr = '';
        //            for(i = 0; i < _len; i ++ ){
        //              xhStr += '_';
        //            }
        //            return xhStr;
        //          });
        //          tm.TIGAN.tiGan = newCont;
        //        }
        //        else{
        //        }
        //        backToWhere = comeForm;
        //      });
        //      $scope.tjTmQuantity = 5; //加载是显示的题目数量
        //      $scope.letterArr = config.letterArr; //题支的序号
        //      $scope.tjTiMuDetail = data;
        //    }
        //    else{
        //      DataService.alertInfFun('err', data.error);
        //    }
        //  });
        //  $scope.tjItemName = tjName;
        //  $scope.isTjDetailShow = true;
        //  $scope.myAvgScore = '';
        //  $scope.tjSubTpl = 'views/tongji/tj_sj_detail.html';
        //};

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
          if($scope.tj_tabActive == 'kaoshiTj'){ //考试统计的返回按钮
            $scope.showKaoShiTjList();
          }
          if($scope.tj_tabActive == 'kaoshengTj'){ //考生统计的返回按钮
            $scope.showKaoShengTjList();
          }
        };

        /**
         * 数据排序
         */
        $scope.ksSortDataFun = function(sortItem){
          switch (sortItem){
            case 'stuId' : //学号排序
              if($scope.tjParas.stuIdCount){
                $scope.studentData = Lazy($scope.studentData).sortBy(function(stu){
                  return stu.YONGHUHAO;
                }).toArray();
                $scope.tjParas.stuIdCount = false;
              }
              else{
                $scope.studentData = Lazy($scope.studentData).sortBy(function(stu){
                  return stu.YONGHUHAO;
                }).toArray().reverse();
                $scope.tjParas.stuIdCount = true;
              }
              break;
            case 'name' : //姓名排序，中文
              if($scope.tjParas.nameCount){
                $scope.studentData.sort(function(a,b){
                  return a.XINGMING.localeCompare(b.XINGMING);
                });
                $scope.tjParas.nameCount = false;
              }
              else{
                $scope.studentData.sort(function(a,b){
                  return a.XINGMING.localeCompare(b.XINGMING);
                }).reverse();
                $scope.tjParas.nameCount = true;
              }
              break;
            case 'class' : //班级排序，中文
              if($scope.tjParas.classCount){
                $scope.studentData.sort(function(a,b){
                  return a.BANJI.localeCompare(b.BANJI);
                });
                $scope.tjParas.classCount = false;
              }
              else{
                $scope.studentData.sort(function(a,b){
                  return a.BANJI.localeCompare(b.BANJI);
                }).reverse();
                $scope.tjParas.classCount = true;
              }
              break;
            case 'xuhao' : //课序号排序
              if($scope.tjParas.stuIdCount){
                $scope.studentData = Lazy($scope.studentData).sortBy(function(stu){
                  return stu.XUHAO;
                }).toArray();
                $scope.tjParas.stuIdCount = false;
              }
              else{
                $scope.studentData = Lazy($scope.studentData).sortBy(function(stu){
                  return stu.XUHAO;
                }).toArray().reverse();
                $scope.tjParas.stuIdCount = true;
              }
              break;
            case 'score' : //分数排序
              if($scope.tjParas.scoreCount){
                $scope.studentData = Lazy($scope.studentData).sortBy(function(stu){
                  return stu.ZUIHOU_PINGFEN;
                }).toArray();
                $scope.tjParas.scoreCount = false;
              }
              else{
                $scope.studentData = Lazy($scope.studentData).sortBy(function(stu){
                  return stu.ZUIHOU_PINGFEN;
                }).toArray().reverse();
                $scope.tjParas.scoreCount = true;
              }
              break;
          }
        };

        /**
         * 导出学生,需要的数据为考生列表
         */
        $scope.exportKsInfo = function(stuData){
          var ksData = {
              token: token,
              sheetName: $scope.tjItemName + '考生信息',
              data: ''
            };
          var ksArr = [];
          var exportStu;
          ksArr.push({col1: '序号', col2: '学号', col3: '姓名', col4: '班级', col5: '课序号', col6: '成绩'});
          exportStu = Lazy(stuData).sortBy(function(stu){ return parseInt(stu.XUHAO);}).toArray();
          Lazy(exportStu).each(function(ks){
            var ksObj = {XUHAO: '', YONGHUHAO: '', XINGMING: '', BANJI: '', KEXUHAO: '', ZUIHOU_PINGFEN: ''};
            ksObj.XUHAO = ks.XUHAO;
            ksObj.YONGHUHAO = ks.YONGHUHAO;
            ksObj.XINGMING = ks.XINGMING;
            ksObj.BANJI = ks.BANJI;
            ksObj.KEXUHAO = ks.KEXUHAO;
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
         * 作答重现查询没道题目的得分率
         */
        var qryItemDeFenLv = function(ksId){
          var qryItemDeFenLvUrl = qryItemDeFenLvBase + ksId;
          itemDeFenLv = '';
          if(ksId){
            DataService.getData(qryItemDeFenLvUrl).then(function(data) {
              if(data && data.length > 0) {
                itemDeFenLv = data;
              }
            });
          }
          else{
            itemDeFenLv = '';
            DataService.alertInfFun('pmt', '缺少考试ID');
          }
        };

        /**
         * 作答重现
         */
        $scope.zuoDaReappear = function(studId, examId){
          var answerReappearUrl = answerReappearBaseUrl,
            dataDis, tmVal,
            finaData = {
              sj_name: '',
              sj_tm: []
            };
          if(studId){
            answerReappearUrl += '&kaoshengid=' + studId;
          }
          else{
            DataService.alertInfFun('pmt', '缺少考生UID');
            return;
          }
          if(examId){
            answerReappearUrl += '&kaoshiid=' + examId;
          }
          else{
            DataService.alertInfFun('pmt', '缺少考试ID');
            return;
          }
          DataService.getData(answerReappearUrl).then(function(data) {
            if(data && data.length > 0){
              finaData.sj_name = data[0].SHIJUAN_MINGCHENG;
              dataDis = Lazy(data).groupBy('DATI_XUHAO').toObject();
              Lazy(dataDis).each(function(val, key, list){
                var dObj = {
                  tx_id: key,
                  tx_name: val[0].DATIMINGCHENG,
                  tm: ''
                };
                Lazy(val).each(function(tm, idx, lst){
                  var findVal = Lazy(itemDeFenLv).find(function(item){return item.TIMU_ID == tm.TIMU_ID});
                  if(findVal){
                    tm.itemDeFenLv = (findVal.DEFENLV * 100).toFixed(1);
                  }
                  if(typeof(tm.TIGAN) == 'string'){
                    tm.TIGAN = JSON.parse(tm.TIGAN);
                  }
                  DataService.formatDaAn(tm);
                });
                dObj.tm = val;
                finaData.sj_tm.push(dObj);
              });
              $scope.showKaoShengList = false;
              $scope.kaoShengShiJuan = finaData;
            }
          });
        };

        /**
         * 关闭作答重新内容
         */
        $scope.closeZuoDaReappear = function(){
          $scope.showKaoShengList = true;
        };

        /**
         * 环形饼状图数据处理函数
         */
        //var pieDataDealFun = function(data){
        //  var pieDataArr = {
        //    allBj: {
        //      yxlv: '',
        //      jglv: ''
        //    },
        //    banji: {
        //      yxlv: '',
        //      jglv: ''
        //    }
        //  };
        //  pieDataArr.allBj.yxlv = 30;
        //  pieDataArr.allBj.jglv = 72;
        //  pieDataArr.banji.yxlv = 43;
        //  pieDataArr.banji.jglv = 77;
        //  return pieDataArr;
        //};

        /**
         * 折线图数据处理函数
         */
        var lineDataDealFun = function(data){
          var disByScore, lineDataArr = [];
          disByScore = Lazy(data).groupBy(function(item){return item.ZUIHOU_PINGFEN}).toObject();
          Lazy(disByScore).each(function(v, k, l){
            var ary = [];
            ary[0] = parseInt(k);
            ary[1] = v.length;
            lineDataArr.push(ary);
          });
          return lineDataArr;
        };

        /**
         * 统计函数
         */
        var chartShowFun = function(kind){
          var tj = tjParaObj.pieData; //统计数据
          var dataStyle = {
            normal: {
              label: {
                show: false,
                position : 'inner',
                formatter : function (params) {
                  return (params.percent - 0).toFixed(0) + '%';
                  //return params.name + (params.percent - 0).toFixed(0) + '%'
                },
                textStyle : {
                  fontSize : 14
                }
              },
              labelLine: {show:false}
            }
          };
          var placeHolderStyle = {
            normal : {
              color: 'rgba(0,0,0,0)',
              label: {show:false},
              labelLine: {show:false}
            },
            emphasis : {
              color: 'rgba(0,0,0,0)'
            }
          };
          var optPieAll = { // 环形图
            title: {
              text: '全部考生',
              subtext: '',
              sublink: '',
              x: 'center',
              y: 'center',
              itemGap: 20,
              textStyle : {
                color : 'rgba(30,144,255,0.8)',
                fontFamily : '微软雅黑',
                fontSize : 24,
                fontWeight : 'bolder'
              }
            },
            tooltip : {
              show: false,
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient : 'vertical',
              //x : document.getElementById('chartPie').offsetWidth / 2,
              x : '52%',
              y : 30,
              itemGap:12,
              data:['及格率:' + tj.KAOSHIZU.JGLV + '%', '优秀率:' + tj.KAOSHIZU.YXLV + '%']
            },
            toolbox: {
              show : false,
              feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
              }
            },
            series : [
              {
                name:'1',
                type:'pie',
                clockWise:false,
                radius : [100, 120],
                itemStyle : dataStyle,
                data:[
                  {
                    value: tj.KAOSHIZU.JGLV,
                    name: '及格率:' + tj.KAOSHIZU.JGLV + '%'
                  },
                  {
                    value: 100 - tj.KAOSHIZU.JGLV,
                    name:'invisible',
                    itemStyle : placeHolderStyle
                  }
                ]
              },
              {
                name:'2',
                type:'pie',
                clockWise:false,
                radius : [80, 100],
                itemStyle : dataStyle,
                data:[
                  {
                    value: tj.KAOSHIZU.YXLV,
                    name: '优秀率:' + tj.KAOSHIZU.YXLV + '%'
                  },
                  {
                    value: 100 - tj.KAOSHIZU.YXLV,
                    name:'invisible',
                    itemStyle : placeHolderStyle
                  }
                ]
              }
            ]
          };
          //var optPieBj = { // 环形图
          //  title: {
          //    text: '信计一班',
          //    subtext: '',
          //    sublink: '',
          //    x: 'center',
          //    y: 'center',
          //    itemGap: 20,
          //    textStyle : {
          //      color : 'rgba(30,144,255,0.8)',
          //      fontFamily : '微软雅黑',
          //      fontSize : 24,
          //      fontWeight : 'bolder'
          //    }
          //  },
          //  tooltip : {
          //    show: false,
          //    formatter: "{a} <br/>{b} : {c} ({d}%)"
          //  },
          //  legend: {
          //    orient : 'vertical',
          //    //x : document.getElementById('chartPie').offsetWidth / 2,
          //    x : '52%',
          //    y : 30,
          //    itemGap:12,
          //    data:['及格率:' + tjParaObj.pieData.banji.jglv + '%', '优秀率:' + tjParaObj.pieData.banji.yxlv + '%']
          //  },
          //  toolbox: {
          //    show : false,
          //    feature : {
          //      mark : {show: true},
          //      dataView : {show: true, readOnly: false},
          //      restore : {show: true},
          //      saveAsImage : {show: true}
          //    }
          //  },
          //  series : [
          //    {
          //      name:'1',
          //      type:'pie',
          //      clockWise:false,
          //      radius : [100, 120],
          //      itemStyle : dataStyle,
          //      data:[
          //        {
          //          value: tjParaObj.pieData.banji.jglv,
          //          name: '及格率:' + tjParaObj.pieData.banji.jglv + '%'
          //        },
          //        {
          //          value: 100 - tjParaObj.pieData.banji.jglv,
          //          name:'invisible',
          //          itemStyle : placeHolderStyle
          //        }
          //      ]
          //    },
          //    {
          //      name:'2',
          //      type:'pie',
          //      clockWise:false,
          //      radius : [80, 100],
          //      itemStyle : dataStyle,
          //      data:[
          //        {
          //          value: tjParaObj.pieData.banji.yxlv,
          //          name: '优秀率:' + tjParaObj.pieData.banji.yxlv + '%'
          //        },
          //        {
          //          value: 100 - tjParaObj.pieData.banji.yxlv,
          //          name:'invisible',
          //          itemStyle : placeHolderStyle
          //        }
          //      ]
          //    }
          //  ]
          //};
          var optBar = {
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
              barWidth: 30, //柱子的宽度
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
                    {name: '平均值起点', xAxis: -1, yAxis: $scope.tjKaoShiPublicData.ksAvgScore, value: $scope.tjKaoShiPublicData.ksAvgScore},
                    {name: '平均值终点', xAxis: 1000, yAxis: $scope.tjKaoShiPublicData.ksAvgScore}
                  ]
                ]
              }
            }]
          };
          var optLine = {
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
                data: ''
              }
            ]
          };
          var optRadar = {
            tooltip : {
              trigger: 'axis'
            },
            legend: {
              orient : 'vertical',
              x : 'right',
              y : 'bottom',
              data:['整体','班级']
            },
            polar : [
              {
                indicator : [
                  { text: '及格率', max: 100},
                  { text: '优秀率', max: 100},
                  { text: '考试人数', max: 300},
                  { text: 'TOP100', max: 100},
                  { text: '平均分', max: 100}
                ]
              }
            ],
            calculable : true,
            series : [
              {
                name: '整体对比',
                type: 'radar',
                data : [
                  {
                    value : [80, 70, 280, 80, 72],
                    name : '整体'
                  },
                  {
                    value : [70, 75, 80, 65, 70],
                    name : '班级'
                  }
                ]
              }
            ]
          };
          //饼状图数据
          if(kind == 'all'){
            //optPie.series[0].data = tjParaObj.pieDataAll;
            optLine.series[1].data = '';
          }
          else{
            //optPie.series[0].data = tjParaObj.pieDataBanJi;
            optLine.series[1].data = tjParaObj.lineDataBanJi;
          }
          //柱状图数据
          tjBarData = Lazy(tjBarData).sortBy(function(bj){return -bj.bjAvgScore;}).toArray();
          Lazy(tjBarData).each(function(bj, idx, lst){
            optBar.xAxis[0].data.push(bj.bjName);
            optBar.series[0].data.push(bj.bjAvgScore);
          });
          if(tjBarData.length <= 5){
            optBar.dataZoom.end = 100;
          }
          else{
            optBar.dataZoom.end = (5 / tjBarData.length) * 100;
          }
          tjParaObj.pieBoxAll.setOption(optPieAll);
          //tjParaObj.pieBoxBj.setOption(optPieBj);
          tjParaObj.barBox.setOption(optBar);
          tjParaObj.lineBox.setOption(optLine);
          tjParaObj.radarBox.setOption(optRadar);
          $timeout(function (){
            window.onresize = function () {
              tjParaObj.pieBoxAll.resize();
              //tjParaObj.pieBoxBj.resize();
              tjParaObj.barBox.resize();
              tjParaObj.lineBox.resize();
              tjParaObj.radarBox.resize();
            }
          }, 200);
        };

        /**
         * 整理班级或者课序号的数据
         */
        var tidyDivideData = function(originData){
          var totalScore = 0; //考试总分
          var avgScore; //本次考试的平均分
          var idxCount = 1; //给班级加所有值
          var bjOrKxhArray = []; //最终班级数组
          Lazy(originData).each(function(v, k, l){
            var banJiObj = {
              bjName: '',
              bjStu: '',
              bjAvgScore: '',
              bjIdx: ''
            };
            var banJiRenShu = ''; //每个班级的人数
            var ksNumWithoutNull = ''; //考试成绩不为空的考生
            banJiObj.bjName = k;
            banJiObj.bjStu = v;
            banJiObj.bjIdx = idxCount;
            ksNumWithoutNull = Lazy(v).reject(function(ks){return ks.ZUIHOU_PINGFEN == null}).toArray();
            if(ksNumWithoutNull && ksNumWithoutNull.length > 0){
              banJiRenShu = ksNumWithoutNull.length;
            }
            else{
              banJiRenShu = 1;
            }
            banJiObj.bjAvgScore = (Lazy(ksNumWithoutNull).reduce(function(memo, stu){
              return memo + stu.ZUIHOU_PINGFEN;
            }, 0) / banJiRenShu).toFixed(1);
            totalScore += parseInt(banJiObj.bjAvgScore);
            bjOrKxhArray.push(banJiObj);
            idxCount ++;
          });
          avgScore = totalScore / bjOrKxhArray.length;
          if(avgScore == 0){
            $scope.tjKaoShiPublicData.ksAvgScore = 0;
          }
          else{
            $scope.tjKaoShiPublicData.ksAvgScore = avgScore.toFixed(1);
          }
          tjBarData = bjOrKxhArray;
          $scope.tjKaoShiPublicData.bjOrKxh = bjOrKxhArray;
          $scope.tjBanJi = bjOrKxhArray.slice(0, 5);
          $scope.tjParas.tjBjPgOn = 0;
          $scope.tjParas.tjBjPgLen = Math.ceil(bjOrKxhArray.length / 5);
          $scope.tjParas.lastSelectBj = {
            pageNum: 0,
            banJiIdx: 0
          };
          $scope.tjByBanJi('all');
        };

        /**
         * 查询知识点
         */
        //var tjQryZsd = function(lx){
        //  var zsdAllArr = []; //存放所有知识点数组
        //  var queryZsd = queryZsdBase + '&kaoshiid=' + tjKaoShiIds.toString() + '&qrytype=' + lx;
        //  var allBanJi;
        //  DataService.getData(queryZsd).then(function(zsdData) {
        //    var disByZsd;
        //    if(zsdData && zsdData.length > 0){
        //      $scope.tjParas.zsdOriginData = angular.copy(zsdData);
        //      disByZsd = Lazy(zsdData).groupBy(function(zsd){ return zsd.ZHISHIDIANMINGCHENG; });
        //      Lazy(disByZsd).each(function(v, k, l){
        //        var zsdObj = {
        //          zsd_id: v[0].ZHISHIDIAN_ID,
        //          zsd_name: k,
        //          zsd_dfl_all: '', //总得分率
        //          zsd_dfl_bj: '', //班级得分率
        //          zsd_timu_num: 0, //使用次数
        //          zsd_timu_num_bj: 0
        //        };
        //        if(lx == 'banji'){
        //          allBanJi = Lazy(v).find(function(bj){ return bj.BANJI == 'all_banji'; });
        //        }
        //        if(lx == 'kexuhao'){
        //          allBanJi = Lazy(v).find(function(bj){ return bj.KEXUHAO == 'all_kexuhao'; });
        //        }
        //        if(allBanJi){
        //          if(allBanJi.DEFENLV && allBanJi.DEFENLV > 0){
        //            zsdObj.zsd_dfl_all = parseFloat((allBanJi.DEFENLV * 100).toFixed(1));
        //          }
        //          else{
        //            zsdObj.zsd_dfl_all = 0;
        //          }
        //          zsdObj.zsd_timu_num = allBanJi.TIMUSHULIANG;
        //          zsdAllArr.push(zsdObj);
        //        }
        //      });
        //      $scope.tjZsdDataUd = Lazy(zsdAllArr).sortBy(function(item){ return item.zsd_dfl_all}).reverse().toArray();
        //      $scope.tjParas.zsdIdArr = Lazy($scope.tjZsdDataUd).map(function(item){ return item.zsd_id}).toArray();
        //      if($scope.tjZsdDataUd.length > 5){
        //        $scope.tjZsdData = $scope.tjZsdDataUd.slice(0, 5);
        //      }
        //      else{
        //        $scope.tjZsdData = $scope.tjZsdDataUd;
        //      }
        //    }
        //    else{
        //      $scope.tjZsdDataUd = '';
        //      $scope.tjParas.zsdIdArr = '';
        //    }
        //  });
        //};

        /**
         * 统计，以课序号为准
         */
        var keXuHaoDateManage = function(data){
          var disByKeXuHao; //按课序号分组obj
          /* 按课序号分组统计数据，用在按课序号统计柱状图中 */
          disByKeXuHao = Lazy(data).groupBy(function(stu){
            if(!stu.KEXUHAO){
              stu.KEXUHAO = '空';
            }
            return stu.KEXUHAO;
          });
          tidyDivideData(disByKeXuHao);
          //查询知识点
          //tjQryZsd('kexuhao');
        };

        /**
         * 统计，以班级为准
         */
        var banJiDateManage = function(data){
          var disByBanJi; //按班级分组obj
          /* 按班级分组统计数据，用在按班级统计柱状图中 */
          disByBanJi = Lazy(data).groupBy(function(stu){
            if(!stu.BANJI){
              stu.BANJI = '其他';
            }
            return stu.BANJI;
          });
          tidyDivideData(disByBanJi);
          //查询知识点
          //tjQryZsd('banji');
        };

        /**
         * 显示考试统计的首页
         */
        $scope.tjKaoShiPublicData = {
          ksname: '',
          ksAvgScore: 0,
          ksRenShu: 0,
          leixing: 0,
          kaikaodate: '',
          shijuan: [],
          bjOrKxh: []
        };
        $scope.tjShowKaoShiChart = function(ks){
          //var queryKaoSheng;
          var isArr = isArray(ks); //判读传入的参数是否为数组
          var needParam = {
            token: token,
            kaoshizuid: ks.KAOSHIZU_ID,
            youxiufen: $scope.tjParas.youXiuFenZhi || 85,
            jigefen: $scope.tjParas.jiGeFenZhi || 60,
            zhishidianid: ''
          };
          //var ksIdStr;
          tjBarData = [];
          tjKaoShiIds = [];
          $scope.tjZsdDataUd = '';
          $scope.tjZsdDataDu = '';
          $scope.tjParas.selectBanJi = '全部';
          $scope.tjParas.tongJiType = 'keXuHao';
          $scope.showKaoShengList = true;
          $scope.tjKaoShiPublicData.ksRenShu = 0;
          if(isArr){
            Lazy(ks).each(function(item, idx, lst){
              tjKaoShiIds.push(item.KAOSHI_ID); //考试id
              $scope.tjKaoShiPublicData.ksname += item.KAOSHI_MINGCHENG + '；';
              $scope.tjKaoShiPublicData.ksRenShu += item.KSRS;
              $scope.tjKaoShiPublicData.bjOrKxh.push(item.BANJI);
              $scope.tjKaoShiPublicData.shijuan = Lazy($scope.tjKaoShiPublicData.shijuan).union(item.SHIJUAN);
              if(item.LEIXING == 1){
                $scope.tjKaoShiPublicData.leixing = 1;
              }
            });
          }
          else{//
            //tjKaoShiIds.push(ks.KAOSHIZU_ID);
            tjKaoShiIds.push(ks.KAOSHI_ID);
            $scope.tjKaoShiPublicData.ksname = ks.KAOSHI_MINGCHENG;
            $scope.tjKaoShiPublicData.ksRenShu = ks.KSRS;
            $scope.tjKaoShiPublicData.bjOrKxh = ks.BANJI;
            $scope.tjKaoShiPublicData.shijuan = ks.SHIJUAN;
            $scope.tjKaoShiPublicData.leixing = ks.LEIXING;
            $scope.tjKaoShiPublicData.kaikaodate = ks.KAISHISHIJIAN;
          }
          //查询统计需要的数据
          $http({url: queryKaoShiZuTongJi, method:'GET', params: needParam}).success(function(data){
            if(data){
              tjParaObj.pieData = data;
              $scope.switchTongJiType('keXuHao');
            }
            else{
              DataService.alertInfFun('err', data.error);
            }
          });
          //查询考生
          //ksIdStr = tjKaoShiIds.toString();
          //queryKaoSheng = queryKaoShengBase + '&kaoshiid=' + ksIdStr;
          //$http.get(queryKaoSheng).success(function(data) {
          //  if(data && data.length > 0){
          //    $scope.studentData = data;
          //    $scope.tjParas.allStudents = data;
          //    /* 饼图用到的数据，全部班级 */
          //    tjParaObj.pieData = pieDataDealFun(data); //饼图统计数据，全部班级考生
          //    /* 按课序号分组统计数据，用在按课序号统计柱状图中 */
          //    $scope.tjParas.tongJiType = 'keXuHao';
          //    $scope.switchTongJiType('keXuHao');
          //    /* 按分数分组统计数据，用在按分数和人数统计的折线图 */
          //    tjParaObj.lineDataAll = lineDataDealFun(data);
          //    qryItemDeFenLv(ksIdStr);
          //  }
          //  else{
          //    $scope.studentData = '';
          //    $scope.tjParas.allStudents = '';
          //  }
          //});
          $scope.tj_tabActive = 'kaoshiTj';
          $scope.tjSubTpl = 'views/tongji/tj_ks_chart.html';
        };

        /**
         * 统计页面试卷多选，将试卷加入到数组
         */
        $scope.addKaoShiToTj = function(event, ks){
          var isChecked = $(event.target).prop('checked');
          if(isChecked){
            $scope.tjParas.selectedKaoShi.push(ks);
          }
          else{
            if($scope.tjParas.selectedKaoShi.length){
              $scope.tjParas.selectedKaoShi = Lazy($scope.tjParas.selectedKaoShi).reject(function(item){
                return item.KAOSHI_ID == ks.KAOSHI_ID;
              }).toArray();
            }
          }
        };

        /**
         * 班级列表分页
         */
        $scope.banJiPage = function(direction){
          if(direction == 'down'){
            $scope.tjParas.tjBjPgOn ++;
            if($scope.tjParas.tjBjPgOn < $scope.tjParas.tjBjPgLen){
              $scope.tjBanJi = $scope.tjKaoShiPublicData.bjOrKxh.slice($scope.tjParas.tjBjPgOn * 5, ($scope.tjParas.tjBjPgOn + 1) * 5);
            }
            else{
              $scope.tjParas.tjBjPgOn = $scope.tjParas.tjBjPgLen - 1;
            }
          }
          else{
            $scope.tjParas.tjBjPgOn --;
            if($scope.tjParas.tjBjPgOn >= 0){
              $scope.tjBanJi = $scope.tjKaoShiPublicData.bjOrKxh.slice($scope.tjParas.tjBjPgOn * 5, ($scope.tjParas.tjBjPgOn + 1) * 5);
            }
            else{
              $scope.tjParas.tjBjPgOn = 0;
            }
          }
        };

        /**
         * 通过班级统计
         */
        $scope.tjByBanJi = function(bj){
          var addActiveFun;
          tjParaObj.lineDataBanJi = '';
          $scope.tjParas.lastSelectBj = {
            pageNum: $scope.tjParas.tjBjPgOn,
            banJiIdx: ''
          };
          //知识点数据,初始化班级数据
          Lazy($scope.tjZsdDataUd).each(function(zsd, idx, lst){
            zsd.zsd_dfl_bj = '';
            zsd.zsd_timu_num_bj = 0;
          });
          if(bj == 'all'){
            $scope.tjParas.selectBanJi = '全部';
            $scope.tjParas.lastSelectBj.banJiIdx = 0;
            $scope.studentData = $scope.tjParas.allStudents;
            //饼图数据，单个班级
            addActiveFun = function(){
              tjParaObj.lineBox = echarts.init(document.getElementById('chartLine'));
              chartShowFun('all');
            };
            $timeout(addActiveFun, 100);
          }
          else{
            var disByBj, banJiZsd, disByZsd, sumAll, sumSgl, posIdx;
            $scope.tjParas.selectBanJi = bj.bjName;
            $scope.tjParas.lastSelectBj.banJiIdx = bj.bjIdx;
            $scope.studentData = bj.bjStu;
            //饼状图数据，单个班级
            tjParaObj.pieDataBanJi = pieDataDealFun(bj.bjStu);
            //折线图，班级数据
            tjParaObj.lineDataBanJi = lineDataDealFun(bj.bjStu);
            //饼图数据
            addActiveFun = function(){
              tjParaObj.lineBox = echarts.init(document.getElementById('chartLine'));
              chartShowFun();
            };
            $timeout(addActiveFun, 100);
            //知识点数据
            if($scope.tjParas.tongJiType && $scope.tjParas.tongJiType == 'banJi'){
              disByBj = Lazy($scope.tjParas.zsdOriginData).groupBy(function(zsd){
                if(!zsd.BANJI){
                  zsd.BANJI = '其他';
                }
                return zsd.BANJI;
              }).toObject();
            }
            if($scope.tjParas.tongJiType && $scope.tjParas.tongJiType == 'keXuHao'){
              disByBj = Lazy($scope.tjParas.zsdOriginData).groupBy(function(zsd){
                if(!zsd.KEXUHAO){
                  zsd.KEXUHAO = '其他';
                }
                return zsd.KEXUHAO;
              }).toObject();
            }
            banJiZsd = disByBj[bj.bjName];
            if(banJiZsd){
              disByZsd = Lazy(banJiZsd).groupBy(function(zsd){ return zsd.ZHISHIDIANMINGCHENG; }).toObject(); //用知识点把数据分组
              Lazy(disByZsd).each(function(v, k, l) {
                posIdx = Lazy($scope.tjParas.zsdIdArr).indexOf(v[0].ZHISHIDIAN_ID);
                $scope.tjZsdDataUd[posIdx].zsd_timu_num_bj = v[0].TIMUSHULIANG;
                if(v[0].DEFENLV && v[0].DEFENLV > 0){
                  $scope.tjZsdDataUd[posIdx].zsd_dfl_bj = (v[0].DEFENLV * 100).toFixed(1);
                }
                else{
                  $scope.tjZsdDataUd[posIdx].zsd_dfl_bj = 0;
                }
              });
            }
          }
        };

        /**
         * 考试统计类型切换（班级和课序号）
         */
        $scope.switchTongJiType = function(tjType){
          if(tjType == 'keXuHao'){
            keXuHaoDateManage($scope.tjParas.allStudents);
          }
          if(tjType == 'banJi'){
            banJiDateManage($scope.tjParas.allStudents);
          }
          tjParaObj.pieBoxAll = echarts.init(document.getElementById('chartPieAll'));
          //tjParaObj.pieBoxBj = echarts.init(document.getElementById('chartPieBj'));
          tjParaObj.barBox = echarts.init(document.getElementById('chartBar'));
          tjParaObj.lineBox = echarts.init(document.getElementById('chartLine'));
          tjParaObj.radarBox = echarts.init(document.getElementById('chartRadar'));
        };

        /**
         * 通过试卷统计
         */
        $scope.tjByShiJuan = function(){

        };

        /**
         * 查询考试通过考生UID
         */
        $scope.qryKaoShiByXueHao = function(){
          if($scope.tjParas.studentUid){
            var qryKaoShiByXueHaoUrl = qryKaoShiByXueHaoBase + $scope.tjParas.studentUid;
            DataService.getData(qryKaoShiByXueHaoUrl).then(function(data) {
              if(data && data.length > 0){
                $scope.tjKaoShiData = data;
                $scope.studentData = '';
                $scope.showKaoShengList = true;
                $scope.tjSubTpl = 'views/tongji/tj_stud_detail.html';
              }
            });
          }
        };

        /**
         * 由考试查询考生
         */
        $scope.qryKaoSheng = function(id){
          if(id){
            var qryKaoShengUrl = queryKaoShengBase + '&kaoshiid=' + id;
            $scope.tjParas.zdcxKaoShiId = id;
            DataService.getData(qryKaoShengUrl).then(function(data) {
              if(data && data.length > 0) {
                $scope.studentData = data;
                $scope.tjKaoShiData = '';
                $scope.showKaoShengList = true;
                qryItemDeFenLv(id);
                $scope.tjSubTpl = 'views/tongji/tj_stud_detail.html';
              }
            });
          }
          else{
            DataService.alertInfFun('pmt', '缺少考试ID');
          }
        };

        /**
         * 点击更多，查看更多知识点
         */
        $scope.getMoreZsd = function(){
          $scope.tjZsdData = $scope.tjZsdDataUd;
        };

        /**
         * 点击收起，收起更多知识点
         */
        $scope.closeMoreZsd = function(){
          $scope.tjZsdData = $scope.tjZsdDataUd.slice(0, 5);
        };

        /**
         * 重新加载mathjax
         */
        $scope.$on('onRepeatLast', function(scope, element, attrs){
          MathJax.Hub.Config({
            tex2jax: {inlineMath: [["#$", "$#"]], displayMath: [['#$$','$$#']]},
            messageStyle: "none",
            showMathMenu: false,
            processEscapes: true
          });
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, "answerReappearShiJuan"]);
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, "testList1"]);
        });

    }]);
});
