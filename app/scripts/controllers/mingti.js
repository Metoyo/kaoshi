define(['angular'], function (angular) {
  'use strict';

  angular.module('kaoshiApp.controllers.MingtiCtrl', [])
    .controller('MingtiCtrl', function ($rootScope, $scope, $http) {
      //声明变量
      var baseRzAPIUrl = 'http://192.168.1.111:3000/api/',
          baseMtAPIUrl = 'http://192.168.1.111:4000/api/',
          token = "12345",
          qryLingYuUrl = baseRzAPIUrl + 'lingyu?token=' + token;

      //初始化是DOM元素的隐藏和显示
      $scope.keMuList = true;//科目选择列表内容隐藏

      //操作title
      $rootScope.pageName = "命题";//page title
      $rootScope.cssPath = "mingti";//调用样式文件mingti.css

      //查询科目（LingYu，url：/api/lingyu）
      $scope.loadLingYu = function(){
          $http.get(qryLingYuUrl).success(function(data){
              $scope.lyList = data;
              $scope.keMuList = false;//选择的科目render完成后列表显示
          });
      };
    });
});
