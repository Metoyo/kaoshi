define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.ZujuanCtrl', [])
    .controller('ZujuanCtrl', ['$rootScope', '$scope', '$http',
      function ($rootScope, $scope, $http) {
      /**
       * 操作title
       */
      $rootScope.pageName = "组卷"; //page title
      $rootScope.styles = [
        'styles/zujuan.css'
      ];
      $rootScope.dashboard_shown = true;

      /**
       * 声明变量
       */
      var userInfo = $rootScope.session.userInfo,
        baseMtAPIUrl = config.apiurl_mt, //mingti的api
        token = config.token,
        caozuoyuan = userInfo.UID,//登录的用户的UID
        jigouid = userInfo.JIGOU[0].JIGOU_ID,
        lingyuid = userInfo.LINGYU[0].LINGYU_ID,
        chaxunzilingyu = true,
        qryDgUrl = baseMtAPIUrl + 'chaxun_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan
          + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&chaxunzilingyu=' + chaxunzilingyu,//查询大纲的url

        qryKnowledgeBaseUrl = baseMtAPIUrl + 'chaxun_zhishidagang_zhishidian?token=' + token + '&caozuoyuan=' +
          caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&zhishidagangid=', //查询知识点基础url
        qryKnowledge = '', //定义一个空的查询知识点的url
        selectZsd,//定义一个选中知识点的变量（数组)
        zhishidian_id = ''; //用于根据知识点查询题目的字符串

      /**
       * 初始化是DOM元素的隐藏和显示
       */
      $scope.keMuList = true; //科目选择列表内容隐藏
      $scope.dgListBox = true; //大纲选择列表隐藏
      $scope.kmTxWrap = true; //初始化的过程中，题型和难度DOM元素显示
      $scope.letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; //题支的序号

      /**
       * 获得大纲数据
       */
      $http.get(qryDgUrl).success(function(data){
        var newDgList = [];
        _.each(data, function(dg, idx, lst){
          if(dg.LEIXING == 1){
            newDgList.push(dg);
          }
          if(dg.LEIXING == 2){
            newDgList.unshift(dg);
          }
        });
        $scope.dgList = newDgList;

        //获取大纲知识点
        qryKnowledge = qryKnowledgeBaseUrl + newDgList[0].ZHISHIDAGANG_ID;
        $http.get(qryKnowledge).success(function(data){
          $scope.kowledgeList = data;
          $scope.dgListBox = true;
        }).error(function(err){
            alert(err);
          });
      });

      /**
       *查询科目（LingYu，url：/api/ling yu）
       */
      $scope.lyList = userInfo.LINGYU; //从用户详细信息中得到用户的lingyu
      $scope.loadLingYu = function(){
        if($scope.keMuList){
          $scope.keMuList = false;
        }
        else{
          $scope.keMuList = true;
        }
      };

      /**
       * 点击,显示大纲列表
       */
      $scope.showDgList = function(dgl){ //dgl是判断da gang有没有数据
        if(dgl.length){
          $scope.dgListBox = $scope.dgListBox === false ? true: false; //点击是大纲列表展现
        }
      };

      /**
       * 加载大纲知识点
       */
      $scope.loadDgZsd = function(dg){
        angular.element(".selectDgName").html(dg.ZHISHIDAGANGMINGCHENG); //切换大纲名称
        qryKnowledge = qryKnowledgeBaseUrl + dg.ZHISHIDAGANG_ID;
        $http.get(qryKnowledge).success(function(data){
          $scope.kowledgeList = data;
          $scope.dgListBox = true;
        }).error(function(err){
            alert(err);
          });
      };

      /**
       * 点击展开和收起的按钮子一级显示和隐藏
       */
      $scope.toggleChildNode = function(idx) {
        var onClass = '.node' + idx,//得到那个button被点击了
          gitThisBtn = angular.element(onClass),//得到那个展开和隐藏按钮被点击了
          getTargetChild = gitThisBtn.closest('li').find('>ul');//得到要隐藏的ul
        gitThisBtn.toggleClass('unfoldBtn');
        getTargetChild.toggle();//实现子元素的显示和隐藏
      };

      /**
       点击checkbox得到checkbox的值(既是大纲知识点的值)
       */
      $scope.toggleSelection = function(zsdId) {
        var onSelect = '.select' + zsdId,
          gitThisChbx = angular.element(onSelect),//得到那个展开和隐藏按钮被点击了
          getTarChbxChild = gitThisChbx.closest('li').find('>ul');//得到要隐藏的ul;
        gitThisChbx.closest('li').find('div.foldBtn').addClass('unfoldBtn'); //得到相邻的foldBtn元素,添加unfoldBtn样式
        gitThisChbx.closest('li').find('ul').show();//下面的子元素全部展开

        getTarChbxChild.find('input[name=point]').each(function() {
          if(gitThisChbx.prop("checked")) {
            this.checked = true;
          } else {
            this.checked = false;
          }
        });

        selectZsd = [];
        var cbArray = $('input[name=point]'),
          cbl = cbArray.length;
        for( var i = 0; i < cbl; i++) {
          if(cbArray.eq(i).prop("checked")) {
            selectZsd.push(cbArray[i].value);
          }
        }
        zhishidian_id = selectZsd.toString();

        console.log(zhishidian_id);
      };

    }]);
});
