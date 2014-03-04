define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.MingtiCtrl', [])
    .controller('MingtiCtrl', ['$rootScope', '$scope', '$http',
      function ($rootScope, $scope, $http) {
        /**
         * 操作title
         */
      $rootScope.pageName = "命题"; //page title
      $rootScope.styles = [
        'styles/mingti.css'
      ];
      $rootScope.dashboard_shown = true;

      /**
       * 声明变量
       */
      var userInfo = $rootScope.session.userInfo,
          baseRzAPIUrl = config.apiurl_rz, //renzheng的api
          baseMtAPIUrl = config.apiurl_mt, //mingti的api
          token = config.token,
          caozuoyuan = userInfo.UID,//等到用户的UID
          jigouid = userInfo.JIGOU[0].JIGOU_ID,
          lingyuid = userInfo.LINGYU[0].LINGYU_ID,
          chaxunzilingyu = true,

          qryLingYuUrl = baseRzAPIUrl + 'lingyu?token=' + token, //查询科目的url

          qryKmTx = baseMtAPIUrl + 'chaxun_kemu_tixing?token=' + token + '&caozuoyuan=' + caozuoyuan + '&jigouid=' +
                    jigouid + '&lingyuid=', //查询科目包含什么题型的url

          qryDgUrl = baseMtAPIUrl + 'chaxun_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan
              + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&chaxunzilingyu=' + chaxunzilingyu,//查询大纲的url

          qryKnowledgeBaseUrl = baseMtAPIUrl + 'chaxun_zhishidagang_zhishidian?token=' + token + '&caozuoyuan=' +
              caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&zhishidagangid=', //查询知识点基础url

          xgtmUrl = baseMtAPIUrl + 'xiugai_timu', //保存添加题型的url

          qryKnowledge = '', //定义一个空的查询知识点的url
          selectZsd, //定义一个选中知识点的变量
          timu_data = { //题目类型的数据格式公共部分
            token: config.token,
            caozuoyuan: userInfo.UID,
            jigouid: jigouid,
            lingyuid: lingyuid,
            shuju: {
              TIMU_ID: '',
              TIXING_ID: '',
              TIMULEIXING_ID: 1,
              NANDU_ID: '',
              TIMULAIYUAN_ID: '',
              PINGFENFANGSHI_ID: '',
              FUZITI_LEIXING: '',
              FUTI_ID: '',
              TIGAN:'',
              DAAN: '',
              TISHI: '',
              YUEJUANBIAOZHUN: '',
              TIMUFENXI: '',
              ISFENDUANPINGFEN: '',
              TIMUWENJIAN:[

              ],
              ZHISHIDIAN: [],
              ZHUANGTAI: 1
            }
          };
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
       * 查询科目题型(chaxun_kemu_tixing?token=12345&caozuoyuan=1057&jigouid=2&lingyuid=2)
       */
      $http.get(qryKmTx + userInfo.LINGYU[0].LINGYU_ID).success(function(data){ //明天页面加载的时候调用科目题型
        $scope.kmtxList = data;
        $scope.keMuList = true; //选择的科目render完成后列表显示
      });

      $scope.cxKmTx = function(lyt){

        angular.element(".selectLyName").html(lyt.LINGYUMINGCHENG); //切换科目的名称

        $http.get(qryKmTx + lyt.LINGYU_ID).success(function(data){ //查询科目题型的数据
          $scope.kmtxList = data;
          $scope.keMuList = true; //选择的科目render完成后列表显示
        });
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
       点击checkbox得到checkbox的值
        */
      $scope.toggleSelection = function(zsdId) {
        var onSelect = '.select' + zsdId,
          gitThisChbx = angular.element(onSelect),//得到那个展开和隐藏按钮被点击了
          getTarChbxChild = gitThisChbx.closest('li').find('>ul');//得到要隐藏的ul;
        gitThisChbx.closest('li').find('div.foldBtn').addClass('unfoldBtn'); //得到相邻的foldBtn元素,添加unfoldBtn样式
        gitThisChbx.closest('li').find('ul').show();//下面的子元素全部展开

        getTarChbxChild.find('input[type=checkbox]').each(function() {
          if(gitThisChbx.prop("checked")) {
            this.checked = true;
          } else {
            this.checked = false;
          }
        });

        selectZsd = [];
        var cbArray = $('input[type=checkbox]'),
            cbl = cbArray.length;
        for( var i = 0; i < cbl; i++) {
          if(cbArray.eq(i).prop("checked")) {
            selectZsd.push(cbArray[i].value);
          }
        }
        console.log(selectZsd);

      };

      /**
       * 展示不同的题型和模板
       */
       var renderTpl = function(tpl){
         $scope.txTpl = tpl; //点击不同的题型变换不同的题型模板
         $scope.kmTxWrap = false; // 题型和难度DOM元素隐藏
       };

      /**
       * 点击添加题型的取消按钮后<div class="kmTxWrap">显示
       */
      $scope.cancelAddPattern = function(){
        $scope.kmTxWrap = true; // 题型和难度DOM元素显示
        $scope.txTpl = 'views/partials/testList.html';
      };

      /**
       * 单选题模板加载
       */
      var danxuan_data = timu_data;
      $scope.addDanXuan = function(tpl){
        renderTpl(tpl);
        danxuan_data.shuju.TIZHISHULIANG = '';
        danxuan_data.shuju.SUIJIPAIXU = '';
        $scope.danXuanData = danxuan_data;
      };

      /**
       * 单选题添加代码
       */
      $scope.submitShiTi = function(){
        var tiZhiArr = angular.element('.danXuanTiZhi').find('input.tiZhi'),
            tizhineirong = [];
        _.each(tiZhiArr, function(tizhi, idx, lst){
          tizhineirong.push(tizhi.value);
        });

        danxuan_data.shuju.TIZHINEIRONG = tizhineirong;
        danxuan_data.shuju.TIZHISHULIANG = tiZhiArr.length;
        danxuan_data.shuju.ZHISHIDIAN = [selectZsd];
        $http.post(xgtmUrl, danxuan_data).success(function(data){
          console.log(data);
          alert('提交成功！');
        })
        .error(function(err){
            alert(err);
        });
      };

      /**
       * 选择答案的效果的代码
       */
      $scope.chooseDaan = function(idx){
        var tgt = '.answer' + idx,
            tgtElement = angular.element(tgt);
        angular.element('div.radio').removeClass('radio-select');
        tgtElement.addClass('radio-select');
        tgtElement.find("input[name='rightAnswer']").attr('checked',true);
        danxuan_data.shuju.DAAN = tgtElement.find("input[name='rightAnswer']").val();
      };


    }]);
});
