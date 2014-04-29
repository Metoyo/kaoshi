define(['jquery', 'angular', 'config'], function ($, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.DagangCtrl', [])
    .controller('DagangCtrl', function ($rootScope, $scope, $http) {
      //声明变量
      var userInfo = $rootScope.session.userInfo,
        info = $rootScope.session.info,
        baseAPIUrl = config.apiurl_mt,
        token = config.token,
        caozuoyuan = info.UID,
        jigouid = userInfo.JIGOU[0].JIGOU_ID,
        lingyuid = userInfo.LINGYU[0].LINGYU_ID,
        chaxunzilingyu = true,

        qryDgUrl = baseAPIUrl + 'chaxun_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan
          + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&chaxunzilingyu=' + chaxunzilingyu,

        qryKnowledgeBaseUrl = baseAPIUrl + 'chaxun_zhishidagang_zhishidian?token=' + token + '&caozuoyuan=' + caozuoyuan
          + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&zhishidagangid=',

        qryKnowledgeUrl = '',
        submitDataUrl = baseAPIUrl + 'xiugai_zhishidagang',
        dgListLength, //大纲的长度
        dgdata = {};//定义一个空的object用来存放需要保存的数据；根据api需求设定的字段名称

      $rootScope.pageName = "大纲";//页面名称
      $rootScope.isRenZheng = false; //判读页面是不是认证
      $rootScope.dashboard_shown = true;
      $scope.itemTitle = "大纲";

      /**
       * 加载知识大纲
       */
      $http.get(qryDgUrl).success(function(data) {
        if(data.length){
          $scope.dgList = data;
          dgListLength = data.length;
        }
      });

      /**
       * 加载单独某个大纲详情
       */
      $scope.loadKnowledge = function(lx) {
        for(var i = 0; i < dgListLength; i++){
          if($scope.dgList[i].LEIXING == lx){
            var dg = $scope.dgList[i];
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
            });
          }
        }
        if(lx == 1){
          $scope.isPrivateDg = false;
          $scope.isPublicDg = true;
          $scope.dgTpl = 'views/partials/daGangPublic.html';
        }
        else{
          $scope.dgTpl = 'views/partials/daGangPrivate.html';
          $scope.isPrivateDg = true;
          $scope.isPublicDg = false;
        }
      };

      /**
       * 添加知识点
       */
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

      /**
       * 删除知识点
       */
      $scope.removeNd = function(parentNd, idx) {
          parentNd.ZIJIEDIAN.splice(idx, 1);
      };

      /**
       * 保存知识大纲
       */
      $scope.submitData = function() {
        dgdata.shuju = dgdata.shuju || {};
        dgdata.shuju.JIEDIAN = [$scope.knowledge[0]];
        /*$http.post(submitDataUrl, $scope.knowledge[0]).success(function(result) {
         console.log(result);
         });*/
        $http.post(submitDataUrl, dgdata).success(function(result) {
            alert('提交成功！');
        });
      };

      /**
       * 返回大纲首页
       */
      $scope.backToDaGangHome = function(){
        $scope.isPrivateDg = false;
        $scope.isPublicDg = false;
        $scope.dgTpl = 'views/partials/daGangHome.html';
      }

    });
});
