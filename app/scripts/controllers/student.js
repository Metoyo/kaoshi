define(['angular', 'config', 'jquery', 'lazy', 'polyv'], function (angular, config, $, lazy, polyv) {
  'use strict';

  angular.module('kaoshiApp.controllers.StudentCtrl', [])
    .controller('StudentCtrl', ['$rootScope', '$scope', '$location', '$http', 'DataService', '$timeout',
      function ($rootScope, $scope, $location, $http, DataService, $timeout) {
        /**
         * 定义变量
         */
        $rootScope.isRenZheng = false; //判读页面是不是认证
        /**
         * 声明变量
         */
        var userInfo = $rootScope.session.userInfo;
        var defaultJg = userInfo.JIGOU;
        var xuehao = userInfo.xuehao;
        var baseTjAPIUrl = config.apiurl_tj; //统计的api
        var baseBmAPIUrl = config.apiurl_bm; //报名的api
        var token = config.token;
        var queryKaoShiBase = baseBmAPIUrl + 'chaxun_baoming?token=' + token + '&jigouid=' + defaultJg +
          '&xuehao=' + xuehao + '&baoming_id='; //查询考试考点
        var saveStudentSelect = baseBmAPIUrl + 'modify_baoming_kaosheng'; //保存考生的报名选择
        var qryKaoDianRenShuBase = baseBmAPIUrl + 'query_kaodian_renshu?token=' + token; //查询次考场报了多少人
        var qryBmCcBase = baseBmAPIUrl + 'query_baoming_changci?token=' + token + '&jigouid=' + defaultJg +
          '&xuehao=' + xuehao; //查询考生有几场考试
        var qryKsDetailBase = baseBmAPIUrl + 'query_kaoshi_detail?token=' + token; //查询考试详情
        var currentPath = $location.$$path;
        var qryKaoShiByXueHaoBase = baseTjAPIUrl + 'query_kaoshi_by_xuehao?token=' + token + '&jigouid=' + defaultJg
          + '&userType=' + 'student' + '&xuehao='; //查询考试通过考生学号
        var answerReappearBaseUrl = baseTjAPIUrl + 'answer_reappear?token=' + token; //作答重现的url
        var qryItemDeFenLvBase = baseTjAPIUrl + 'query_timu_defenlv?token=' + token + '&kaoshiid='; //查询每道题目的得分率
        var originVideoData; //原始视频
        var itemsPerPage = 8; //每页数据数量
        var videoPageArr = []; // 视频页码数组
        var paginationLength = 11; //分页部分，页码的长度，目前设定为11

        $scope.bmKaoChang = '';
        $scope.stuParams = {
          selectKaoDian: '',
          hasBaoMing: true,
          letterArr: config.letterArr, //题支的序号
          cnNumArr: config.cnNumArr, //汉语的大写数字
          noData: '' //没有数据的显示
        };
        $scope.kaoShiArrs = '';
        $scope.kaoShiDetail = '';
        $scope.showStuSelectInfo = false;

        /**
         * 查询考生有几场考试
         */
        var chaXunBaoMingChangCi = function () {
          $http.get(qryBmCcBase).success(function (data) {
            if (data && data.length > 0) {
              var d = new Date();
              var nowTime = d.getTime();
              Lazy(data).each(function (bmxx, idx, lst) {
                var jz = new Date(bmxx.BAOMINGJIEZHISHIJIAN);
                var jzp = jz.getTimezoneOffset();
                var jzTime = jz.getTime() + jzp * 60 * 1000;
                bmxx.hasEndBaoMing = false;
                if (nowTime > jzTime) {
                  bmxx.hasEndBaoMing = true;
                }
                else {
                  bmxx.hasEndBaoMing = false;
                }
              });
              $scope.kaoShiArrs = data;
            }
            if(data.error){
              DataService.alertInfFun('err', data.error);
            }
          });
          //var newData = [
          //  {
          //    KAOSHIMINGCHENG: '2015年期中考试A',
          //    ZUOWEIHAO: 'A考点20号机'
          //  },
          //  {
          //    KAOSHIMINGCHENG: '2015年期中考试B',
          //    ZUOWEIHAO: 'A考点20号机'
          //  },
          //  {
          //    KAOSHIMINGCHENG: '2015年期中考试C',
          //    ZUOWEIHAO: 'A考点20号机'
          //  },
          //  {
          //    KAOSHIMINGCHENG: '2015年期中考试D',
          //    ZUOWEIHAO: 'A考点20号机'
          //  },
          //  {
          //    KAOSHIMINGCHENG: '2015年期中考试E',
          //    ZUOWEIHAO: 'A考点20号机'
          //  },
          //  {
          //    KAOSHIMINGCHENG: '2015年期中考试F',
          //    ZUOWEIHAO: 'A考点20号机'
          //  }
          //];
          //$scope.kaoShiArrs = newData;
        };

        /**
         * 根据机构和学号查询报名信息
         */
        $scope.chaXunBaoMing = function (ks) {
          var bmKs, bmKsArr = [], queryKaoShi;
          queryKaoShi = queryKaoShiBase + ks.BAOMING_ID;
          $http.get(queryKaoShi).success(function (data) {
            if (data && data.length > 0) {
              bmKs = Lazy(data).groupBy(function (bm) {
                return bm.KAISHISHIJIAN;
              }).toObject();
              Lazy(bmKs).each(function (v, k, lst) {
                var bmksObj = {
                  ksStart: '',
                  ksEnd: '',
                  ksShiJian: '',
                  ksKc: ''
                };
                bmksObj.ksStart = k;
                bmksObj.ksKc = v;
                bmksObj.ksEnd = v[0].JIESHUSHIJIAN;
                bmksObj.ksShiJian = DataService.baoMingDateFormat(bmksObj.ksStart, bmksObj.ksEnd);
                Lazy(bmksObj.ksKc).each(function (kc, idx, lst) {
                  kc.baomingjiezhishijian = ks.BAOMINGJIEZHISHIJIAN;
                  if (kc.BAOMING_RENSHU >= 0) {
                    var sywz = parseInt(kc.KAOWEI) - kc.BAOMING_RENSHU;
                    if (sywz >= 0) {
                      kc.syKaoWei = sywz;
                    }
                    else {
                      kc.syKaoWei = 0;
                    }
                  }
                  else {
                    kc.syKaoWei = parseInt(kc.KAOWEI);
                  }
                });
                bmKsArr.push(bmksObj);
              });
              $scope.bmKaoChang = bmKsArr;
              $scope.stuParams.hasBaoMing = false;
              $scope.kaoShiDetail = '';
            }
            else{
              DataService.alertInfFun('err', data.error);
            }
          });
        };

        /**
         * 获得选择的考点
         */
        $scope.getSelectKd = function (val) {
          $scope.stuParams.selectKaoDian = val;
        };

        /**
         * 保存考生选择的确认信息
         */
        $scope.saveStudentSelcet = function () {
          if ($scope.stuParams.selectKaoDian) {
            var kdInfo = $scope.stuParams.selectKaoDian;
            $scope.confirmInfo = {
              kaoshiName: '',
              shijian: '',
              kaochang: ''
            };
            $scope.confirmInfo.shijian = DataService.baoMingDateFormat(kdInfo.KAISHISHIJIAN, kdInfo.JIESHUSHIJIAN);
            $scope.confirmInfo.kaochang = kdInfo.KAODIANMINGCHENG;
            $scope.confirmInfo.kaoshiName = kdInfo.KAOSHIMINGCHENG;
            $scope.showStuSelectInfo = true;
          }
          else {
            DataService.alertInfFun('pmt', '请选择考试场次！');
          }
        };

        /**
         * 保存考试选择信息
         */
        $scope.saveStudentSelectFun = function () {
          var kdInfo = $scope.stuParams.selectKaoDian;
          var kddData = {
            token: token,
            jigouid: defaultJg,
            xuehao: xuehao,
            baoming_id: kdInfo.BAOMING_ID,
            baomingkaodian_id: kdInfo.BAOMINGKAODIAN_ID,
            baomingkaoshishijian_id: kdInfo.BAOMINGKAOSHISHIJIAN_ID,
            baomingjiezhishijian: kdInfo.baomingjiezhishijian
          };
          var qryKaoDianRenShu = qryKaoDianRenShuBase + '&baoming_id=' + kddData.baoming_id;
          qryKaoDianRenShu += '&baomingkaodian_id=' + kddData.baomingkaodian_id;
          qryKaoDianRenShu += '&baomingkaoshishijian_id=' + kddData.baomingkaoshishijian_id;
          DataService.getData(qryKaoDianRenShu).then(function (kdRenShu) {
            if (kdRenShu[0].bmNums < $scope.stuParams.selectKaoDian.KAOWEI) {
              $http.post(saveStudentSelect, kddData).success(function (data) {
                if (data.result) {
                  $scope.bmKaoChang = '';
                  DataService.alertInfFun('suc', '保存成功！');
                  $scope.stuParams.hasBaoMing = true;
                  $scope.showStuSelectInfo = false;
                  chaXunBaoMingChangCi();
                }
              });
            }
            else {
              DataService.alertInfFun('pmt', '此时间段的本考场已没有空余考位，请重新选择！');
            }
          });
        };

        /**
         * 关闭保存考生选择的弹出层
         */
        $scope.colseSaveBaoMingSelect = function () {
          $scope.showStuSelectInfo = false;
        };

        /**
         * 查询考试详情
         */
        $scope.qryKaoShiDetail = function (ks) {
          $scope.kaoShiDetail = '';
          var qryKsDetail = qryKsDetailBase + '&baomingkaoshishijian_id=';
          qryKsDetail += ks.BAOMINGKAOSHISHIJIAN_ID;
          qryKsDetail += '&baomingkaodian_id=' + ks.BAOMINGKAODIAN_ID;
          qryKsDetail += '&baomingkaosheng_id=' + ks.BAOMINGKAOSHENG_ID;
          DataService.getData(qryKsDetail).then(function (detail) {
            if (detail && detail.length) {
              Lazy(detail).each(function (ksd, idx, lst) {
                ksd.ksShijian = DataService.baoMingDateFormat(ksd.KAISHISHIJIAN, ksd.JIESHUSHIJIAN);
                ksd.ksName = ks.KAOSHIMINGCHENG;
              });
              $scope.kaoShiDetail = detail;
              $scope.stuParams.hasBaoMing = true;
            }
          });
        };

        /**
         * 查询考试通过考生UID
         */
        var qryKaoShiByXueHao = function () {
          if (xuehao) {
            var qryKaoShiByXueHaoUrl = qryKaoShiByXueHaoBase + xuehao;
            $http.get(qryKaoShiByXueHaoUrl).success(function (data) {
              if (data && data.length > 0) {
                $scope.ksScoreData = data;
              }
              if(data.error){
                DataService.alertInfFun('err', data.error);
              }
            });
          }
        };

        /**
         * 作答重现
         */
        $scope.zuoDaReappear = function (ks) {
          var answerReappearUrl = answerReappearBaseUrl;
          var dataDis;
          var tmVal;
          var finaData = {
            sj_name: '',
            sj_tm: []
          };
          var studId = ks.KAOSHENG_UID;
          var examId = ks.KAOSHI_ID;
          var itemDeFenLv = '';
          $scope.kaoShengShiJuan = '';
          if (studId) {
            answerReappearUrl += '&kaoshengid=' + studId;
          }
          else {
            DataService.alertInfFun('pmt', '缺少考生UID');
            return;
          }
          if (examId) {
            answerReappearUrl += '&kaoshiid=' + examId;
          }
          else {
            DataService.alertInfFun('pmt', '缺少考试ID');
            return;
          }
          DataService.getData(answerReappearUrl).then(function (data) {
            if (data && data.length > 0) {
              var qryItemDeFenLvUrl = qryItemDeFenLvBase + examId;
              if (examId) {
                DataService.getData(qryItemDeFenLvUrl).then(function (dfl) {
                  if (dfl && dfl.length > 0) {
                    itemDeFenLv = dfl;
                    finaData.sj_name = data[0].SHIJUAN_MINGCHENG;
                    dataDis = Lazy(data).groupBy('DATI_XUHAO').toObject();
                    Lazy(dataDis).each(function (val, key, list) {
                      var dObj = {
                        tx_id: key,
                        tx_name: val[0].DATIMINGCHENG,
                        tm: ''
                      };
                      tmVal = Lazy(val).each(function (tm, idx, lst) {
                        var findVal = Lazy(itemDeFenLv).find(function (item) {
                          return item.TIMU_ID == tm.TIMU_ID
                        });
                        tm.itemDeFenLv = (findVal.DEFENLV * 100).toFixed(1);
                        if (typeof(tm.TIGAN) == 'string') {
                          tm.TIGAN = JSON.parse(tm.TIGAN);
                        }
                        DataService.formatDaAn(tm);
                      });
                      dObj.tm = tmVal;
                      finaData.sj_tm.push(dObj);
                    });
                    $scope.kaoShengShiJuan = finaData;
                  }
                });
              }
              else {
                itemDeFenLv = '';
                DataService.alertInfFun('pmt', '查询得分率缺少考试ID');
              }
            }
          });
        };

        /**
         * 当为微录课是加载视频列表
         */
        var loadVideoList = function(){
          $scope.videoData = '';
          $scope.videoData = config.videos;
          var lastVideoPage = '';
          var videoLen = '';
          $scope.videoLastPage = '';
          $scope.showVideodeoPlay = false;
          videoPageArr = [];
          $scope.selectVideo = '';
          //临时数据
          var data = config.videos;
          if(data && data.length > 0){
            originVideoData = data;
            videoLen = data.length;
            lastVideoPage = Math.ceil(videoLen/itemsPerPage);
            $scope.videoLastPage = lastVideoPage;
            for(var i = 1; i <= lastVideoPage; i ++){
              videoPageArr.push(i);
            }
            if(videoLen <= 8){
              $scope.videoData = data;
            }
            else{
              $scope.videoDistFun(1);
            }
          }
          else{
            originVideoData = '';
            DataService.alertInfFun('err', data.error);
          }
          //var getVideoUrl = 'http://v.yunjiaoshou.com:4280/wlk/videos/1180';
          //$http.get(getVideoUrl).success(function(data){
          //  if(data && data.length > 0){
          //    originVideoData = data;
          //    videoLen = data.length;
          //    lastVideoPage = Math.ceil(videoLen/itemsPerPage);
          //    $scope.videoLastPage = lastVideoPage;
          //    for(var i = 1; i <= lastVideoPage; i ++){
          //      videoPageArr.push(i);
          //    }
          //    if(videoLen <= 8){
          //      $scope.videoData = data;
          //    }
          //    else{
          //      $scope.videoDistFun(1);
          //    }
          //  }
          //  else{
          //    originVideoData = '';
          //    DataService.alertInfFun('err', data.error);
          //  }
          //});
        };

        /**
         * 视频分页
         */
        $scope.videoDistFun = function(pg){
          var pgNum = pg - 1;
          var currentPage = pgNum ? pgNum : 0;
          $scope.videoPages = [];
          //得到分页数组的代码
          var currentVideoPage = $scope.currentVideoPage = pg ? pg : 1;
          if($scope.videoLastPage <= paginationLength){
            $scope.videoPages = videoPageArr;
          }
          if($scope.videoLastPage > paginationLength){
            if(currentVideoPage > 0 && currentVideoPage <= 6 ){
              $scope.videoPages = videoPageArr.slice(0, paginationLength);
            }
            else if(currentVideoPage > $scope.videoLastPage - 5 && currentVideoPage <= $scope.videoLastPage){
              $scope.videoPages = videoPageArr.slice($scope.videoLastPage - paginationLength);
            }
            else{
              $scope.videoPages = videoPageArr.slice(currentVideoPage - 5, currentVideoPage + 5);
            }
          }
          $scope.videoData = originVideoData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
        };

        /**
         * 判断是报名还是成绩
         */
        switch (currentPath) {
          case '/baoming':
            chaXunBaoMingChangCi();
            break;
          case '/chengji':
            qryKaoShiByXueHao();
            break;
          case '/weiluke':
            loadVideoList();
            break;
        }

        /**
         * 显示视频
         */
        $scope.showVideo = function(vd){
          $scope.showVideodeoPlay = true;
          var wd = $('.sub-nav').width();
          var playH = wd * 0.7 * 0.6;
          $scope.relatedVideoData = [];
          $('.sideVideoList').height(playH - 36);
          Lazy(originVideoData).each(function(v){
            if(v.Owner == vd.Owner){
              $scope.relatedVideoData.push(v);
            }
          });
          var player = polyvObject('#videoBox').videoPlayer({
            'width': '100%',
            'height': playH,
            'vid': vd.VID,
            'flashvars': {"autoplay": "1"}
          });
          $scope.selectVideo = vd;
        };

        /**
         * 返回视频列表
         */
        $scope.backToVideoList = function(){
          $scope.showVideodeoPlay = false;
        };

        /**
         * 重新加载mathjax
         */
        $scope.$on('onRepeatLast', function (scope, element, attrs) {
          MathJax.Hub.Config({
            tex2jax: {inlineMath: [["#$", "$#"]], displayMath: [['#$$', '$$#']]},
            messageStyle: "none",
            showMathMenu: false,
            processEscapes: true
          });
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, "answerReappearShiJuan"]);
        });

      }]);
});
