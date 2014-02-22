define(['jquery', 'angular'], function ($, angular) {
  'use strict';

  angular.module('kaoshiApp.controllers.MingtiCtrl', [])
    .controller('MingtiCtrl', function ($rootScope, $scope, $http) {
      //操作title
      $rootScope.pageName = "命题"; //page title
      //$scope.cssPath = "mingti"; //调用样式文件mingti.css
      $rootScope.styles = [
        'styles/mingti.css'
      ];

      //声明变量
      var baseRzAPIUrl = 'http://192.168.1.111:3000/api/', //renzheng的api
          baseMtAPIUrl = 'http://192.168.1.111:4000/api/', //mingti的api
          token = "12345",
          caozuoyuan = 1057,
          jigouid = 2,
          lingyuid = 2,
          chaxunzilingyu = true,
          qryLingYuUrl = baseRzAPIUrl + 'lingyu?token=' + token, //查询科目的url
          qryKmTx = baseMtAPIUrl + 'chaxun_kemu_tixing?token=' + token + '&caozuoyuan=' + caozuoyuan + '&jigouid=' +
                    jigouid + '&lingyuid=' + lingyuid, //查询科目包含什么题型的url

          qryDgUrl = baseMtAPIUrl + 'chaxun_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan
              + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&chaxunzilingyu=' + chaxunzilingyu;

      //初始化是DOM元素的隐藏和显示
      $scope.keMuList = true; //科目选择列表内容隐藏
      $scope.dgListBox = true; //大纲选择列表隐藏

      //查询科目（LingYu，url：/api/lingyu）
      $scope.loadLingYu = function(){
          $http.get(qryLingYuUrl).success(function(data){
              $scope.lyList = data;
              $scope.keMuList = false; //选择的科目render完成后列表显示
          });
      };

      //查询科目题型(chaxun_kemu_tixing?token=12345&caozuoyuan=1057&jigouid=2&lingyuid=2)
      $scope.cxKmTxAndDg = function(){
          $http.get(qryKmTx).success(function(data){
              $scope.kmtxList = data;
              $scope.keMuList = true; //选择的科目render完成后列表显示
          });
          $http.get(qryDgUrl).success(function(data){
              $scope.dgList = data;
          });
      };

      //点击,显示大纲列表
      $scope.showDgList = function(){
          $scope.dgListBox = false; //点击是大纲列表展现
      };

    });
});
