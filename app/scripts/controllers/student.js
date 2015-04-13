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
          qryBmCcBase = baseBmAPIUrl + 'query_baoming_changci?token=' + token + '&jigouid=' + defaultJg + '&xuehao=' + xuehao; //查询考生有几场考试

        $scope.bmKaoChang = '';
        $scope.stuParams = {
          selectKaoDian: '',
          hasBaoMing: true
        };
        $scope.kaoShiArrs = '';

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
                  ksKc: ''
                };
                bmksObj.ksStart = k;
                bmksObj.ksKc = v;
                bmksObj.ksEnd = v[0].JIESHUSHIJIAN;
                bmKsArr.push(bmksObj);
              });
              $scope.bmKaoChang = bmKsArr;
              $scope.stuParams.hasBaoMing = false;
            }
            else{
              DataService.alertInfFun('err', '没有符合的数据！');
            }
          });
        };

        /**
         * 查询考生是否已经报名
         */
        //var qryKaoShengHasBaoMing = function(){
        //  var qryKsBmState = qryKsBmStateBase + '&jigouid=' + defaultJg + '&xuehao=' + xuehao;
        //  DataService.getData(qryKsBmState).then(function(ksInfo){
        //    if(ksInfo && ksInfo.length){
        //      if(ksInfo[0].BAOMINGKAODIAN_ID && ksInfo[0].BAOMINGKAOSHISHIJIAN_ID){
        //        $scope.stuParams.hasBaoMing = true;
        //        DataService.alertInfFun('pmt', '你已报名，请等待考试！');
        //      }
        //      else{
        //        chaXunBaoMing();
        //      }
        //    }
        //  });
        //};

        /**
         * 获得选择的考点//
         */
        $scope.getSelectKd = function(val){
          $scope.stuParams.selectKaoDian = val;
        };

        /**
         * 获得选择的考点
         */
        $scope.saveStudentSelcet = function(){
          if($scope.stuParams.selectKaoDian){
            var kddData = {
              token: token,
              jigouid: defaultJg,
              xuehao: xuehao,
              baoming_id: $scope.stuParams.selectKaoDian.BAOMING_ID,
              baomingkaodian_id: $scope.stuParams.selectKaoDian.BAOMINGKAODIAN_ID,
              baomingkaoshishijian_id: $scope.stuParams.selectKaoDian.BAOMINGKAOSHISHIJIAN_ID
            };
            if(confirm('已经选择不能更改，确定提交？')){
              var qryKaoDianRenShu = qryKaoDianRenShuBase + '&baoming_id=' + kddData.baoming_id;
              qryKaoDianRenShu += '&baomingkaodian_id=' + kddData.baomingkaodian_id;
              qryKaoDianRenShu += '&baomingkaoshishijian_id=' + kddData.baomingkaoshishijian_id;
              DataService.getData(qryKaoDianRenShu).then(function(kdRenShu){
                console.log(kdRenShu);
                if(kdRenShu[0].bmNums < $scope.stuParams.selectKaoDian.KAOWEI){
                  $http.post(saveStudentSelect, kddData).success(function(data){
                    if(data.result){
                      $scope.bmKaoChang = '';
                      DataService.alertInfFun('suc', '保存成功！');
                      $scope.stuParams.hasBaoMing = false;
                      chaXunBaoMingChangCi();
                    }
                  });
                }
                else{
                  DataService.alertInfFun('pmt', '此时间段的本考场已没有空余考位，请重新选择！');
                }
              });

            }
          }
          else{
            DataService.alertInfFun('pmt', '请选择考试场次！');
          }
        };

      }]);
});
