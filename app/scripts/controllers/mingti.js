define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.MingtiCtrl', [])
    .controller('MingtiCtrl', ['$rootScope', '$scope', '$http', '$q',
      function ($rootScope, $scope, $http, $q) {
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
          baseMtAPIUrl = config.apiurl_mt, //mingti的api
          token = config.token,
          caozuoyuan = userInfo.UID,//登录的用户的UID
          jigouid = userInfo.JIGOU[0].JIGOU_ID,
          lingyuid = $rootScope.session.defaultLyId,
          chaxunzilingyu = true,

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
          checkSchoolTiKu = caozuoyuan, //查看学校题库需要传的参数
          qryTiKuUrl =  baseMtAPIUrl + 'chaxun_tiku?token=' + token + '&caozuoyuan=' + caozuoyuan +
            '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询题库

          qrytimuliebiaoBase = baseMtAPIUrl + 'chaxun_timuliebiao?token=' + token + '&caozuoyuan=' + caozuoyuan +
              '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询题目列表的url

          qrytimuxiangqingBase = baseMtAPIUrl + 'chaxun_timuxiangqing?token=' + token + '&caozuoyuan=' + caozuoyuan +
            '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询题目详情基础url

          selectZsd = [], //定义一个选中知识点的变量（数组
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
          danxuan_data, //单选题数据模板
          duoxuan_data, //多选题数据模板
          jisuan_data, //计算题数据模板
          loopArr = [0,1,2,3], //用于题支循环的数组
          tznrIsNull,//用了判断题支内容是否为空
          deleteTiMuUrl = baseMtAPIUrl + 'shanchu_timu', //删除题目的url
          deleteTiMuData = { //删除题目的数据格式
            token: config.token,
            caozuoyuan: userInfo.UID,
            jigouid: jigouid,
            lingyuid: lingyuid,
            timu_id: ''
          },
          timudetails,//获得的题目数组
          tiMuIdArr = [], //获得查询题目ID的数组
          pageArr = [], //根据得到的数据定义一个分页数组
          totalPage, //符合条件的数据一共有多少页
          itemNumPerPage = 10, //每页显示多少条数据
          paginationLength = 11; //分页部分，页码的长度，目前设定为11

        /**
         * 初始化是DOM元素的隐藏和显示
         */
        $scope.keMuList = true; //科目选择列表内容隐藏
        $scope.kmTxWrap = true; //初始化的过程中，题型和难度DOM元素显示
        $scope.letterArr = config.letterArr; //题支的序号

        /**
         * 获得大纲数据
         */
        $http.get(qryDgUrl).success(function(data){
          var newDgList = [];
          if(data.length){
            _.each(data, function(dg, idx, lst){
              if(dg.ZHUANGTAI2 == 2){
                newDgList.push(dg);
              }
            });
            $scope.dgList = newDgList;
            //获取大纲知识点
            qryKnowledge = qryKnowledgeBaseUrl + newDgList[0].ZHISHIDAGANG_ID;
            $http.get(qryKnowledge).success(function(data){
              $scope.kowledgeList = data;
            }).error(function(err){
              alert(err);
            });
          }
          else{
            alert('没用相对应的知识大纲！');
          }
        });

        /**
         *查询科目（LingYu，url：/api/ling yu）
         */
        $scope.lyList = userInfo.LINGYU; //从用户详细信息中得到用户的lingyu
//        $scope.loadLingYu = function(){
//          if($scope.keMuList){
//            $scope.keMuList = false;
//          }
//          else{
//            $scope.keMuList = true;
//          }
//        };

        /**
         * 查询科目题型(chaxun_kemu_tixing?token=12345&caozuoyuan=1057&jigouid=2&lingyuid=2)
         */
        $http.get(qryKmTx + lingyuid).success(function(data){ //页面加载的时候调用科目题型
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
//        $scope.showDgList = function(dgl){ //dgl是判断da gang有没有数据
//          if(dgl.length){
//              $scope.dgListBox = $scope.dgListBox === false ? true: false; //点击是大纲列表展现
//          }
//        };

        /**
         * 加载大纲知识点
         */
        $scope.loadDgZsd = function(dg){

          angular.element(".selectDgName").html(dg.ZHISHIDAGANGMINGCHENG); //切换大纲名称

          qryKnowledge = qryKnowledgeBaseUrl + dg.ZHISHIDAGANG_ID;
          $http.get(qryKnowledge).success(function(data){
                $scope.kowledgeList = data;
//                $scope.dgListBox = true;
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
        var selectZsdFun = function(){ //用于将选择的知识点变成字符串
          selectZsd = [];
          var cbArray = $('input[name=point]'),
            cbl = cbArray.length;
          for( var i = 0; i < cbl; i++) {
            if(cbArray.eq(i).prop("checked")) {
              selectZsd.push(cbArray[i].value);
            }
          }
          zhishidian_id = selectZsd.toString();
          console.log('知识点：' + zhishidian_id);
        };

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
          selectZsdFun();
          if($scope.kmTxWrap){ // 判断是出题阶段还是查题阶段
            qryTestFun();
          }
        };

        /**
         * 获得题型查询条件
         */
        $scope.getTiXingId = function(qrytxId){
          if(qrytxId >= 1){
            timuleixing_id = qrytxId;
            $scope.txSelectenIdx = qrytxId;
          }
          else{
            timuleixing_id = '';
            $scope.txSelectenIdx = 0;
          }
          qryTestFun();
        };

        /**
         * 获得难度查询条件
         */
        $scope.getNanDuId = function(qryndId){
          if(qryndId >= 1){
            nandu_id = qryndId;
            $scope.ndSelectenIdx = qryndId;
          }
          else{
            nandu_id = '';
            $scope.ndSelectenIdx = 0;
          }
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

          var qrytimuliebiao = qrytimuliebiaoBase + '&timuleixing_id=' + timuleixing_id + '&nandu_id=' + nandu_id
            + '&zhishidian_id=' + zhishidian_id + '&chuangjianren_uid=' + checkSchoolTiKu; //查询题目列表的url
              tiMuIdArr = [];
              pageArr = [];
          //查询题库
          $http.get(qryTiKuUrl).success(function(tiku){
            if(tiku.length){
              //查询题目列表
              $http.get(qrytimuliebiao).success(function(tmlb){
                if(tmlb.length){
                  $scope.testListId = tmlb;
                  _.each(tmlb, function(tm, idx, lst){
                    tiMuIdArr.push(tm.TIMU_ID);
                  });
                  //获得一共多少页的代码开始
                  totalPage = Math.ceil(tmlb.length/itemNumPerPage);
                  for(var i = 1; i <= totalPage; i++){
                    pageArr.push(i);
                  }
                  $scope.lastPageNum = totalPage; //最后一页的数值
                  //查询数据开始
                  $scope.getThisPageData();
                }
                else{
                  alert('没有相应的题目！');
                }
              })
              .error(function(err){
                console.log(err);
              });

            }
            else{
              alert('没有题库！');
            }
          })
          .error(function(err){
             console.log(err);
          });
        };
        qryTestFun(caozuoyuan);

        /**
         * 分页的代码
         */
        $scope.getThisPageData = function(pg){
          var qrytimuxiangqing,
              pgNum = pg - 1,
              timu_id,
              currentPage = pgNum ? pgNum : 0;

          //得到分页数组的代码
          var currentPageNum = $scope.currentPageNum = pg ? pg : 1;
          if(totalPage <= paginationLength){
            $scope.pages = pageArr;
          }
          if(totalPage > paginationLength){
            if(currentPageNum > 0 && currentPageNum <= 6 ){
              $scope.pages = pageArr.slice(0, paginationLength);
            }
            else if(currentPageNum > totalPage - 5 && currentPageNum <= totalPage){
              $scope.pages = pageArr.slice(totalPage - paginationLength);
            }
            else{
              $scope.pages = pageArr.slice(currentPageNum - 5, currentPageNum + 5);
            }
          }
          //查询数据的代码
          timu_id = tiMuIdArr.slice(currentPage * itemNumPerPage, (currentPage + 1) * itemNumPerPage).toString();
          qrytimuxiangqing = qrytimuxiangqingBase + '&timu_id=' + timu_id; //查询详情url
          $http.get(qrytimuxiangqing).success(function(data){
            if(data.length){
              $scope.timudetails = data;
              $scope.caozuoyuan = caozuoyuan;
              timudetails = data;
            }
            else{
              $scope.timudetails = null;
            }
          }).error(function(err){
            console.log(err);
          });

        };

        /**
         * 查询学校题库，val是true的话表示查询学校题库，否则查询个人题库
         */
        $scope.checkSchoolTiMu = function(val){
          if(val){
            checkSchoolTiKu = '';
            qryTestFun();
          }
          else{
            checkSchoolTiKu = caozuoyuan;
            qryTestFun();
          }
        };

        /**
         * 点击添加题型的取消按钮后<div class="kmTxWrap">显示
         */
        $scope.cancelAddPattern = function(){
          $scope.kmTxWrap = true; // 题型和难度查询的DOM元素显示
//          $scope.patternListToggle = false; // 明天题型列表隐藏
          $('.pointTree').find('input[name=point]').prop('checked', false);
          zhishidian_id = '';
          nandu_id = '';
          timuleixing_id ='';
          qryTestFun();
          $scope.txTpl = 'views/partials/testList.html';
        };

        /**
         * 单选题模板加载
         */
        $scope.addDanXuan = function(tpl){
          danxuan_data = timu_data;
          loopArr = [0,1,2,3];
          renderTpl(tpl);
          $scope.loopArr = loopArr;
          $('.patternList li').removeClass('active');
          $('li.danxuan').addClass('active');
          danxuan_data.shuju.TIXING_ID = 1;
          danxuan_data.shuju.TIMULEIXING_ID = 1;
          danxuan_data.shuju.TIZHISHULIANG = '';
          danxuan_data.shuju.SUIJIPAIXU = '';
          danxuan_data.shuju.TIGAN = '';
          danxuan_data.shuju.NANDU_ID = '';
          $scope.danXuanData = danxuan_data;
        };

        /**
         * 多选题模板加载
         */
        $scope.addDuoXuan = function(tpl){
          duoxuan_data = timu_data;
          loopArr = [0,1,2,3];
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
          duoxuan_data.shuju.TIGAN = '';
          duoxuan_data.shuju.NANDU_ID = '';
          $scope.duoXuanData = duoxuan_data;
        };

        /**
         * 计算题模板加载
         */
        $scope.addJiSuan = function(tpl){
          jisuan_data = timu_data;
          renderTpl(tpl);
          jisuan_data.shuju.TIXING_ID = 9;
          jisuan_data.shuju.TIMULEIXING_ID = 9;
          $scope.jiSuanData = jisuan_data;
        };

        /**
         * 单选题和多选题添加函数
         */
        var addDanDuoXuanFun = function(dataTpl) {
          var deferred = $q.defer();

          tznrIsNull = true;
          var tiZhiArr = angular.element('.tizhiWrap').find('input.tiZhi'),
            tizhineirong = [];
          _.each(tiZhiArr, function(tizhi, idx, lst){
            if(tizhi.value){
              tizhineirong.push(tizhi.value);
            }
            else{
              tznrIsNull = false;
            }
          });
          if(dataTpl == danxuan_data){
            dataTpl.shuju.TIXING_ID = 1;
            dataTpl.shuju.TIMULEIXING_ID = 1;
  //          dataTpl.shuju.TIGAN = CKEDITOR.instances.editorDanXuan.getData();

          }
          if(dataTpl == duoxuan_data){
            dataTpl.shuju.TIXING_ID = 2;
            dataTpl.shuju.TIMULEIXING_ID = 2;
  //          dataTpl.shuju.TIGAN = CKEDITOR.instances.editorDuoXuan.getData();
          }
          dataTpl.shuju.TIZHINEIRONG = tizhineirong;
          dataTpl.shuju.TIZHISHULIANG = tiZhiArr.length;
          dataTpl.shuju.ZHISHIDIAN = selectZsd;
          if(selectZsd.length && tznrIsNull && dataTpl.shuju.NANDU_ID.length &&
            dataTpl.shuju.DAAN.length && dataTpl.shuju.TIGAN.length ){
            $http.post(xgtmUrl, dataTpl).success(function(data){
              console.log(data);
              if(data.result){
                alert('提交成功！');
                deferred.resolve();
              }
            })
              .error(function(err){
                alert(err);
                deferred.reject();
              });
          }
          else{
            alert("请确保试题的完整性！");
            deferred.reject();
          }

          return deferred.promise;
        };

        /**
         * 单选题添加代码
         */
        $scope.addDanxuanShiTi = function(){
          var promise = addDanDuoXuanFun(danxuan_data);
          promise.then(function() {
            resetFun(danxuan_data);
          });
        };

        /**
         * 多选题添加代码 //
         */
        $scope.addDuoxuanShiTi = function(){
          var promise = addDanDuoXuanFun(duoxuan_data);
          promise.then(function() {
            resetFun(duoxuan_data);
          });
        };

        /**
         * 计算题添加代码
         */
        $scope.addJisuanShiTi = function(){
          jisuan_data.shuju.ZHISHIDIAN = selectZsd;
  //        jisuan_data.shuju.TIGAN = CKEDITOR.instances.editorJiSuanTg.getData();
  //        jisuan_data.shuju.DAAN = CKEDITOR.instances.editorJiSuanDa.getData();
          if(selectZsd.length && jisuan_data.shuju.NANDU_ID.length &&
            jisuan_data.shuju.DAAN.length && jisuan_data.shuju.TIGAN.length){
            $http.post(xgtmUrl, jisuan_data).success(function(data){
              if(data.result){
                if(jisuan_data.shuju.TIMU_ID){ //试题修改成功后！
                  alert('修改成功！');
                  $scope.cancelAddPattern();
                }
                else{ // 试题添加成功后！
                  alert('试题添加成功！');
                  resetFun(jisuan_data);
                }
              }
            })
            .error(function(err){
              alert(err);
            });
          }
          else{
            alert('请确保试卷的完整性！');
          }
        };

        /**
         * 单选题选择答案的效果的代码
         */
        $scope.chooseDanxuanDaan = function(idx){
          var tgt = '.answer' + idx,
              tgtElement = angular.element(tgt);
          angular.element('div.radio').removeClass('radio-select');
          tgtElement.addClass('radio-select');
          tgtElement.find("input[name='rightAnswer']").prop('checked',true);
          danxuan_data.shuju.DAAN = tgtElement.find("input[name='rightAnswer']").val();
        };

        /**
         * 重置输入整个form和重置函数
         */
        var resetFun = function(dataTpl){
          $('.resetForm').click();
          $('div.radio').removeClass('radio-select');
          $("input[name=rightAnswer]").prop('checked',false); //重置正确答案的数据
          $("input[name=difficulty]").prop('checked',false); //重置难度的数据
          dataTpl.shuju.DAAN = ''; //重置难度
          dataTpl.shuju.NANDU_ID = ''; //重置难度
          dataTpl.shuju.TIGAN = ''; //重置题干
        };
        $scope.resetForm = function(){
          resetFun();
        };


        /**
         * 多选题选择答案的效果的代码
         */
        $scope.chooseDuoxuanDaan = function(idx){
          var rightAnswerStr = [],
              tgtElement = $('div.radio').eq(idx);

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
        };

        /**
         * 点击添加按钮添加一项题支输入框
         */
        $scope.addOneItem = function(){
          loopArr.push(loopArr.length + 1);
        };

        /**
         * 点击删除按钮删除一项题支输入框
         */
        $scope.deleteOneItem = function(){
          loopArr.pop();
        };

        /**
         * 点击删除按钮删除一道题
         */
        $scope.deleteItem = function(tmid, idx){
          var truthBeDel = window.confirm('确定要删除此题吗？');
          if (truthBeDel) {
            deleteTiMuData.timu_id = tmid;
            $http.post(deleteTiMuUrl, deleteTiMuData).success(function(data){
              if(data.result){
                $scope.timudetails.splice(idx, 1);
              }
            });
          }
        };

        /**
         * 加载修改单选题模板
         */
        var makeZsdSelect = function(tmxq){ //修改题目是用于反向选择知识大纲
          var selectZsdStr = '';
          selectZsd = [];
          $('ul.levelFour').css('display','block');//用于控制大纲 开始
          $('.levelFour').closest('li').find('.foldBtn').addClass('unfoldBtn');
          _.each(tmxq.ZHISHIDIAN,function(zsd,idx,lst){
            selectZsd.push(zsd.ZHISHIDIAN_ID);
            selectZsdStr += 'select' + zsd.ZHISHIDIAN_ID + ',';
          });
          $scope.selectZsdStr = selectZsdStr; //用于控制大纲 结束
        };

        $scope.editItem = function(tmxq){
          console.log(tmxq);
          var tpl;
          //单选题
          if(tmxq.TIMULEIXING_ID == 1){
            tpl = 'views/tixing/danxuanedit.html';
            danxuan_data = timu_data;
            $scope.danXuanData = danxuan_data; //数据赋值和模板展示的顺序
            makeZsdSelect(tmxq);
            danxuan_data.shuju.TIMU_ID = tmxq.TIMU_ID;
            danxuan_data.shuju.DAAN = tmxq.DAAN;
            danxuan_data.shuju.TIGAN = tmxq.TIGAN.tiGan;
            danxuan_data.shuju.NANDU_ID = tmxq.NANDU_ID;
            $scope.timudetail = tmxq;
            renderTpl(tpl); //render 修改过模板
          }
          //多选题
          if(tmxq.TIMULEIXING_ID == 2 && tmxq.TIXING_ID == 2){
            tpl = 'views/tixing/duoxuanedit.html';
            duoxuan_data = timu_data;
            $scope.duoXuanData = duoxuan_data; //数据赋值和模板展示的顺序
            makeZsdSelect(tmxq);
            duoxuan_data.shuju.TIMU_ID = tmxq.TIMU_ID;
            duoxuan_data.shuju.DAAN = tmxq.DAAN;
            duoxuan_data.shuju.TIGAN = tmxq.TIGAN.tiGan;
            duoxuan_data.shuju.NANDU_ID = tmxq.NANDU_ID;
            $scope.timudetail = tmxq;
            renderTpl(tpl); //render 修改过模板
          }
          //计算题
          if(tmxq.TIMULEIXING_ID == 9 && tmxq.TIXING_ID == 9){
            tpl = 'views/tixing/jisuan.html';
            jisuan_data = timu_data;
            $scope.jiSuanData = jisuan_data; //数据赋值和模板展示的顺序
            makeZsdSelect(tmxq);
            jisuan_data.shuju.TIMU_ID = tmxq.TIMU_ID;
            jisuan_data.shuju.DAAN = tmxq.DAAN;
            jisuan_data.shuju.TIGAN = tmxq.TIGAN.tiGan;
            jisuan_data.shuju.NANDU_ID = tmxq.NANDU_ID;
            jisuan_data.shuju.TIXING_ID = tmxq.TIXING_ID;
            jisuan_data.shuju.TIMULEIXING_ID = tmxq.TIMULEIXING_ID;
            renderTpl(tpl); //render 修改过模板
          }

        };

        /**
         * 修改单选题
         */
        $scope.saveDanxuanEdit = function(){
          var promise = addDanDuoXuanFun(danxuan_data);
          promise.then(function() {
            $scope.cancelAddPattern();
            qryTestFun();
          });
        };

        /**
         * 修改多选题
         */
        $scope.saveDuoxuanEdit = function(){
          var promise = addDanDuoXuanFun(duoxuan_data);
          promise.then(function() {
            $scope.cancelAddPattern();
            qryTestFun();
          });
        };

        /**
         * 修改计算题
         */
  //      $scope.saveJisuanEdit = function(){
  //        var promise = addDanDuoXuanFun(duoxuan_data);
  //        promise.then(function() {
  //          $scope.cancelAddPattern();
  //          qryTestFun();
  //        });
  //      };

        /**
         * dagangListWrap宽度可拖拽
         */
        var resize = function(el){
          //初始化参数
          var els = document.getElementById('dagangListWrap').style,
              x = 0; //鼠标的 X 和 Y 轴坐标

          $(el).mousedown(function(e) {
            //按下元素后，计算当前鼠标与对象计算后的坐标
            x = e.clientX - el.offsetWidth - $(".dagangListWrap").width();

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
            var subDbWidth = $(".dagangListWrap").width();
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
