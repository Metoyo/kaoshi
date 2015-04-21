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
        var userInfo = $rootScope.session.userInfo,
          defaultJg = userInfo.JIGOU,
          xuehao = userInfo.xuehao,
          baseBmAPIUrl = config.apiurl_bm, //报名的api
          token = config.token,
          queryKaoShiBase = baseBmAPIUrl + 'chaxun_baoming?token=' + token + '&jigouid=' + defaultJg +
            '&xuehao=' + xuehao + '&baoming_id=', //查询考试考点
          saveStudentSelect = baseBmAPIUrl + 'modify_baoming_kaosheng', //保存考生的报名选择
          qryKaoDianRenShuBase = baseBmAPIUrl + 'query_kaodian_renshu?token=' + token, //查询次考场报了多少人
          //qryKsBmStateBase = baseBmAPIUrl + 'query_kaosheng_baoming_state?token=' + token, //查询考生是否已经报名
          qryBmCcBase = baseBmAPIUrl + 'query_baoming_changci?token=' + token + '&jigouid=' + defaultJg +
            '&xuehao=' + xuehao, //查询考生有几场考试
          qryKsDetailBase = baseBmAPIUrl + 'query_kaoshi_detail?token=' + token; //查询考试详情

        $scope.bmKaoChang = '';
        $scope.stuParams = {
          selectKaoDian: '',
          hasBaoMing: true
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
              $scope.kaoShiArrs = data;
            }
          });
        };
        chaXunBaoMingChangCi();

        /**
         * 根据机构和学号查询报名信息
         */
        $scope.chaXunBaoMing = function(ks){
          var bmKs, bmKsArr = [],queryKaoShi;
          queryKaoShi = queryKaoShiBase + ks.BAOMING_ID;
          DataService.getData(queryKaoShi).then(function(data){
            if(data && data.length){
              console.log(data);
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
          var kdInfo = $scope.stuParams.selectKaoDian,
            kddData = {
              token: token,
              jigouid: defaultJg,
              xuehao: xuehao,
              kaowei: kdInfo.KAOWEI,
              baoming_id: kdInfo.BAOMING_ID,
              baomingkaodian_id: kdInfo.BAOMINGKAODIAN_ID,
              baomingkaoshishijian_id: kdInfo.BAOMINGKAOSHISHIJIAN_ID
            },
            qryKaoDianRenShu = qryKaoDianRenShuBase + '&baoming_id=' + kddData.baoming_id;
          qryKaoDianRenShu += '&baomingkaodian_id=' + kddData.baomingkaodian_id;
          qryKaoDianRenShu += '&baomingkaoshishijian_id=' + kddData.baomingkaoshishijian_id;
          DataService.getData(qryKaoDianRenShu).then(function(kdRenShu){
            console.log(kdRenShu);
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

      }]);
});
