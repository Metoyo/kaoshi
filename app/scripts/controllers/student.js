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
          queryKaoShi = baseBmAPIUrl + 'chaxun_baoming?token=' + token + '&jigouid=' + defaultJg + '&xuehao=' + xuehao, //查询考试考点
          saveStudentSelect = baseBmAPIUrl + 'modify_baoming_kaosheng'; //保存考生的报名选择

        $scope.bmKaoChang = '';
        $scope.stuParams = {
          selectKaoDian: ''
        };

        /**
         * 根据机构和学号查询报名信息
         */
        $scope.chaXunBaoMing = function(){
          var bmKs, bmKsArr = [];
          DataService.getData(queryKaoShi).then(function(data){
            if(data && data.length){
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
            }
            else{
              DataService.alertInfFun('err', '没有符合的数据！');
            }
          });
        };
        $scope.chaXunBaoMing();

        /**
         * 获得选择的考点
         */
        $scope.getSelectKd = function(val){
          $scope.stuParams.selectKaoDian = val;
        };

        /**
         * 获得选择的考点
         */
        $scope.saveStudentSelcet = function(){
          var kddData = {
            token: token,
            jigouid: defaultJg,
            xuehao: xuehao,
            baoming_id: $scope.stuParams.selectKaoDian.BAOMING_ID,
            baomingkaodian_id: $scope.stuParams.selectKaoDian.BAOMINGKAODIAN_ID,
            baomingkaoshishijian_id: $scope.stuParams.selectKaoDian.BAOMINGKAOSHISHIJIAN_ID
          };
          if(confirm('已经选择不能更改，确定提交？')){
            $http.post(saveStudentSelect, kddData).success(function(data){
              if(data.result){
                DataService.alertInfFun('suc', '保存成功！');
              }
            });
          }
        };


      }]);
});
