define(['jquery', 'angular', 'config'], function ($, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.MingtiCtrl', [])
    .controller('MingtiCtrl', function ($rootScope, $scope, $http) {
      //操作title
      $rootScope.pageName = "命题"; //page title
      //$scope.cssPath = "mingti"; //调用样式文件mingti.css
      $rootScope.styles = [
        'styles/mingti.css'
      ];
      $rootScope.dashboard_shown = true;

      //声明变量
      var baseRzAPIUrl = config.apiurl_rz, //renzheng的api
          baseMtAPIUrl = config.apiurl_mt, //mingti的api
          token = config.token,
          caozuoyuan = 1057,
          jigouid = 2,
          lingyuid = 2,
          chaxunzilingyu = true,

          qryLingYuUrl = baseRzAPIUrl + 'lingyu?token=' + token, //查询科目的url

          qryKmTx = baseMtAPIUrl + 'chaxun_kemu_tixing?token=' + token + '&caozuoyuan=' + caozuoyuan + '&jigouid=' +
                    jigouid + '&lingyuid=' + lingyuid, //查询科目包含什么题型的url

          qryDgUrl = baseMtAPIUrl + 'chaxun_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan
              + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&chaxunzilingyu=' + chaxunzilingyu,//查询大纲的url

          qryKnowledgeBaseUrl = baseMtAPIUrl + 'chaxun_zhishidagang_zhishidian?token=' + token + '&caozuoyuan=' +
              caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&zhishidagangid=', //查询知识点基础url

          qryKnowledge = ''; //定义一个空的查询知识点的url

      //初始化是DOM元素的隐藏和显示
      $scope.keMuList = true; //科目选择列表内容隐藏
      $scope.dgListBox = true; //大纲选择列表隐藏
      $scope.showNd2 = false;
      $scope.showNd3 = false;
      //查询科目（LingYu，url：/api/lingyu）
      $scope.loadLingYu = function(){
          if($scope.keMuList){
              $http.get(qryLingYuUrl).success(function(data){
                  $scope.lyList = data;
                  $scope.keMuList = false; //选择的科目render完成后列表显示
              });
          }
          else{
              $scope.keMuList = true;
          }
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
      $scope.showDgList = function(dgl){//dgl是判断dagang有没有数据
          if(dgl.length){
              $scope.dgListBox = $scope.dgListBox === false ? true: false; //点击是大纲列表展现
          }
      };

      //加载大纲知识点
      $scope.loadDgZsd = function(dgId){
          qryKnowledge = qryKnowledgeBaseUrl + dgId;
          $http.get(qryKnowledge)
              .success(function(data){
                  $scope.kowledgeList = data;
                  $scope.dgListBox = true;
              })
              .error(function(err){
                  alert(err);
              });
      };

      //点击展开和收起的按钮子一级显示和隐藏
      $scope.toggleChildNode = function(idx){
          $scope.isClicked = true;
          var nodeLI = '$scope.showNd3' + idx;
          nodeLI = true;
      };

      // 点击checkbox得到checkbox的值
      $scope.toggleSelection = function toggleSelection(zsdId) {
          var idx = $scope.selection.indexOf(zsdId);

          // is currently selected
          if (idx > -1) {
              $scope.selection.splice(idx, 1);
          }
          // is newly selected
          else {
              $scope.selection.push(zsdId);
          }

          console.log($scope.selection);
      };

    });
});
