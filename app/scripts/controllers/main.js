define(['angular'], function (angular) {
  'use strict';

  angular.module('kaoshiApp.controllers.MainCtrl', [])
    .controller('MainCtrl', function ($scope, $http) {

      var baseAPIUrl = 'http://www.taianting.com:4000/api/',
          token = '12345',
          caozuoyuan = 1057,
          jigouid = 2,
          lingyuid = 2,
          chaxunzilingyu = true,

          qryDgUrl = baseAPIUrl + 'chaxun_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan
              + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&chaxunzilingyu=' + chaxunzilingyu,

          qryKnowledgeBaseUrl = baseAPIUrl + 'chaxun_zhishidagang_zhishidian?token=' + token + '&caozuoyuan=' + caozuoyuan
              + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&zhishidagangid=',

          qryKnowledgeUrl = '',
          submitDataUrl = baseAPIUrl + 'xiugai_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan
              + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid;

      $scope.showSaveBtn = false;

      $http.get(qryDgUrl).success(function(data) {
          $scope.dgList = data;
      });



      $scope.loadKnowledge = function(dgId) {
          qryKnowledgeUrl = qryKnowledgeBaseUrl + dgId;
          $scope.currentDgId = dgId;
          $http.get(qryKnowledgeUrl).success(function(data) {
              $scope.knowledge = data;
              $scope.showSaveBtn = true;
          });
      };

      $scope.addNd = function(nd) {
          var newNd = {};

          newNd.JIEDIAN_ID = '';
          newNd.ZHISHIDAGANG_ID = $scope.currentDgId;
          newNd.ZHISHIDIAN_ID = nd.ZHISHIDIAN_ID;
          newNd.JIEDIANLEIXING = 1;
          newNd.FUJIEDIAN_ID = nd.JIEDIAN_ID;
          newNd.JIEDIANXUHAO = nd.ZIJIEDIAN.length + 1;
          newNd.ZHUANGTAI = nd.ZHUANGTAI;
          newNd.ZHISHIDIANMINGCHENG = '';
          newNd.LEIXING = nd.LEIXING;
          newNd.ZHISHIDIAN_LEIXING = '';
          newNd.ZIJIEDIAN = [];

          nd.ZIJIEDIAN.push(newNd);
      };

      $scope.removeNd = function(parentNd, idx) {
          parentNd.ZIJIEDIAN.splice(idx, 1);
      };

      $scope.submitData = function() {
          console.log('submit data: ' + JSON.stringify($scope.knowledge[0]));
          /*$http.post(submitDataUrl, $scope.knowledge[0]).success(function(result) {
              console.log(result);
          });*/

          $http({
              url:submitDataUrl,
              method:"POST",
              headers: {
                  'Authorization': 'Basic dGVzdDp0ZXN0',
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: $scope.knowledge[0]
          }).success(function(result) {
                  console.log(result);
              });
      };
    });
});
