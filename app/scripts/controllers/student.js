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
        var caozuoyuan = userInfo.UID;//登录的用户的UID   chaxun_kaoshi_liebiao
        var xuehao = userInfo.xuehao;
        var baseTjAPIUrl = config.apiurl_tj; //统计的api
        var baseKwAPIUrl = config.apiurl_kw; //考务的api
        var token = config.token;
        var currentPath = $location.$$path;
        var qryKaoShiByXueHaoBase = baseTjAPIUrl + 'query_kaoshi_by_xuehao?token=' + token + '&jigouid=' + defaultJg
          + '&userType=' + 'student' + '&xuehao='; //查询考试通过考生学号
        var answerReappearBaseUrl = baseTjAPIUrl + 'answer_reappear?token=' + token; //作答重现的url
        var qryItemDeFenLvBase = baseTjAPIUrl + 'query_timu_defenlv?token=' + token + '&kaoshiid='; //查询每道题目的得分率
        var originVideoData; //原始视频
        var itemsPerPage = 8; //每页数据数量
        var videoPageArr = []; // 视频页码数组
        var paginationLength = 11; //分页部分，页码的长度，目前设定为11
        var queryBaoMingKaoShiUrl = baseKwAPIUrl + 'query_baoming_kaoshi?token=' + token + '&caozuoyuan=' + caozuoyuan +
          '&jigouid=' + defaultJg + '&uid=' + caozuoyuan; //查询考生需要参加的考试
        var chaXunChangCiUrl = baseKwAPIUrl + 'query_changci?token=' + token + '&caozuoyuan=' + caozuoyuan + '&kszid='; //查询场次
        var zaiXianBaoMingUrl = baseKwAPIUrl + 'zaixianbaoming'; //在线报名的url

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
          $scope.kaoShiArrs = '';
          var kaoShiZu = [];
          $scope.kaoShiChangCiDetail = false;
          $http.get(queryBaoMingKaoShiUrl).success(function (data) {
            if (data && data.length > 0) {
              var kszSort = Lazy(data).groupBy(function(ksz){ return ksz.KAOSHIZU_ID; });
              Lazy(kszSort).each(function(v, k, l){
                var kszObj = {
                  KAOSHIZU_ID: k,
                  KAOSHIZU_NAME: v[0].KAOSHIZU_NAME,
                  LINGYU_ID: v[0].LINGYU_ID,
                  YIBAOMING: 0,
                  kaoShiShiJian: '',
                  kaoChangInfo: []
                };
                Lazy(v).each(function(cc){
                  if(cc.YIBAOMING == 1){
                    var kci = cc.KMINGCHENG;
                    //if(cc.ZUOWEIHAO){
                    //  kci += '--' + cc.ZUOWEIHAO + '号机';
                    //}
                    kszObj.kaoShiShiJian = DataService.baoMingDateFormat(cc.KAISHISHIJIAN, cc.JIESHUSHIJIAN);
                    kszObj.YIBAOMING = 1;
                    kszObj.kaoChangInfo.push(kci);
                  }
                });
                kaoShiZu.push(kszObj);
              });
              $scope.kaoShiArrs = Lazy(kaoShiZu).reverse().toArray();
            }
            if(data.error){
              $scope.kaoShiArrs = '';
              DataService.alertInfFun('err', data.error);
            }
          });
        };

        /**
         * 查看考试详情
         */
        $scope.queryKaoShiZuDetail = function(ks){
          var chaXunChangCi = chaXunChangCiUrl + ks.KAOSHIZU_ID;
          var ksObj = {
            KAOSHIZU_ID: ks.KAOSHIZU_ID,
            KAOSHIZU_NAME: ks.KAOSHIZU_NAME,
            changci: []
          };
          $http.get(chaXunChangCi).success(function(data){
            if(data && data.length > 0){
              var disChangCi = Lazy(data).groupBy(function(cc){
                return cc.KAOSHI_ID;
              });
              Lazy(disChangCi).each(function(v, k, l){
                var fd = v[0];
                var ccObj = {
                  KAOSHI_ID: k,
                  KAOSHI_MINGCHENG: fd.KAOSHI_MINGCHENG,
                  KAISHISHIJIAN: fd.KAISHISHIJIAN,
                  JIESHUSHIJIAN: fd.JIESHUSHIJIAN,
                  SHICHANG: fd.SHICHANG,
                  LINGYU_ID: ks.LINGYU_ID,
                  kaoShiShiJian: DataService.baoMingDateFormat(fd.KAISHISHIJIAN, fd.JIESHUSHIJIAN),
                  kaoDian: []
                };
                Lazy(v).each(function(cc){
                  var kdObj = {
                    KID: cc.KID,
                    KMINGCHENG: cc.KMINGCHENG,
                    KAOWEISHULIANG: cc.KAOWEISHULIANG,
                    YIBAOMINGRENSHU: cc.YIBAOMINGRENSHU || 0,
                    ckd: false
                  };
                  kdObj.isFull = kdObj.YIBAOMINGRENSHU >= kdObj.KAOWEISHULIANG ? true : false;
                  ccObj.kaoDian.push(kdObj);
                });
                ksObj.changci.push(ccObj);
              });
              $scope.kaoShiDetailData = ksObj;
              $scope.kaoShiChangCiDetail = true;
            }
            else{
              $scope.kaoShiDetailData = '';
              $scope.kaoShiChangCiDetail = false;
              DataService.alertInfFun('err', data.error);
            }
          });
        };

        /**
         * 返回报名考试列表
         */
        $scope.backToBoMingList = function(){
          $scope.kaoShiDetailData = '';
          $scope.kaoShiChangCiDetail = false;
        };

        /**
         * 选择考点
         */
        $scope.bmKaoDianSelect = function(kd){
          Lazy($scope.kaoShiDetailData.changci).each(function(cc){
            Lazy(cc.kaoDian).each(function(kd){
              kd.ckd = false;
            });
          });
          kd.ckd = !kd.ckd;
        };

        /**
         * 保存考生选择信息
         */
        $scope.saveStudentSelcet = function () {
          var bmObj = {
            token: token,
            caozuoyuan: caozuoyuan,
            uid: caozuoyuan,
            kid: '',
            ksid: '',
            lingyuid: ''
          };
          Lazy($scope.kaoShiDetailData.changci).each(function(cc){
            Lazy(cc.kaoDian).each(function(kd){
             if(kd.ckd == true){
               bmObj.ksid = cc.KAOSHI_ID;
               bmObj.lingyuid = cc.LINGYU_ID;
               bmObj.kid = kd.KID;
             }
            });
          });
          if(bmObj.ksid){
            if(bmObj.kid){
              $http.post(zaiXianBaoMingUrl, bmObj).success(function(data){
                if(data.result){
                  DataService.alertInfFun('suc', '报名成功！');
                  $scope.backToBoMingList();
                  chaXunBaoMingChangCi();
                }
                else{
                  DataService.alertInfFun('err', data.error);
                }
              });
            }
            else{
              DataService.alertInfFun('pmt', '考点ID不能为空！');
            }
          }
          else{
            DataService.alertInfFun('pmt', '考试ID不能为空！');
          }
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
