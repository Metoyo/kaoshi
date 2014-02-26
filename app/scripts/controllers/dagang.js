define(['jquery', 'angular', 'config'], function ($, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.DagangCtrl', [])
    .controller('DagangCtrl', function ($rootScope, $scope, $http) {
      //声明变量
      var userInfo = $rootScope.session.userInfo,
          baseAPIUrl = config.apiurl_mt,
          token = config.token,
          caozuoyuan = userInfo.UID,
          jigouid = userInfo.JIGOU[0].JIGOU_ID,
          lingyuid = userInfo.LINGYU[0].LINGYU_ID,
          chaxunzilingyu = true,

          qryDgUrl = baseAPIUrl + 'chaxun_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan
            + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&chaxunzilingyu=' + chaxunzilingyu,

          qryKnowledgeBaseUrl = baseAPIUrl + 'chaxun_zhishidagang_zhishidian?token=' + token + '&caozuoyuan=' + caozuoyuan
            + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&zhishidagangid=',

          qryKnowledgeUrl = '',
          submitDataUrl = baseAPIUrl + 'xiugai_zhishidagang',

          dgdata = {};//定义一个空的object用来存放需要保存的数据；根据api需求设定的字段名称

      $rootScope.pageName = "大纲";//页面名称
      $rootScope.styles = [
        'styles/dagang.css'
      ]; //调用dagang.css
      $rootScope.dashboard_shown = true;
      $scope.saveDagangBtn = true; // 大纲保存按钮隐藏
      $scope.dgWelcome = true; // 默认情况下显示welcome页面
      $scope.itemTitle = "大纲";

      $http.get(qryDgUrl).success(function(data) {
          $scope.dgList = data;
      });

      $scope.loadKnowledge = function(dg) {
        qryKnowledgeUrl = qryKnowledgeBaseUrl + dg.ZHISHIDAGANG_ID;
        $scope.itemTitle = dg.ZHISHIDAGANGMINGCHENG;
        $scope.currentDgId = dg.ZHISHIDAGANG_ID;
        dgdata.token = token;
        dgdata.caozuoyuan = caozuoyuan;
        dgdata.jigouid = jigouid;
        dgdata.lingyuid = lingyuid;
        dgdata.shuju = dgdata.shuju || {};
        dgdata.shuju.ZHISHIDAGANG_ID = dg.ZHISHIDAGANG_ID;//知识点id
        dgdata.shuju.ZHISHIDAGANGMINGCHENG = dg.ZHISHIDAGANGMINGCHENG;//知识大纲名称
        dgdata.shuju.GENJIEDIAN_ID = dg.GENJIEDIAN_ID;//根节点id
        dgdata.shuju.LEIXING = dg.LEIXING;//知识大纲类型
        dgdata.shuju.DAGANGSHUOMING = '';
        dgdata.shuju.ZHUANGTAI = dg.ZHUANGTAI;//大纲状态
        $http.get(qryKnowledgeUrl).success(function(data) {
            $scope.knowledge = data;
            $scope.saveDagangBtn = false;//大纲保存按钮显示
        });
        $scope.dgWelcome = false;//点击大纲后隐藏欢迎页面
      };

      $scope.addNd = function(nd) {
        var newNd = {};

        newNd.JIEDIAN_ID = '';
        newNd.ZHISHIDAGANG_ID = $scope.currentDgId;
        //newNd.ZHISHIDIAN_ID = nd.ZHISHIDIAN_ID;
        newNd.ZHISHIDIAN_ID = '';
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
        dgdata.shuju = dgdata.shuju || {};
        dgdata.shuju.JIEDIAN = [$scope.knowledge[0]];
        /*$http.post(submitDataUrl, $scope.knowledge[0]).success(function(result) {
         console.log(result);
         });*/
        $http.post(submitDataUrl, dgdata).success(function(result) {
            console.log(result);
            alert('提交成功！');
        });
      };

    });
});