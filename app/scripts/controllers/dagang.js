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
        lingyuid = $rootScope.session.defaultLyId,
        chaxunzilingyu = true,

        qryDgUrl = baseAPIUrl + 'chaxun_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan
          + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&chaxunzilingyu=' + chaxunzilingyu,

        qryKnowledgeBaseUrl = baseAPIUrl + 'chaxun_zhishidagang_zhishidian?token=' + token + '&caozuoyuan=' + caozuoyuan
          + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&zhishidagangid=',
        xgMoRenDaGangUrl = baseAPIUrl + 'xiugai_morendagang', //修改机构默认大纲
//        qryKnowledgeUrl, //查询知识点的url
        submitDataUrl = baseAPIUrl + 'xiugai_zhishidagang', //修改/新建知识大纲
        xiuGaiZhiShiDian = baseAPIUrl + 'xiugai_zhishidian', //修改/新建知识点
        dgListLength, //大纲的长度
        dgdata = {};//定义一个空的object用来存放需要保存的数据；根据api需求设定的字段名称

      $rootScope.pageName = "大纲";//页面名称
      $rootScope.isRenZheng = false; //判读页面是不是认证
      $rootScope.dashboard_shown = true;
      $scope.itemTitle = "大纲";

      /**
       * 加载知识大纲
       */
      var loadDaGang = function(){
        $http.get(qryDgUrl).success(function(data) {
          if(data.length){
            $scope.dgList = data;
            dgListLength = data.length;
            _.each(data, function(dg, idx, lst){
              if(dg.ZHUANGTAI2 == 2){
                $scope.defaultDaGang = dg.ZHISHIDAGANGMINGCHENG;
              }
            });
          }
          else {
            addNewDaGang();
          }
        });
      };
      loadDaGang();

      /**
       * 修改默认大纲 xgMoRenDaGangUrl
       */
      $scope.makeDaGangAsDefault = function(dgId){
        var defaultDg = {
          token: token,
          caozuoyuan: caozuoyuan,
          jigouid: jigouid,
          lingyuid: lingyuid,
          dagangid: dgId ? dgId : $scope.currentDgId
        };
        $http.post(xgMoRenDaGangUrl, defaultDg).success(function(result) {
          if(result.result){
            loadDaGang();
          }
        });
      };

      /**
       * 新建知识大纲
       */
      var addNewDaGang = function(){
        var newZhiShiDian ={
            token: token,
            caozuoyuan: caozuoyuan,
            jigouid: jigouid,
            lingyuid: lingyuid,
            shuju: {
              ZHISHIDIAN_ID: '',
              ZHISHIDIANMINGCHENG: $rootScope.session.defaultLyName,
              LEIXING: 2,
              DAIMA: '',
              BIEMING: '',
              ZHUANGTAI: 1
            }
          },
          newDaGang = { //如果没有公共和自建知识大纲，新建一个
            token: token,
            caozuoyuan: caozuoyuan,
            jigouid: jigouid,
            lingyuid: lingyuid,
            shuju: {
              ZHISHIDAGANG_ID: '',
              ZHISHIDAGANGMINGCHENG: $rootScope.session.defaultLyName + '自建知识大纲',
              GENJIEDIAN_ID: '',
              DAGANGSHUOMING: '',
              LEIXING: 2,
              ZHUANGTAI: 1,
              ZHUANGTAI2: 1,
              JIEDIAN: [{
                JIEDIAN_ID: '',
                ZHISHIDIAN_ID: '',
                ZHISHIDIANMINGCHENG: $rootScope.session.defaultLyName,
                ZHISHIDIAN_LEIXING: "",
                JIEDIANLEIXING: 0,
                JIEDIANXUHAO: '',
                ZHUANGTAI: 1,
                ZIJIEDIAN: []
              }]
            }
          };
        //新建知识点
        $http.post(xiuGaiZhiShiDian, newZhiShiDian).success(function(zsd){
          if(zsd.result){
            newDaGang.shuju.GENJIEDIAN_ID = zsd.id;
            newDaGang.shuju.JIEDIAN[0].ZHISHIDIAN_ID = zsd.id;
            //创建知识大纲
            $http.post(submitDataUrl, newDaGang).success(function(data){
              if(data.result){
                $scope.makeDaGangAsDefault(data.id);
                loadDaGang();
              }
              else{
                alert('创建知识大纲失败！');
              }
            });
          }
          else{
            alert('创建知识点失败！');
          }
        });
      };

      /**
       * 加载单独某个大纲详情
       */
      $scope.loadKnowledge = function(lx) {
        var qryKnowledgeUrl = '';
        for(var i = 0; i < dgListLength; i++){
          if($scope.dgList[i].LEIXING == lx){
            var dg = $scope.dgList[i];
            qryKnowledgeUrl = qryKnowledgeBaseUrl + dg.ZHISHIDAGANG_ID;
//            $scope.defaultItemTitle = dg.ZHISHIDAGANGMINGCHENG;
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
          }
        }
        if(lx == 1){
          if(qryKnowledgeUrl){
            $http.get(qryKnowledgeUrl).success(function(data) {
              if(data.length){
                $scope.knowledgePb = data;
                $scope.dgTpl = 'views/partials/daGangPublic.html';
                $scope.isPrivateDg = false;
                $scope.isPublicDg = true;
              }
            });
          }
          else{
            alert('没有公共知识大纲！');
          }
        }
        else{
          if(qryKnowledgeUrl){
            $http.get(qryKnowledgeUrl).success(function(data) {
              if(data.length){
                $scope.knowledgePr = data;
                $scope.dgTpl = 'views/partials/daGangPrivate.html';
                $scope.isPrivateDg = true;
                $scope.isPublicDg = false;
              }
            });
          }
          else{
            alert('没有自建知识大纲！');
          }
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
        dgdata.shuju.JIEDIAN = [$scope.knowledgePr[0]];
        $http.post(submitDataUrl, dgdata).success(function(result) {
          if(result.result){
            $scope.makeDaGangAsDefault($scope.currentDgId);
            alert('修改大纲成功！');
          }
          else{
            alert('修改大纲失败！');
          }
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
