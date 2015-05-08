define(['jquery', 'underscore', 'angular', 'config'], function (JQ, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.StudentCtrl', [])
    .controller('StudentCtrl', ['$rootScope', '$scope', '$location', '$http', 'DataService',
      function ($rootScope, $scope, $location, $http, DataService) {
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

        $scope.bmKaoChang = '';
        $scope.stuParams = {
          selectKaoDian: '',
          hasBaoMing: true,
          letterArr: config.letterArr, //题支的序号
          cnNumArr: config.cnNumArr //汉语的大写数字
        };
        $scope.kaoShiArrs = '';
        $scope.kaoShiDetail = '';
        $scope.showStuSelectInfo = false;

        /**
         * 查询考生有几场考试
         */
        var chaXunBaoMingChangCi = function(){
          DataService.getData(qryBmCcBase).then(function(data){
            if(data && data.length){
              var d = new Date();
              var nowTime = d.getTime();
              _.each(data, function(bmxx, idx, lst){
                var jz = new Date(bmxx.BAOMINGJIEZHISHIJIAN);
                var jzp = jz.getTimezoneOffset();
                var jzTime = jz.getTime() + jzp * 60 * 1000;
                bmxx.hasEndBaoMing = false;
                if(nowTime > jzTime){
                  bmxx.hasEndBaoMing = true;
                }
                else{
                  bmxx.hasEndBaoMing = false;
                }
              });
              $scope.kaoShiArrs = data;
            }
          });
        };

        /**
         * 根据机构和学号查询报名信息
         */
        $scope.chaXunBaoMing = function(ks){
          var bmKs, bmKsArr = [],queryKaoShi;
          queryKaoShi = queryKaoShiBase + ks.BAOMING_ID;
          DataService.getData(queryKaoShi).then(function(data){
            if(data && data.length){
              bmKs = _.groupBy(data, function(bm){
                return bm.KAISHISHIJIAN;
              });
              _.each(bmKs, function(v, k, lst){
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
                _.each(bmksObj.ksKc, function(kc, idx, lst){
                  kc.baomingjiezhishijian = ks.BAOMINGJIEZHISHIJIAN;
                  if(kc.BAOMING_RENSHU >= 0){
                    var sywz = parseInt(kc.KAOWEI) - kc.BAOMING_RENSHU;
                    if(sywz >= 0){
                      kc.syKaoWei = sywz;
                    }
                    else{
                      kc.syKaoWei = 0;
                    }
                  }
                  else{
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
              DataService.alertInfFun('err', '没有符合的数据！');
            }
          });
        };

        /**
         * 获得选择的考点
         */
        $scope.getSelectKd = function(val){
          $scope.stuParams.selectKaoDian = val;
        };

        /**
         * 保存考生选择的确认信息
         */
        $scope.saveStudentSelcet = function(){
          if($scope.stuParams.selectKaoDian){
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
          else{
            DataService.alertInfFun('pmt', '请选择考试场次！');
          }
        };

        /**
         * 保存考试选择信息
         */
        $scope.saveStudentSelectFun = function(){
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
          DataService.getData(qryKaoDianRenShu).then(function(kdRenShu){
            if(kdRenShu[0].bmNums < $scope.stuParams.selectKaoDian.KAOWEI){
              $http.post(saveStudentSelect, kddData).success(function(data){
                if(data.result){
                  $scope.bmKaoChang = '';
                  DataService.alertInfFun('suc', '保存成功！');
                  $scope.stuParams.hasBaoMing = true;
                  $scope.showStuSelectInfo = false;
                  chaXunBaoMingChangCi();
                }
              });
            }
            else{
              DataService.alertInfFun('pmt', '此时间段的本考场已没有空余考位，请重新选择！');
            }
          });
        };

        /**
         * 关闭保存考生选择的弹出层
         */
        $scope.colseSaveBaoMingSelect = function(){
          $scope.showStuSelectInfo = false;
        };

        /**
         * 查询考试详情
         */
        $scope.qryKaoShiDetail = function(ks){
          $scope.kaoShiDetail = '';
          var qryKsDetail = qryKsDetailBase + '&baomingkaoshishijian_id=';
          qryKsDetail += ks.BAOMINGKAOSHISHIJIAN_ID;
          qryKsDetail += '&baomingkaodian_id=' + ks.BAOMINGKAODIAN_ID;
          qryKsDetail += '&baomingkaosheng_id=' + ks.BAOMINGKAOSHENG_ID;
          DataService.getData(qryKsDetail).then(function(detail){
            if(detail && detail.length){
              _.each(detail, function(ksd, idx, lst){
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
        var qryKaoShiByXueHao = function(){
          if(xuehao){
            var qryKaoShiByXueHaoUrl = qryKaoShiByXueHaoBase + xuehao;
            DataService.getData(qryKaoShiByXueHaoUrl).then(function(data) {
              if(data && data.length > 0){
                $scope.ksScoreData = data;
              }
            });
          }
        };

        /**
         * 判断是报名还是成绩
         */
        switch (currentPath){
          case '/baoming':
            chaXunBaoMingChangCi();
            break;
          case '/chengji':
            qryKaoShiByXueHao();
            break;
        }

        /**
         * 作答重现
         */
        $scope.zuoDaReappear = function(ks){
          var answerReappearUrl = answerReappearBaseUrl;
          var  dataDis;
          var tmVal;
          var finaData = {
              sj_name: '',
              sj_tm: []
            };
          var studId = ks.KAOSHENG_UID;
          var examId = ks.KAOSHI_ID;
          var itemDeFenLv = '';
          $scope.kaoShengShiJuan = '';
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
              var qryItemDeFenLvUrl = qryItemDeFenLvBase + examId;
              if(examId){
                DataService.getData(qryItemDeFenLvUrl).then(function(dfl) {
                  if(dfl && dfl.length > 0) {
                    itemDeFenLv = dfl;
                    finaData.sj_name = data[0].SHIJUAN_MINGCHENG;
                    dataDis = _.groupBy(data, 'DATI_XUHAO');
                    _.each(dataDis, function(val, key, list){
                      var dObj = {
                        tx_id: key,
                        tx_name: val[0].DATIMINGCHENG,
                        tm: ''
                      };
                      tmVal = _.each(val, function(tm, idx, lst){
                        var findVal = _.find(itemDeFenLv, function(item){return item.TIMU_ID == tm.TIMU_ID});
                        tm.itemDeFenLv = (findVal.DEFENLV * 100).toFixed(1);
                        if(typeof(tm.TIGAN) == 'string'){
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
              else{
                itemDeFenLv = '';
                DataService.alertInfFun('pmt', '查询得分率缺少考试ID');
              }
            }
          });
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
        });

      }]);
});
