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
          caozuoyuan = userInfo.UID,//登录的用户的UID
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
          timuleixing_id = '', //用于根据题目类型查询题目的字符串
          nandu_id = '', //用于根据难度查询题目的字符串
          zhishidian_id = '', //用于根据知识点查询题目的字符串

          qrytimuliebiaoBase = baseMtAPIUrl + 'chaxun_timuliebiao?token=' + token + '&caozuoyuan=' + caozuoyuan +
              '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询题目列表的url

          qrytimuxiangqingBase = baseMtAPIUrl + 'chaxun_timuxiangqing?token=' + token + '&caozuoyuan=' + caozuoyuan +
            '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询题目详情基础url

          selectZsd, //定义一个选中知识点的变量（数组
          //selectZstStr, //定义一个选中知识点的变量（字符串）
          timu_data = { //题目类型的数据格式公共部分
            token: config.token,
            caozuoyuan: userInfo.UID,
            jigouid: jigouid,
            lingyuid: lingyuid,
            shuju: {
              TIMU_ID: '',
              TIXING_ID: '',
              TIMULEIXING_ID: '',
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
          },
          loopArr = [0,1,2,3]; //用于题支循环的数组

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
        zhishidian_id = selectZsd.join(',');
        if($scope.kmTxWrap){ // 判断是出题阶段还是查题阶段
          qryTestFun();
        }
        console.log(selectZsd);
      };

      /**
       * 获得题型查询条件
       */
      $scope.getTiXingId = function(idx){
        var tx_id = ".tiXingId_" + idx;
        timuleixing_id = ' ';
        angular.element('.getTiXingIdList li').removeClass('active');
        angular.element(tx_id).addClass('active');
        timuleixing_id = angular.element(tx_id).find('span').text();
        qryTestFun();
      };

      /**
       * 获得难度查询条件
       */
      $scope.getNanDuId = function(idx){
        var tx_id = ".nanDuId_" + idx;
        nandu_id = ' ';
        angular.element('.getNanDuIdList li').removeClass('active');
        angular.element(tx_id).addClass('active');
        nandu_id = angular.element(tx_id).find('span').text();
        qryTestFun();
      };

      /**
       * 展示不同的题型和模板
       */
      var renderTpl = function(tpl){
        $scope.txTpl = tpl; //点击不同的题型变换不同的题型模板
        $scope.kmTxWrap = false; // 题型和难度DOM元素隐藏
      };

      /**
       * 查询试题的函数
       */
      var qryTestFun = function(){
        var qrytimuliebiao = qrytimuliebiaoBase + '&timuleixing_id=' + timuleixing_id +
            '&nandu_id=' + nandu_id + '&zhishidian_id=' + zhishidian_id, //查询题目列表的url
            tiMuIdArr = [],
            timu_id = '',
            qrytimuxiangqing;
        $http.get(qrytimuliebiao).success(function(data){
          $scope.testListId = data;
          _.each(data, function(tm, idx, lst){
            tiMuIdArr.push(tm.TIMU_ID);
          });
          timu_id = tiMuIdArr.slice(0,2).toString();
          qrytimuxiangqing = qrytimuxiangqingBase + '&timu_id=' + timu_id; //查询详情url
          $http.get(qrytimuxiangqing).success(function(data){
            console.log(data);
            if(data.length){
              $scope.timudetails = data;
            }
            else{
              $scope.timudetails = null;
            }
          }).error(function(err){
              console.log(err);
          });

        })
        .error(function(err){
          console.log(err);
        });
      };
      qryTestFun();

      /**
       * 点击添加题型的取消按钮后<div class="kmTxWrap">显示
       */
      $scope.cancelAddPattern = function(){
        $scope.kmTxWrap = true; // 题型和难度查询的DOM元素显示
        $scope.patternListToggle = false; // 明天题型列表隐藏
        $scope.txTpl = 'views/partials/testList.html';
      };

      /**
       * 单选题模板加载
       */
      var danxuan_data = timu_data;
      $scope.addDanXuan = function(tpl){
        renderTpl(tpl);
        $('.patternList li').removeClass('active');
        $('li.danxuan').addClass('active');
        $scope.loopArr = loopArr;
        danxuan_data.shuju.TIXING_ID = 1;
        danxuan_data.shuju.TIMULEIXING_ID = 1;
        danxuan_data.shuju.TIZHISHULIANG = '';
        danxuan_data.shuju.SUIJIPAIXU = '';
        $scope.danXuanData = danxuan_data;
      };

      /**
       * 多选题模板加载
       */
      var duoxuan_data = timu_data;
      $scope.addDuoXuan = function(tpl){
        renderTpl(tpl);
        $scope.loopArr = loopArr;
        $('.patternList li').removeClass('active');
        $('li.duoxuan').addClass('active');
        duoxuan_data.shuju.TIXING_ID = 2;
        duoxuan_data.shuju.TIMULEIXING_ID = 2;
        duoxuan_data.shuju.TIZHISHULIANG = '';
        duoxuan_data.shuju.SUIJIPAIXU = '';
        duoxuan_data.shuju.ZUISHAOXUANZE = '';
        duoxuan_data.shuju.ZUIDUOXUANZE = '';
        $scope.duoXuanData = duoxuan_data;
      };

      /**
       * 单选题添加代码
       */
      $scope.submitShiTi = function(){
        var tiZhiArr = angular.element('.tizhiWrap').find('input.tiZhi'),
            tizhineirong = [];
        _.each(tiZhiArr, function(tizhi, idx, lst){
          tizhineirong.push(tizhi.value);
        });

        danxuan_data.shuju.TIZHINEIRONG = tizhineirong;
        danxuan_data.shuju.TIZHISHULIANG = tiZhiArr.length;
        danxuan_data.shuju.ZHISHIDIAN = selectZsd;
        $http.post(xgtmUrl, danxuan_data).success(function(data){
          console.log(data);
          if(data.result){
            alert('提交成功！');
          }
        })
        .error(function(err){
            alert(err);
        });
      };

      /**
       * 多选题添加代码
       */
      $scope.submitDuoxuanShiTi = function(){
        var tiZhiArr = angular.element('.tizhiWrap').find('input.tiZhi'),
          tizhineirong = [];
        _.each(tiZhiArr, function(tizhi, idx, lst){
          tizhineirong.push(tizhi.value);
        });

        duoxuan_data.shuju.TIZHINEIRONG = tizhineirong;
        duoxuan_data.shuju.TIZHISHULIANG = tiZhiArr.length;
        duoxuan_data.shuju.ZHISHIDIAN = selectZsd;
        console.log(duoxuan_data);
        $http.post(xgtmUrl, duoxuan_data).success(function(data){
          console.log(data);
          if(data.result){
            alert('提交成功！');
          }
        })
          .error(function(err){
            alert(err);
          });
      };

      /**
       * 单选题选择答案的效果的代码
       */
      $scope.chooseDanxuanDaan = function(idx){
        var tgt = '.answer' + idx,
            tgtElement = angular.element(tgt);
        angular.element('div.radio').removeClass('radio-select');
        tgtElement.addClass('radio-select');
        tgtElement.find("input[name='rightAnswer']").attr('checked',true);
        danxuan_data.shuju.DAAN = tgtElement.find("input[name='rightAnswer']").val();
      };

      /**
       * 多选题选择答案的效果的代码
       */
      $scope.chooseDuoxuanDaan = function(idx){
        var rightAnswerStr = [],
            tgtElement = $('div.radio').eq(idx);

        //angular.element('div.radio').removeClass('radio-select');
        //tgtElement.addClass('radio-select');
        //tgtElement.find("input[name='rightAnswer']").attr('checked',true);
        tgtElement.toggleClass('radio-select');
        if(tgtElement.find('input[name=rightAnswer]').prop('checked')){
          tgtElement.find('input[name=rightAnswer]').prop('checked',false);
        }
        else{
          tgtElement.find('input[name=rightAnswer]').prop('checked',true);
        }
        _.each($('input[name=rightAnswer]:checked'), function(rasw, idx, lst){
          rightAnswerStr.push(rasw.value);
        });
        duoxuan_data.shuju.DAAN = rightAnswerStr.toString();
        console.log(duoxuan_data.shuju.DAAN);
      };

      /**
       * 点击添加按钮添加一项题支
       */
      $scope.addOneItem = function(){
        loopArr.push(loopArr.length + 1);
      };

      /**
       * 点击删除按钮删除一项题支
       */
      $scope.deleteOneItem = function(){
        loopArr.pop();
      };

      /**
       * subDashboard宽度可拖拽
       */
      var resize = function(el){
        //初始化参数
        var els = document.getElementById('subDashboard').style,
            x = 0; //鼠标的 X 和 Y 轴坐标

        $(el).mousedown(function(e) {
          //按下元素后，计算当前鼠标与对象计算后的坐标
          x = e.clientX - el.offsetWidth - $(".subDashboard").width();

          //在支持 setCapture 做些东东
          el.setCapture ? (
            //捕捉焦点
            el.setCapture(),
              //设置事件
              el.onmousemove = function(ev) {
                mouseMove(ev || event);
              }, el.onmouseup = mouseUp
            ) : (
            //绑定事件
            $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp)
            );
          //防止默认事件发生
          e.preventDefault();
        });
        //移动事件
        function mouseMove(e) {
          var subDbWidth = $(".subDashboard").width();
          if(subDbWidth < 220){
            els.width = '221px';
            $('.content').css('padding-left',els.width);
            $(document).unbind("mousemove", mouseMove);
          }
          if(subDbWidth >= 220 && subDbWidth <= 400){
            els.width = e.clientX - x + 'px';
            $('.content').css('padding-left',els.width);
          }
          if(subDbWidth > 400){
            els.width = '399px';
            $('.content').css('padding-left',els.width);
            $(document).unbind("mousemove", mouseMove);
          }
        }
        //停止事件
        function mouseUp() {
          //在支持 releaseCapture 做些东东
          el.releaseCapture ? (
            //释放焦点
            el.releaseCapture(),
              //移除事件
              el.onmousemove = el.onmouseup = null
            ) : (
            //卸载事件
            $(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp)
            );
        }
      };
      resize(document.getElementById('dragBtn'));//初始化拖拽

    }]);
});
