define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.MingtiCtrl', [])
    .controller('MingtiCtrl', ['$rootScope', '$scope', '$http', '$q', '$window', '$timeout', 'Myfileupload',
      function ($rootScope, $scope, $http, $q, $window, $timeout, Myfileupload) {
        /**
         * 操作title
         */
        $rootScope.pageName = "命题"; //page title//
        $rootScope.dashboard_shown = true;
        $rootScope.isRenZheng = false; //判读页面是不是认证

        /**
         * 声明变量
         */
        var userInfo = $rootScope.session.userInfo,
          baseMtAPIUrl = config.apiurl_mt, //mingti的api
          baseRzAPIUrl = config.apiurl_rz, //renzheng的api
          token = config.token,
          caozuoyuan = userInfo.UID,//登录的用户的UID
          jigouid = userInfo.JIGOU[0].JIGOU_ID,
          lingyuid = $rootScope.session.defaultLyId,
          letterArr = config.letterArr,
          chaxunzilingyu = true,

          qryKmTx = baseMtAPIUrl + 'chaxun_kemu_tixing?token=' + token + '&caozuoyuan=' + caozuoyuan + '&jigouid=' +
            jigouid + '&lingyuid=', //查询科目包含什么题型的url

          qryDgUrl = baseMtAPIUrl + 'chaxun_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan
            + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&chaxunzilingyu=' + chaxunzilingyu
            + '&leixing=2',//查询大纲的url(自建)

          qryKnowledgeBaseUrl = baseMtAPIUrl + 'chaxun_zhishidagang_zhishidian?token=' + token + '&caozuoyuan=' +
            caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&zhishidagangid=', //查询知识点基础url

          xgtmUrl = baseMtAPIUrl + 'xiugai_timu', //保存添加题型的url

          qryKnowledge = '', //定义一个空的查询知识点的url
          timuleixing_id = '', //用于根据题目类型查询题目的字符串
          tixing_id = '', //用于根据题型id查询题目的字符串
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
          jieda_data, //解答题数据模板
          pandu_data, //判断题数据模板
          tiankong_data, //填空题数据模板
          yuedu_data, //阅读题数据模板
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
          paginationLength = 11, //分页部分，页码的长度，目前设定为11
          testListStepZst, //用了保存查询试题阶段的知识点
          isEditItemStep = true, //是否是编辑阶段
          getUserNameBase = baseRzAPIUrl + 'get_user_name?token=' + token + '&uid=', //得到用户名的URL
          isDanXuanType = false, //判断是否出单选题
          isDuoXuanType = false, //判断是否出多选题
          modifyTxJgLyUrl = baseMtAPIUrl + 'modify_tixing_jigou_lingyu',//修改题型机构领域
          uploadFileUrl = baseMtAPIUrl + 'upload_file',//文件上传
          showFileUrl = baseMtAPIUrl + 'show_file/';//文件显示

        /**
         * 初始化是DOM元素的隐藏和显示
         */
        $scope.keMuList = true; //科目选择列表内容隐藏
        $scope.kmTxWrap = true; //初始化的过程中，题型和难度DOM元素显示
        $scope.letterArr = config.letterArr; //题支的序号
        $scope.lyList = userInfo.LINGYU; //从用户详细信息中得到用户的lingyu
        $scope.tiXingNameArr = config.tiXingNameArr; //题型名称数组

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
         * 加载大纲知识点
         */
        $scope.loadDgZsd = function(dg){
          angular.element(".selectDgName").html(dg.ZHISHIDAGANGMINGCHENG); //切换大纲名称
          qryKnowledge = qryKnowledgeBaseUrl + dg.ZHISHIDAGANG_ID;
          $http.get(qryKnowledge).success(function(data){
            $scope.kowledgeList = data;
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
         点击checkbox得到checkbox的值//
         */
        var selectZsdFun = function(){ //用于将选择的知识点变成字符串
          selectZsd = [];
          var cbArray = $('input[name=point]'),
            cbl = cbArray.length,
            zsdName = [],
            zsdNameStr = '';
          for( var i = 0; i < cbl; i++) {
            if(cbArray.eq(i).prop("checked")) {
              selectZsd.push(cbArray[i].value);
              zsdName.push(cbArray[i].labels[0].innerText);
            }
          }
          zhishidian_id = selectZsd.toString();
          zsdNameStr = zsdName.join('；');
          $scope.selectZhiShiDian = zsdNameStr;
        };

        $scope.toggleSelection = function(zsdId) {
          $scope.selectZsdStr = '';
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
            tixing_id = qrytxId;
            $scope.txSelectenIdx = qrytxId;
          }
          else{
            tixing_id = '';
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
          $scope.loadingImgShow = true; //testList.html loading
          var qrytimuliebiao = qrytimuliebiaoBase + '&tixing_id=' + tixing_id + '&nandu_id=' + nandu_id
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
                  $scope.loadingImgShow = false; //testList.html loading
                }
              })
                .error(function(err){
                  console.log(err);
                });

            }
            else{
              alert('没有题库！');
              $scope.loadingImgShow = false; //testList.html loading
            }
          })
            .error(function(err){
              console.log(err);
            });
        };
        qryTestFun(caozuoyuan);

        /**
         * 分页的代码//
         */
        $scope.getThisPageData = function(pg){
          $scope.loadingImgShow = true; //testList.html loading
          var qrytimuxiangqing,
            pgNum = pg - 1,
            timu_id,
            currentPage = pgNum ? pgNum : 0,
            userIdArr = [],//存放user id的数组
            newCont,
            tgReg = new RegExp('<\%{.*?}\%>', 'g');

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
              //在此将答案和题干转换
              _.each(data, function(tm, idx, lst){
                userIdArr.push(tm.CHUANGJIANREN_UID);
                if(tm.TIXING_ID <= 3){
                  var daanArr = tm.DAAN.split(','),
                    daanLen = daanArr.length,
                    daan = [];
                  for(var i = 0; i < daanLen; i++){
                    daan.push(letterArr[daanArr[i]]);
                  }
                  tm.DAAN = daan.join(',');
                }
                else if(tm.TIXING_ID == 4){
                  if(tm.DAAN == 1){
                    tm.DAAN = '对';
                  }
                  else{
                    tm.DAAN = '错';
                  }
                }
                else if(tm.TIXING_ID == 6){ //填空题
                  //修改填空题的答案
                  var tkDaAnArr = [],
                    tkDaAn = JSON.parse(tm.DAAN),
                    tkDaAnStr;
                  _.each(tkDaAn, function(da, idx, lst){
                    tkDaAnArr.push(da.answer);
                  });
                  tkDaAnStr = tkDaAnArr.join(';');
                  tm.DAAN = tkDaAnStr;
                  //修改填空题的题干
                  newCont = tm.TIGAN.tiGan.replace(tgReg, function(arg) {
                    var text = arg.slice(2, -2),
                      textJson = JSON.parse(text),
                      _len = textJson.size,
                      i, xhStr = '';
                    for(i = 0; i < _len; i ++ ){
                      xhStr += '_';
                    }
                    return xhStr;
                  });
                  tm.TIGAN.tiGan = newCont;
                }
                else{

                }
              });
              var userIdStr = _.chain(userIdArr).sortBy().uniq().value().toString();
              var getUserNameUrl = getUserNameBase + userIdStr;
              $http.get(getUserNameUrl).success(function(users){
                if(users.length){
                  _.each(data, function(tm, idx, lst){
                    _.each(users, function(usr, subidx, sublst){
                      if(usr.UID == tm.CHUANGJIANREN_UID){
                        tm.chuangjianren = usr.XINGMING;
                      }
                    });
                  });
                  $scope.loadingImgShow = false; //testList.html loading
                  $scope.timudetails = data;
                  $scope.caozuoyuan = caozuoyuan;
                  timudetails = data;
                }
                else{
                  $scope.timudetails = null;
                  alert('查询创建人名称失败！');
                  $scope.loadingImgShow = false; //testList.html loading
                }
              });
            }
            else{
              alert('没有相关题目！');
              $scope.loadingImgShow = false; //testList.html loading
            }
          }).error(function(err){
            console.log(err);
          });

        };

        /**
         * 重新加载mathjax
         */
        $scope.$on('onRepeatLast', function(scope, element, attrs){
          $('.reloadMath').click();
        });

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
          var selectZsdStr = '';
          selectZsd = [];
          $scope.kmTxWrap = true; // 题型和难度查询的DOM元素显示
          $scope.patternListToggle = false;
          $scope.alterTiXingBox = false;
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
          };
          selectZsd = testListStepZst;
          zhishidian_id = selectZsd.join();
          _.each(selectZsd, function(zsd,idx,lst){
            selectZsdStr += 'select' + zsd + ',';
          });
          if(isEditItemStep){
            $('.pointTree').find('input[name=point]').prop('checked', false); //add new 添加试题时正常
          }
          else{
            _.each($('input[name=point]'), function(pnt, idx, lst){
              if(pnt.checked){
                var zsdVal = 'select' + pnt.value + ',';
                if(!(selectZsdStr.indexOf(zsdVal) >= 0)){
                  pnt.checked = false;
                }
              }
            });
          }
          $scope.selectZsdStr = selectZsdStr; //用于控制大纲 结束
//          zhishidian_id = '';
//          nandu_id = '';
//          timuleixing_id ='';
          qryTestFun();
          $scope.txTpl = 'views/partials/testList.html';
        };

        /**
         * 单选题模板加载
         */
        $scope.addDanXuan = function(tpl){
//          selectZsd = []; //new add
//          $scope.selectZsdStr = '';
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
//          danxuan_data.shuju.NANDU_ID = '';
          $scope.danXuanData = danxuan_data;
          $scope.loadingImgShow = false; //danxuan.html
          isDanXuanType = true; //判断是否出单选题
          isDuoXuanType = false; //判断是否出多选题
        };

        /**
         * 多选题模板加载
         */
        $scope.addDuoXuan = function(tpl){
//          selectZsd = []; //new add
//          $scope.selectZsdStr = '';
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
//          duoxuan_data.shuju.NANDU_ID = '';
          $scope.duoXuanData = duoxuan_data;
          $scope.loadingImgShow = false; //duoxuan.html
          isDanXuanType = false; //判断是否出单选题
          isDuoXuanType = true; //判断是否出多选题
        };

        /**
         * 计算题模板加载
         */
        $scope.addJiSuan = function(tpl){
          jisuan_data = timu_data;
          renderTpl(tpl);
          $('.patternList li').removeClass('active');
          $('li.jisuan').addClass('active');
          jisuan_data.shuju.TIXING_ID = 9;
          jisuan_data.shuju.TIMULEIXING_ID = 9;
          $scope.jiSuanData = jisuan_data;
          $scope.loadingImgShow = false; //jisuan.html
        };

        /**
         * 添加新的试题
         */
        $scope.addNewShiTi = function(){
          testListStepZst = selectZsd; //保存选题阶段的知识点
          isEditItemStep = true;
          $scope.patternListToggle = true;
          $('.pointTree').find('input[name=point]').prop('checked', false); // add new
          $scope.addDanXuan('views/tixing/danxuan.html');
        };

        /**
         * 重置输入整个form和重置函数
         */
        var resetFun = function(dataTpl){
          $('.resetForm').click();
          $('div.radio').removeClass('radio-select');
          $("input[name=rightAnswer]").prop('checked',false); //重置正确答案的数据
//          $("input[name=difficulty]").prop('checked',false); //重置难度的数据
          dataTpl.shuju.DAAN = ''; //重置难度
//          dataTpl.shuju.NANDU_ID = ''; //重置难度
          dataTpl.shuju.TIGAN = ''; //重置题干
          dataTpl.shuju.TIZHINEIRONG = ''; //重置题支
//          dataTpl.shuju.TIGAN_SOURCE = ''; //重置题干
//          dataTpl.shuju.TIZHI_SOURCE = ''; //重置题支
          $('.tiZhi').val('').show();
          $('.imitationInput').html('').hide();
//          zhishidian_id = '';
//          $scope.selectZsdStr = '';
        };

        $scope.resetForm = function(){
          resetFun();
        };

        /**
         * 单选题和多选题添加函数//
         */
        var addDanDuoXuanFun = function(dataTpl) {
          var deferred = $q.defer();
          tznrIsNull = true;
          if(dataTpl == danxuan_data){
            dataTpl.shuju.TIXING_ID = 1;
            dataTpl.shuju.TIMULEIXING_ID = 1;
          }
          if(dataTpl == duoxuan_data){
            dataTpl.shuju.TIXING_ID = 2;
            dataTpl.shuju.TIMULEIXING_ID = 2;
          }
          var tiZhiArr = angular.element('.tizhiWrap').find('input.tiZhi'),
            tizhineirong = []; //存放题支内容
          //整理题支
          _.each(tiZhiArr, function(tizhi, idx, lst){
            if(tizhi.value){
              tizhineirong.push(tizhi.value);
            }
            else{
              tznrIsNull = false;
            }
          });
          dataTpl.shuju.NANDU_ID = $('input.nandu-input').val(); //改造成星星选择难度后的代码
          dataTpl.shuju.TIZHINEIRONG = tizhineirong;
          dataTpl.shuju.TIZHISHULIANG = tiZhiArr.length;
          dataTpl.shuju.ZHISHIDIAN = selectZsd;
          if(dataTpl.shuju.TIGAN.length){
            if(tznrIsNull){
              if(dataTpl.shuju.DAAN.length){
                if(dataTpl.shuju.NANDU_ID.length){
                  if(selectZsd.length){
                    $scope.loadingImgShow = true; //danxuan.html
                    $http.post(xgtmUrl, dataTpl).success(function(data){
                      if(data.result){
                        $scope.loadingImgShow = false;
                        $('.save-msg').show().fadeOut(3000);
                        $scope.isSaveSuccessful = true;
                        $scope.loadingImgShow = false; //danxuan.html
//                        isSaveSource = false;
                        deferred.resolve();
                      }
                      else{
                        alert('提交失败！');
                        $scope.loadingImgShow = false; //danxuan.html
                      }
                    })
                      .error(function(err){
                        alert(err);
                        deferred.reject();
                      });
                  }
                  else{
                    alert("请选择知识点！");
                    deferred.reject();
                  }
                }
                else{
                  alert("请选择难度！");
                  deferred.reject();
                }
              }
              else{
                alert("请选择答案！");
                deferred.reject();
              }
            }
            else{
              alert("请输入题支选项！");
              deferred.reject();
            }
          }
          else{
            alert("请输入题干！");
            deferred.reject();
          }

          return deferred.promise;
        };

        /**
         * 保存问答题这部分题型的通用函数
         */
        $scope.addAskAnswerShiTi = function(tx){
          var tx_data = '';
          switch (tx){
            case 'jisuan_data':
              tx_data = jisuan_data;
              break;
            case 'jieda_data':
              tx_data = jieda_data;
              break;
            case 'pandu_data':
              tx_data = pandu_data;
              break;
          }
          tx_data.shuju.ZHISHIDIAN = selectZsd;
          tx_data.shuju.NANDU_ID = $('input.nandu-input').val(); //改造成星星选择难度后的代码
          if(tx_data.shuju.TIGAN.length){
            if(tx_data.shuju.DAAN.length){
              if(selectZsd.length){
                if(tx_data.shuju.NANDU_ID.length){
                  $scope.loadingImgShow = true; //jisuan.html
                  $http.post(xgtmUrl, tx_data).success(function(data){
                    if(data.result){
                      if(tx_data.shuju.TIMU_ID){ //试题修改成功后！
                        alert('修改成功！');
                        $scope.patternListToggle = false;
                        $scope.alterTiXingBox = false;
                        $scope.cancelAddPattern();
                      }
                      else{ // 试题添加成功后！
                        $('.save-msg').show().fadeOut(3000);
                        resetFun(tx_data);
                      }
                      $scope.loadingImgShow = false; //jisuan.html
                    }
                    else{
                      alert(data.error);
                      $scope.loadingImgShow = false; //jisuan.html
                    }
                  })
                    .error(function(err){
                      alert(err);
                    });
                }
                else{
                  alert('请选择难度！');
                }
              }
              else{
                alert('请选择知识点！');
              }
            }
            else{
              alert('请输入答案！');
            }
          }
          else{
            alert('请输入题干！');
          }
        };

        /**
         * 添加题干编辑器
         */
        $scope.addTiGanEditor = function(){
          $('.formulaEditTiGan').markItUp(mySettings);
        };

        /**
         * 添加题支编辑器
         */
        $scope.addTiZhiEditor = function(){
          $('.formulaEditTiZhi').markItUp(mySettings);
        };

        /**
         * 移除题干编辑器
         */
        $scope.removeTiGanEditor = function(){
          $('.formulaEditTiGan').markItUp('remove');
        };

        /**
         * 移除题支编辑器
         */
        $scope.removeTiZhiEditor = function(tx){
          if(tx >= 9){
            $('.formulaEditTiZhi').markItUp('remove');
          }
          else{
            $('.formulaEditTiZhi').markItUp('remove').val('');
            $('#prevTiZhiDoc').html('');
            $('input[name=fuzhi]').prop('checked', false);
          }
        };

        /**
         * 显示单选题题干编辑器
         */
        $scope.showDanXuanTiGanEditor = function(){
          $('.formulaEditTiGan').markItUp(mySettings);
        };

        /**
         * 显示单选题题支编辑器
         */
        $scope.showDanXuanTiZhiEditor = function(){
          $('.formulaEditTiZhi').markItUp(mySettings);
        };

        /**
         * 给题支选项赋值
         */
        $scope.fuZhiFun = function(idx){
          $('.tizhiWrap .tiZhi').eq(idx).val($('.formulaEditTiZhi').val());
        };

        /**
         * 单选题添加代码
         */
        $scope.addDanxuanShiTi = function(){
          var promise = addDanDuoXuanFun(danxuan_data);
          promise.then(function() {
            resetFun(danxuan_data);
            $scope.loadingImgShow = false; //danxuan.html
          });
        };

        /**
         * 显示多选题题干编辑器
         */
        $scope.showDuoXuanTiGanEditor = function(){
          $('.formulaEditTiGan').markItUp(mySettings);
        };

        /**
         * 显示多选题题支编辑器
         */
        $scope.showDuoXuanTiZhiEditor = function(){
          $('.formulaEditTiZhi').markItUp(mySettings);
        };

        /**
         * 多选题添加代码
         */
        $scope.addDuoxuanShiTi = function(){
          var promise = addDanDuoXuanFun(duoxuan_data);
          promise.then(function() {
            resetFun(duoxuan_data);
            $scope.loadingImgShow = false; //duoxuan.html
          });
        };

        /**
         * 显示计算题干编辑器
         */
        $scope.showJiSuanTiGanEditor = function(){
          $('.formulaEditTiGan').markItUp(mySettings);
        };

        /**
         * 显示计算题答案编辑器
         */
        $scope.showJiSuanDaAnEditor = function(){
          $('.formulaEditTiZhi').markItUp(mySettings);
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
          duoxuan_data.shuju.DAAN = rightAnswerStr.join();
        };

        /**
         * 解答题模板添加
         */
        $scope.addJieDa = function(tpl){
          jieda_data = timu_data;
          renderTpl(tpl);
          $('.patternList li').removeClass('active');
          $('li.jieda').addClass('active');
          jieda_data.shuju.TIXING_ID = 17;
          jieda_data.shuju.TIMULEIXING_ID = 9;
          $scope.jieDaData = jieda_data;
          $scope.loadingImgShow = false; //jieda.html
        };

        /**
         * 判断题模板添加
         */
        $scope.addPanDuan = function(tpl){
          pandu_data = timu_data;
          renderTpl(tpl);
          $('.patternList li').removeClass('active');
          $('li.panduan').addClass('active');
          pandu_data.shuju.TIXING_ID = 4;
          pandu_data.shuju.TIMULEIXING_ID = 3;
          $scope.panDuanData = pandu_data;
          $scope.loadingImgShow = false; //panduan.html
        };

        /**
         * 判断题选择答案的效果的代码
         */
        $scope.choosePanDuanDaan = function(idx){
          var tgt = '.answer' + idx,
            tgtElement = angular.element(tgt);
          angular.element('div.radio').removeClass('radio-select');
          tgtElement.addClass('radio-select');
          tgtElement.find("input[name='rightAnswer']").prop('checked',true);
          pandu_data.shuju.DAAN = tgtElement.find("input[name='rightAnswer']").val();
        };

        /**
         * 填空题模板添加
         */
        $scope.addTianKong = function(tpl){
          tiankong_data = timu_data;
          loopArr = [];
          renderTpl(tpl);
          $scope.loopArr = loopArr;
          $('.patternList li').removeClass('active');
          $('li.tiankong').addClass('active');
          tiankong_data.shuju.TIXING_ID = 6;
          tiankong_data.shuju.TIMULEIXING_ID = 4;
          $scope.tianKongData = tiankong_data;
          $scope.loadingImgShow = false; //panduan.html
        };

        /**
         * 查找字符串出现的次数
         */
        var countInstances = function(mainStr, subStr) {
          var count = 0; var offset = 0;
          do{
            offset = mainStr.indexOf(subStr, offset); if(offset != -1)
            {
              count++;
              offset += subStr.length;
            }
          }
          while(offset != -1) return count;
        };

        /**
         * 填空题编辑keyup后执行的函数
         */
        $scope.reloadTkTiGanCont = function(){
          var tgVal = $('.formulaEditTiGan').val();
          $('#prevDoc').html(tgVal);
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, "prevDoc"]);
        };

        /**
         * loopArr
         */
        $scope.addTkDaanInput = function(){
          loopArr = [];
          var tgVal = $('.formulaEditTiGan').val(),
            cnum;
          cnum = countInstances(tgVal, '<span>');
          for(var i = 1; i <= cnum; i++){
            loopArr.push(i);
          }
          $scope.loopArr = loopArr;
        };

        /**
         * 保存填空试题
         */
        $scope.addTianKongShiTi = function(){
          var tiZhiArr = angular.element('.tizhiWrap').find('input.tiZhi'),
            reg = new RegExp('<span>.*?</span>', 'g'),
            count = 0,
            tizhineirong = [], //存放题支内容;
            tgVal = $('.formulaEditTiGan').val();
          tznrIsNull = true;

          //整理题支//
          _.each(tiZhiArr, function(tizhi, idx, lst){
            if(tizhi.value){
              tizhineirong.push(tizhi.value);
            }
            else{
              tznrIsNull = false;
            }
          });
          if(tznrIsNull){
            tiankong_data.shuju.TIGAN = tgVal.replace(reg, function(arg) {
              var innerCount = count,
                tzCont = tiZhiArr[innerCount].value,
                tzJson = {"size": "", "placeholder": "请填写", "answer": ""};
              tzJson.size = tzCont.length + 10;
              tzJson.answer = tzCont;

              count ++;
              return '<%' + JSON.stringify(tzJson) + '%>';
            });
            tiankong_data.shuju.ZHISHIDIAN = selectZsd;
            tiankong_data.shuju.NANDU_ID = $('input.nandu-input').val(); //改造成星星选择难度后的代码
            tiankong_data.shuju.DAAN = tizhineirong.join(';');
            if(tiankong_data.shuju.TIGAN.length){
              if(selectZsd.length){
                if(tiankong_data.shuju.NANDU_ID.length){
                  $scope.loadingImgShow = true; //jisuan.html
                  $http.post(xgtmUrl, tiankong_data).success(function(data){
                    if(data.result){
                      if(tiankong_data.shuju.TIMU_ID){ //试题修改成功后！
                        alert('修改成功！');
                        $scope.patternListToggle = false;
                        $scope.alterTiXingBox = false;
                        $scope.cancelAddPattern();
                      }
                      else{ // 试题添加成功后！
                        $('.save-msg').show().fadeOut(3000);
                        resetFun(tiankong_data);
                        $scope.loopArr = []; //重置填空题支
                      }
                      $scope.loadingImgShow = false; //jisuan.html
                    }
                    else{
                      alert(data.error);
                      $scope.loadingImgShow = false; //jisuan.html
                    }
                  })
                    .error(function(err){
                      alert(err);
                    });
                }
                else{
                  alert('请选择难度！');
                }
              }
              else{
                alert('请选择知识点！');
              }
            }
            else{
              alert('请输入题干！');
            }
          }
          else{
            alert('请输入填空题答案！');
          }

        };

        /**
         * 阅读题
         */
        $scope.addYueDu = function(tpl){
          yuedu_data = timu_data;
          renderTpl(tpl);
          $('.patternList li').removeClass('active');
          $('li.yuedu').addClass('active');
          yuedu_data.shuju.TIXING_ID = '';
          yuedu_data.shuju.TIMULEIXING_ID = '';
          $scope.yueDuData = yuedu_data;
          $scope.loadingImgShow = false; //panduan.html
        };

        /**
         * 点击添加按钮添加一项题支输入框
         */
        $scope.addOneItem = function(){
          loopArr.push(loopArr.length + 1);
        };

        /**
         * 点击删除按钮删除一项题支输入框//
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
                alert('删除成功！');
              }
              else{
                alert(data.error);
              }
            });
          }
        };

        /**
         * 加载修改单多选题模板
         */
        var makeZsdSelect = function(tmxq){ //修改题目是用于反向选择知识大纲
          var selectZsdStr = '';
          selectZsd = [];
          $('ul.levelFour').css('display','block');//用于控制大纲 开始
          $('.levelFour').closest('li').find('.foldBtn').addClass('unfoldBtn');
          _.each(tmxq.ZHISHIDIAN, function(zsd, idx, lst){
            selectZsd.push(zsd.ZHISHIDIAN_ID);
            selectZsdStr += 'select' + zsd.ZHISHIDIAN_ID + ',';
          });
          $scope.selectZsdStr = selectZsdStr; //用于控制大纲 结束
        };

        var onceMakeWord = true;
        $scope.editItem = function(tmxq){
          var tpl, editDaAnArr = [],
            nanDuClass;
          testListStepZst = selectZsd; //保存选题阶段的知识点
          selectZsd = []; //new add
          $scope.selectZsdStr = '';
          isEditItemStep = false;
          if(onceMakeWord){
            $('.pointTree').find('input[name=point]').prop('checked', false); //add new
          }
          //生成题支编辑器的素组
          if(tmxq.TIXING_ID <= 3){
            var daAnArray = tmxq.DAAN.split(",");
            //处理答案的代码将字母转换为数字
            _.each(daAnArray, function(da, idx, lst){
              var daLetter = _.indexOf(letterArr, da);
              editDaAnArr.push(daLetter);
            });
            tmxq.DAAN = editDaAnArr.join();
          }
          //单选题
          if(tmxq.TIXING_ID == 1){
            tpl = 'views/tixing/danxuanedit.html';
            danxuan_data = timu_data;
            $scope.danXuanData = danxuan_data; //数据赋值和模板展示的顺序
            danxuan_data.shuju.TIMU_ID = tmxq.TIMU_ID;
            danxuan_data.shuju.DAAN = tmxq.DAAN;
            danxuan_data.shuju.TIGAN = tmxq.TIGAN.tiGan;
            danxuan_data.shuju.NANDU_ID = tmxq.NANDU_ID;
            $scope.timudetail = tmxq;
            $scope.alterTiMuTiXing = '单选题';
            renderTpl(tpl); //render 修改过模板
          }
          //多选题
          if(tmxq.TIMULEIXING_ID == 2 && tmxq.TIXING_ID == 2){
            tpl = 'views/tixing/duoxuanedit.html';
            duoxuan_data = timu_data;
            $scope.duoXuanData = duoxuan_data; //数据赋值和模板展示的顺序
            duoxuan_data.shuju.TIMU_ID = tmxq.TIMU_ID;
            duoxuan_data.shuju.DAAN = tmxq.DAAN;
            duoxuan_data.shuju.TIGAN = tmxq.TIGAN.tiGan;
            duoxuan_data.shuju.NANDU_ID = tmxq.NANDU_ID;
            $scope.timudetail = tmxq;
            $scope.alterTiMuTiXing = '多选题';
            renderTpl(tpl); //render 修改过模板
          }
          //计算题
          if(tmxq.TIMULEIXING_ID == 9 && tmxq.TIXING_ID == 9){
            tpl = 'views/tixing/jisuan.html';
            jisuan_data = timu_data;
            $scope.jiSuanData = jisuan_data; //数据赋值和模板展示的顺序
            jisuan_data.shuju.TIMU_ID = tmxq.TIMU_ID;
            jisuan_data.shuju.DAAN = tmxq.DAAN;
            jisuan_data.shuju.TIGAN = tmxq.TIGAN.tiGan;
            jisuan_data.shuju.NANDU_ID = tmxq.NANDU_ID;
            jisuan_data.shuju.TIXING_ID = tmxq.TIXING_ID;
            jisuan_data.shuju.TIMULEIXING_ID = tmxq.TIMULEIXING_ID;
            $scope.alterTiMuTiXing = '计算题';
            renderTpl(tpl); //render 修改过模板
          }
          //反选知识点
          makeZsdSelect(tmxq);
          //难度反向选择代码
          var nanDuSelectFun = function() {
            nanDuClass = 'starClick' + tmxq.NANDU_ID;
            $('.nandu-star-box').addClass(nanDuClass);
            $('.nandu-input').val(tmxq.NANDU_ID);
            selectZsdFun(); //加载知识大纲名称
          };
          $scope.alterTiXingBox = true;
          onceMakeWord = false;
          $timeout(nanDuSelectFun, 500);
        };

        /**
         * 修改题目的增加一项
         */
        $scope.editAddOneItem = function(){
          $scope.timudetail.TIGAN.tiZhiNeiRong.push('');
        };

        /**
         * 修改题目删除一项
         */
        $scope.editDeleteOneItem = function(idx){
          var daAnArrOne = $scope.timudetail.DAAN.split(','),
            ifHasIn = _.contains(daAnArrOne, idx.toString());
          if(ifHasIn){
            alert('此项为正确答案不能删除！');
          }
          else{
            $scope.timudetail.TIGAN.tiZhiNeiRong.splice(idx, 1);
          }
        };

        /**
         * 修改单选题
         */
        $scope.saveDanxuanEdit = function(){
          var promise = addDanDuoXuanFun(danxuan_data);
          promise.then(function() {
            $scope.patternListToggle = false;
            $scope.alterTiXingBox = false;
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
            $scope.patternListToggle = false;
            $scope.alterTiXingBox = false;
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
            x = e.clientX - el.offsetWidth - $("#dagangListWrap").width();

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

        /**
         * 文件上传
         */
        //存放上传文件的数组
        $scope.uploadFiles = [];

        //将选择的文件加入到数组
        $scope.$on("fileSelected", function (event, args) {
          $scope.$apply(function () {
            $scope.uploadFiles.push(args.file);
          });
        });

        //添加文件
        $scope.addMyFile = function(){
          $('input.addFileBtn').click();
        };

        //删除选择的文件
        $scope.deleteSelectFile = function(idx){
          $scope.uploadFiles.splice(idx, 1);
        };

        //关闭上传文件弹出层
        $scope.closeMediaPlugin = function(){
          $('#mediaPlugin').hide();
        };

        //保存上传文件
        $scope.uploadMyFiles = function() {
          var file = $scope.uploadFiles,
            fields = [{"name": "token", "data": token}],
            isFileSizeRight = true,
            limitedFileSize = config.uploadFileSizeLimit; //文件大小限制，目前大小限制2MB
          _.each($scope.uploadFiles, function(fl, idx, lst){
            if(fl.size > limitedFileSize){
              isFileSizeRight = false;
            }
          });
          if(isFileSizeRight){
            Myfileupload.uploadFileAndFieldsToUrl(file, fields, uploadFileUrl).then(function(result){
              $scope.uploadFileUrl = result.data;
              $scope.uploadFiles = [];
              if(result.data.length){
                var src = showFileUrl + result.data[0];
                $.markItUp(
                  { replaceWith:'<img src="'+src+'" alt=""(!( class="[![Class]!]")!) />' }
                );
                $('#mediaPlugin').hide();
                $('.formulaEditTiGan').keyup();
                return false;
              }
            });
          }
          else{
            alert('文件大小不能超过：' + limitedFileSize/1024/1024 + 'MB');
          }
        };

      }
    ]
  );
});
