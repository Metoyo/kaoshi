define(['../../jquery/jquery', 'angular', 'config'], function ($, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.DagangCtrl', [])
    .controller('DagangCtrl', function ($rootScope, $scope, $http) {
      //声明变量
      var userInfo = $rootScope.session.userInfo,
        info = $rootScope.session.info,
        baseAPIUrl = config.apiurl_mt, //renzheng的api
        baseMtAPIUrl = config.apiurl_mt, //mingti的api
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
        submitDataUrl = baseAPIUrl + 'xiugai_zhishidagang', //修改/新建知识大纲
        dgListLength, //大纲的长度
        dgdata = {
          token: token,
          caozuoyuan: caozuoyuan,
          jigouid: jigouid,
          lingyuid: lingyuid,
          shuju:{}
        },//定义一个空的object用来存放需要保存的数据；根据api需求设定的字段名称
        daGangJieDianData = [], //定义一个大纲节点的数据
        qryPubZsdUrl = baseMtAPIUrl + 'chaxun_zhishidian?token=' + token + '&caozuoyuan=' + caozuoyuan + '&jigouid='
          + jigouid + '&leixing=1' + '&lingyuid=' + lingyuid, //查询公共知识点的url
        publicZsdgArr = [], //存放公共知识大纲的数组
        privateZsdgArr = [], //存放自建知识大纲的数组
        publicKnowledgeData, //存放领域下的公共知识点
        publicZsdArr; //存放公共知识点的

      $rootScope.pageName = "大纲";//页面名称
      $rootScope.isRenZheng = false; //判读页面是不是认证
      $rootScope.dashboard_shown = true;
      $scope.itemTitle = "大纲";

      /**
       * 加载知识大纲
       */
      var loadDaGang = function(){
        publicZsdgArr = [];
        privateZsdgArr = [];
        $http.get(qryDgUrl).success(function(data) {
          if(data.length){
            $scope.dgList = data;
            dgListLength = data.length;
            _.each(data, function(dg, idx, lst){
              //将大纲分类，分为公共大纲和自建大纲
              if(dg.LEIXING == 1){
                publicZsdgArr.push(dg);
              }
              else{
                privateZsdgArr.push(dg);
              }
              //判断默认知识
              if(dg.ZHUANGTAI2 == 2){
                $scope.defaultDaGang = dg.ZHISHIDAGANGMINGCHENG;
              }
            });
            $scope.publicZsdgList = publicZsdgArr;
            $scope.privateZsdgList = privateZsdgArr;
          }
          else {
            alert('没有自建知识大纲，请新增一个！');
          }
        });
      };
      loadDaGang();

      /**
       *加载对应的大纲页面
       */
      $scope.renderDgPage = function(lx){
        publicKnowledgeData = '';
        publicZsdArr = [];
        if(lx == 1){
          if(!$scope.publicZsdgList){
            alert('没有大纲，请新建一个！');
          }
          $scope.dgTpl = 'views/partials/daGangPublic.html';
          $scope.isPrivateDg = false;
          $scope.isPublicDg = true;
        }
        if(lx == 2){
          if(!$scope.privateZsdgList){
            alert('没有大纲，请新建一个！');
          }
          $scope.loadingImgShow = true; //daGangPublic.html & daGangPrivate.html
          //查询该领域的在公共知识点
          $http.get(qryPubZsdUrl).success(function(ggzsd){
            if(ggzsd.error){
              $scope.loadingImgShow = false; //daGangPublic.html & daGangPrivate.html
              alert('此领域下没有公共知识点！');
              publicKnowledgeData = '';
            }
            else{
              $scope.loadingImgShow = false; //daGangPublic.html & daGangPrivate.html

              publicKnowledgeData = ggzsd;
              $scope.publicKnowledge = ggzsd;
              //得到公共知识点id的数组
              publicZsdArr = _.map(ggzsd, function(szsd){
                return szsd.ZHISHIDIAN_ID;
              });
            }
          });
          $scope.dgTpl = 'views/partials/daGangPrivate.html';
          $scope.isPrivateDg = true;
          $scope.isPublicDg = false;
        }
      };

      /**
       * 获得自建知识大纲获知识点
       */
      $scope.getPrivateDgZsd = function(dgId){
        $scope.loadingImgShow = true; //daGangPublic.html & daGangPrivate.html
        var differentArr, //从已有的公共知识点中减去知识大纲知识点
          needPubZsd, //从已有的公共知识点中找到对应知识点详情
          diffPubZsdArr = [], //存放删除已使用的知识大纲后公共知识大纲
          zsdgZsdArr = []; //存放知识大纲知识点

        //得到知识大纲知识点的递归函数
        function _do(item) {
          zsdgZsdArr.push(item.ZHISHIDIAN_ID);
          if(item.ZIJIEDIAN && item.ZIJIEDIAN.length > 0){
            _.each(item.ZIJIEDIAN, _do);
          }
        }

        if(dgId){
          $scope.currentDgId = dgId;
          //为保存大纲用到的数据赋值
          var privateDg = _.findWhere($scope.privateZsdgList, { ZHISHIDAGANG_ID: dgId });
          dgdata.shuju = {};
          dgdata.shuju.ZHISHIDAGANG_ID = dgId;
          dgdata.shuju.ZHISHIDAGANGMINGCHENG = privateDg.ZHISHIDAGANGMINGCHENG;
          dgdata.shuju.DAGANGSHUOMING = privateDg.DAGANGSHUOMING;
          dgdata.shuju.GENJIEDIAN_ID = privateDg.GENJIEDIAN_ID;
          dgdata.shuju.LEIXING = 2; //自建知识大纲
          dgdata.shuju.ZHUANGTAI = privateDg.ZHUANGTAI;
          dgdata.shuju.JIEDIAN = [];
          //查询大纲知识点
          var qryDgZsdUrl = qryKnowledgeBaseUrl + dgId;
          $http.get(qryDgZsdUrl).success(function(data) {
            if(data.length){
              $scope.loadingImgShow = false; //daGangPublic.html & daGangPrivate.html
              $scope.knowledgePr = data;

              //得到知识大纲知识点id的函数
              _.each(data, _do);

              //从已有的公共知识点中减去知识大纲知识点
              differentArr = _.difference(publicZsdArr, zsdgZsdArr);

              //得到相对应的公共知识大纲知识点
              _.each(differentArr, function(sgzsd, idx, lst){
                needPubZsd = _.findWhere(publicKnowledgeData, { ZHISHIDIAN_ID: sgzsd });
                diffPubZsdArr.push(needPubZsd);
              });
              $scope.publicKnowledge = diffPubZsdArr;
            }
            else{
              $scope.loadingImgShow = false; //daGangPublic.html & daGangPrivate.html
              $scope.knowledgePr = '';
              $scope.publicKnowledge = publicKnowledgeData;
              alert(data.error);
            }
          });
        }
        else{
          //没有所需的大纲时
          $scope.loadingImgShow = false; //daGangPublic.html & daGangPrivate.html
          $scope.knowledgePr = '';
          $scope.publicKnowledge = publicKnowledgeData;
        }
      };

      /**
       * 获得公共知识大纲知识点
       */
      $scope.getPublicDgZsd = function(dgId){
        if(dgId){
          //查询大纲知识点
          $scope.currentDgId = dgId;
          var qryDgZsdUrl = qryKnowledgeBaseUrl + dgId;
          $http.get(qryDgZsdUrl).success(function(data) {
            if(data.length){
              $scope.loadingImgShow = false; //daGangPublic.html & daGangPrivate.html
              $scope.knowledgePb = data;
            }
            else{
              $scope.loadingImgShow = false; //daGangPublic.html & daGangPrivate.html
              $scope.knowledgePb = '';
              alert(data.error);
            }
          });
        }
        else{
          $scope.knowledgePb = '';
        }
      };

      /**
       * 修改默认大纲
       */
      $scope.makeDaGangAsDefault = function(dgId){
        var defaultDg = {
          token: token,
          caozuoyuan: caozuoyuan,
          jigouid: jigouid,
          lingyuid: lingyuid,
          dagangid: dgId || $scope.currentDgId
        };
        $http.post(xgMoRenDaGangUrl, defaultDg).success(function(result) {
          if(result.result){
            loadDaGang();
            alert('将此大纲设置为默认大纲的操作成功！');
          }
          else{
            alert('将此大纲设置为默认大纲的操作失败！');
          }
        });
      };

      /**
       * 新增一个自建知识大纲
       */
      $scope.addNewZjDg = function(){
        var jieDianObj = {};
        //保存大纲时的数据
        dgdata.shuju = {};
        dgdata.shuju.ZHISHIDAGANG_ID = '';
        dgdata.shuju.ZHISHIDAGANGMINGCHENG = $rootScope.session.defaultLyName + '自建知识大纲';
        dgdata.shuju.DAGANGSHUOMING = '';
        dgdata.shuju.GENJIEDIAN_ID = '';
        dgdata.shuju.LEIXING = 2; //自建知识大纲
        dgdata.shuju.ZHUANGTAI = 1;
        dgdata.shuju.JIEDIAN = [];

        //保存大纲是用到的第一级子节点
        $scope.knowledgePr = ''; //重置公共知识大纲知识点
        daGangJieDianData = []; //定义一个大纲节点的数据
        jieDianObj.JIEDIAN_ID = '';
        jieDianObj.ZHISHIDIAN_ID = '';
        jieDianObj.ZHISHIDIANMINGCHENG = $rootScope.session.defaultLyName + '自建知识大纲';
        jieDianObj.ZHISHIDIAN_LEIXING = 2;
        jieDianObj.LEIXING = 2;
        jieDianObj.JIEDIANLEIXING = '';
        jieDianObj.JIEDIANXUHAO = 1;
        jieDianObj.ZHUANGTAI = 1;
        jieDianObj.ZIJIEDIAN = [];
        daGangJieDianData.push(jieDianObj);
        $scope.knowledgePr = daGangJieDianData;
      };

      /**
       * 添加知识点
       */
      $scope.addNd = function(nd) {
        var newNd = {};
        newNd.JIEDIAN_ID = '';
        newNd.ZHISHIDIAN_ID = '';
        newNd.JIEDIANLEIXING = '';
        newNd.JIEDIANXUHAO = nd.ZIJIEDIAN.length + 1;
        newNd.ZHUANGTAI = 1;
        newNd.ZHISHIDIANMINGCHENG = '';
        newNd.LEIXING = 2;
        newNd.ZHISHIDIAN_LEIXING = 2;
        newNd.ZIJIEDIAN = [];
        nd.ZIJIEDIAN.push(newNd);
      };

      /**
       * 删除知识点
       */
      $scope.removeNd = function(parentNd, nd, idx) {
        function getPubZsd(item) {
          if(item.LEIXING == 1){
            var pubZsdObj = _.findWhere(publicKnowledgeData, { ZHISHIDIAN_ID: item.ZHISHIDIAN_ID });
            $scope.publicKnowledge.push(pubZsdObj);
            if(item.ZIJIEDIAN && item.ZIJIEDIAN.length > 0) {
              _.each(item.ZIJIEDIAN, getPubZsd);
            }
          }
        }
        getPubZsd(nd);
        parentNd.ZIJIEDIAN.splice(idx, 1);
      };

      /**
       * 那一个输入框被选中
       */
      var targetInput, targetNd;
      $scope.privateDgInputIdx = function(event, nd){
        targetInput = $(event.target);
        targetNd = nd;
      };

      /**
       * 将公共知识点添加到知识大纲
       */
      $scope.addToZjDaGang = function(zsd, idx){
        targetNd.ZHISHIDIAN_ID = zsd.ZHISHIDIAN_ID;
        targetNd.ZHISHIDIANMINGCHENG = zsd.ZHISHIDIANMINGCHENG;
        targetNd.LEIXING = zsd.LEIXING;
//        targetInput.focus();
        targetNd = '';
        $scope.publicKnowledge.splice(idx, 1);
      };

      /**
       * 当输入介绍后检查公共知识大纲中是否已经存在知识点
       */
      $scope.compareZjInputVal = function(nd){
        var str  = nd.ZHISHIDIANMINGCHENG;
        str = str.replace(/\s+/g,"");
        var result = _.findWhere($scope.publicKnowledge, { ZHISHIDIANMINGCHENG: str });
        if(result){
          nd.ZHISHIDIAN_ID = result.ZHISHIDIAN_ID;
          nd.ZHISHIDIANMINGCHENG = result.ZHISHIDIANMINGCHENG;
          nd.LEIXING = result.LEIXING;
          $scope.publicKnowledge = _.reject($scope.publicKnowledge, function(pkg){
            return pkg.ZHISHIDIAN_ID == result.ZHISHIDIAN_ID;
          });
        }
      };

      /**
       * 保存知识大纲
       */
      $scope.saveZjDaGangData = function() {
        var countEmpty = true;
        $scope.loadingImgShow = true; //daGangPublic.html & daGangPrivate.html
        //将LEIXING转化为ZHISHIDIAN_LEIXING
        function _do(item) {
          item.ZHISHIDIAN_LEIXING = item.LEIXING || 2;
          item.ZHISHIDIANMINGCHENG = item.ZHISHIDIANMINGCHENG.replace(/\s+/g,"");
          if(!item.ZHISHIDIANMINGCHENG){
            countEmpty = false;
          }
          delete item.LEIXING;
          if (item.ZIJIEDIAN && item.ZIJIEDIAN.length > 0) {
            _.each(item.ZIJIEDIAN, _do);
          }
        }
        dgdata.shuju.ZHISHIDAGANGMINGCHENG = $scope.knowledgePr[0].ZHISHIDIANMINGCHENG;
        dgdata.shuju.JIEDIAN = $scope.knowledgePr;
        _.each(dgdata.shuju.JIEDIAN, _do);
        if(countEmpty){
          $http.post(submitDataUrl, dgdata).success(function(result) {
            if(result.result){
              $scope.loadingImgShow = false; //daGangPublic.html & daGangPrivate.html
              $('.save-msg').show().fadeOut(3000);
              $scope.makeDaGangAsDefault(result.id);
            }
            else{
              $scope.loadingImgShow = false; //daGangPublic.html & daGangPrivate.html
              alert('修改大纲失败！');
            }
          });
        }
        else{
          $scope.loadingImgShow = false; //rz_setDaGang.html
          alert('知识点名称不能为空！');
        }
      };

      /**
       * 返回大纲首页
       */
      $scope.backToDaGangHome = function(){
        $scope.isPrivateDg = false;
        $scope.isPublicDg = false;
        $scope.dgTpl = 'views/partials/daGangHome.html';
      };

    });
});