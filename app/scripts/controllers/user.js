define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.UserCtrl', [])
    .controller('UserCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

      $rootScope.pageName = "认证";//页面名称
      $rootScope.isRenZheng = true; //判读页面是不是认证
      $rootScope.dashboard_shown = false;
      $scope.addedContainerClass = 'userBox';
      $scope.shenheList = [];
      $scope.showShenhe = false;
      $scope.isShenHeBox = true; //判断是不是审核页面

      /**
       * 定义变量
       */
      var userInfo = $rootScope.session.userInfo,
        baseRzAPIUrl = config.apiurl_rz, //renzheng的api;
        baseMtAPIUrl = config.apiurl_mt, //mingti的api
        token = config.token, //token的值
        caozuoyuan = userInfo.UID,//登录的用户的UID
        jigouid = userInfo.JIGOU[0].JIGOU_ID,
        lingyuid = $rootScope.session.defaultLyId,
        session = $rootScope.session,
        dshyhjsUrl = baseRzAPIUrl + 'daishenhe_yonghu_juese?token=' + token + '&caozuoyuan=' + session.info.UID, //待审核用户角色url
        shyhjsUrl = baseRzAPIUrl + 'shenhe_yonghu_juese', //审核用户角色
        qryJglbUrl = baseRzAPIUrl + 'jiGou_LeiBie?token=' + token, //jiGouLeiBie 机构类别的api
        qryJiGouUrl = baseRzAPIUrl + 'jiGou?token=' + token + '&leibieid=', //由机构类别查询机构的url
        qryJiGouAdminBase = baseRzAPIUrl + 'get_jigou_admin?token=' + token + '&caozuoyuan=' + caozuoyuan + '&jigouid=', // 查询机构管理员
        modifyJiGouUrl = baseRzAPIUrl + 'modify_jigou', //修改机构数据
        qryLingYuUrl = baseRzAPIUrl + 'lingyu?token=' + token, //查询领域的url
        modifyLingYuUrl = baseRzAPIUrl + 'modify_lingyu', //修改领域数据
        modifyJiGouLingYuUrl = baseRzAPIUrl + 'modify_jigou_lingyu', //修改机构领域
        jiGouData = { //新增机构的数据
          token: token,
          caozuoyuan: caozuoyuan,
          shuju:[]
        },
        jgLeiBieId, //机构列表id
        modifyJiGouAdminUrl = baseRzAPIUrl + 'modify_jigou_admin', //修改机构管理员
        adminData = { //新增机构管理员的数据
          token: token,
          caozuoyuan: caozuoyuan,
          shuju:{}
        },
        whichJiGouAddAdmin = '', //那个机构添加管理员
        lingYuData = { //定义一个空的object用来存放需要保存的领域数据
          token: token,
          caozuoyuan: caozuoyuan,
          shuju:[]
        },
        selectedLyStr = '', //已选择的领域ID
        selectedLyArr = '', //已选择的领域ID
        qryTiXingUrl = baseMtAPIUrl + 'chaxun_tixing?token=' + token, //查询全部题型的url
        qryKmTx = baseMtAPIUrl + 'chaxun_kemu_tixing?token=' + token + '&caozuoyuan=' + caozuoyuan + '&jigouid=' +
          jigouid + '&lingyuid=', //查询科目包含什么题型的url
        modifyTxJgLyUrl = baseMtAPIUrl + 'modify_tixing_jigou_lingyu', //修改题型机构领域
        tiXingData = { //定义一个空的object用来存放需要保存的题型数据
          token: token,
          caozuoyuan: caozuoyuan,
          shuju:[]
        },
        qryZsdBaseUrl = baseMtAPIUrl + 'chaxun_zhishidian?token=' + token + '&caozuoyuan=' + caozuoyuan + '&jigouid='
          + jigouid + '&leixing=1' + '&lingyuid=', //查询公共知识点的url
        qryZsdgBaseUrl = baseMtAPIUrl + 'chaxun_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan + '&jigouid='
          + jigouid + '&lingyuid=', //查询知识大纲的url
        qryZsdgZsdBaseUrl = baseMtAPIUrl + 'chaxun_zhishidagang_zhishidian?token=' + token + '&caozuoyuan=' + caozuoyuan
          + '&jigouid=' + jigouid + '&leixing=1' + '&lingyuid=', //查询知识大纲知识点的url
        daGangData = { //定义一个空的大纲数据
          token: token,
          caozuoyuan: caozuoyuan,
          jigouid: jigouid,
          shuju:{}
        },
        daGangJieDianData = [], //定义一个大纲节点的数据
        modifyZsdgUrl = baseMtAPIUrl + 'xiugai_zhishidagang', //保存知识大纲
        queryTiKuBaseUrl = baseMtAPIUrl + 'chaxun_tiku?token=' + token + '&caozuoyuan=' + caozuoyuan
          + '&jigouid=' + jigouid + '&lingyuid=', //查询题目
        xiuGaiTiKuUrl = baseMtAPIUrl + 'xiugai_tiku', //修改题库的url
        alterShiJuanMuLuUrl = baseMtAPIUrl + 'xiugai_shijuanmulu', //修改试卷目录
        queryShiJuanMuLuUrl = baseMtAPIUrl + 'chaxun_shijuanmulu?token=' + token + '&caozuoyuan=' + caozuoyuan
          + '&jigouid=' + jigouid + '&lingyuid='; //查询试卷目录

      /**
       * 导向本页面时，判读展示什么页面，admin, xxgly, 审核员9
       */
      var jsArr = _.chain(userInfo.JUESE)
          .sortBy(function(js){ return js.JUESE_ID; })
          .map(function(js){ return js.JUESE_ID; })
          .uniq()
          .value(); //得到角色的数组

      switch (jsArr[0]){
        case "1":
          $scope.shenHeTpl = 'views/partials/rz_admin.html';
          break;
        case "2":
          $scope.shenHeTpl = 'views/partials/rz_xxgly.html';
          break;
        case "3":
          $scope.shenHeTpl = 'views/partials/rz_shenHeRen.html';
          break;
      }

      /**
       * 信息提示函数
       */
      var alertInfFun = function(megKind, cont){
        $('.messageTd').css('display', 'none').html('');
        if(megKind == 'err'){
          $('.mesError').css('display', 'block').html(cont); //mesSuccess mesPrompt
        }
        if(megKind == 'suc'){
          $('.mesSuccess').css('display', 'block').html(cont); // mesPrompt
        }
        if(megKind == 'pmt'){
          $('.mesPrompt').css('display', 'block').html(cont); //mesSuccess
        }
        $('.popInfoWrap').css('display', 'block').fadeOut(3000);
      };

      /**
       * 设置权限，审核权限
       */
      $scope.setPermissions = function() {
        $scope.loadingImgShow = true; //user.html
        var hasShenHe = [], //定义一个已经通过审核的数组
            notShenHe = []; //定义一个待审核的数组
        $http.get(dshyhjsUrl).success(function(data) {
          if(data){
            _.each(data, function(sh, indx, lst) {
              sh.AUTH_BTN_HIDE = true;
              var zeroLength = 0; //判断有几个未审核的角色
              _.each(sh.JUESE, function(js, indx, jsLst) {
                js.JUESE_CHECKED = js.ZHUANGTAI > -1;
                if(js.ZHUANGTAI === 0) {
                  sh.AUTH_BTN_HIDE = false;
                  zeroLength ++;
                }
              });
              if(zeroLength){
                notShenHe.push(sh);
              }
              else{
                hasShenHe.push(sh);
              }
            });
            $scope.loadingImgShow = false; //user.html
            $scope.hasShenHeList = hasShenHe;
            $scope.notShenHeList = notShenHe;
            $scope.isShenHeBox = true; //判断是不是审核页面
            $scope.adminSubWebTpl = 'views/partials/rz_shenHe.html';

          }
          else{
            alertInfFun('err', data.error);
            $scope.loadingImgShow = false; //user.html
          }
        });
      };

      /**
       * 关闭审核页面
       */
      $scope.closeShenheBox = function() {
        $scope.adminSubWebTpl = '';
        $scope.isShenHeBox = true; //判断是不是审核页面
      };

      $scope.jueseClicked = function(shenhe, juese) {
        shenhe.AUTH_BTN_HIDE = false;
      };

      /**
       * 通过审核的按钮
       */
      $scope.authPerm = function(shenhe) {
        var juese = [],
            authParam = {
              token: config.token,
              caozuoyuan: session.info.UID,
              yonghujuese: [{
                yonghuid: shenhe.UID,
                jigou: shenhe.JIGOU_ID,
                lingyu: shenhe.LINGYU_ID
              }]
            };

        _.chain(shenhe.JUESE)
          .each(function(js, indx, lst) {
            var tmpJS = {};

            if(js.JUESE_CHECKED && (js.ZHUANGTAI === -1 || js.ZHUANGTAI === 0)) {
              tmpJS.juese_id = js.JUESE_ID;
              tmpJS.zhuangtai = 1;
            } else if(!js.JUESE_CHECKED && js.ZHUANGTAI === 1) {
              tmpJS.juese_id = js.JUESE_ID;
              tmpJS.zhuangtai = 0;
            } else if(js.JUESE_CHECKED && js.ZHUANGTAI === 1) {
              tmpJS.juese_id = js.JUESE_ID;
              tmpJS.zhuangtai = 1;
            }

            if(tmpJS.juese_id) {
              juese.push(tmpJS);
            }
          })
          .tap(function(){
            authParam.yonghujuese[0].juese = juese;
            $http.post(shyhjsUrl, authParam).success(function(data) {
              if(data.result) {
                shenhe.AUTH_BTN_HIDE = true;
              }
              else{
                alertInfFun('err', data.error);
              }
            });
          }).value();
      };

      /**
       * 展示设置机构的页面
       */
      $scope.renderJiGouSetTpl = function(){
        $scope.loadingImgShow = true; //rz_setJiGou.html
         // 查询机构类别
        $http.get(qryJglbUrl).success(function(data) {
          if(data.length){
            $scope.jigoulb_list = data;
            $scope.isShenHeBox = false; //判断是不是审核页面
            $scope.loadingImgShow = false; //rz_setJiGou.html
            $scope.adminSubWebTpl = 'views/partials/rz_setJiGou.html';
          }
          else{
            $scope.jigoulb_list = '';
            $scope.loadingImgShow = false; //rz_setJiGou.html
            alertInfFun('err', '没用相应的机构！');
          }
        });
      };

      /**
       * 由机构类别查询机构
       */
      $scope.getJgList = function(jglbId){
        $scope.loadingImgShow = true; //rz_setJiGou.html
        jgLeiBieId = jglbId; //给机构类别赋值
        $http.get(qryJiGouUrl + jglbId).success(function(data) {
          if(data.length){
            var jgIdStr = _.map(data, function(jg){return jg.JIGOU_ID}).toString(),
              qryJiGouAdminUrl = qryJiGouAdminBase + jgIdStr;
            $http.get(qryJiGouAdminUrl).success(function(jgAdmin){
              if(jgAdmin.length){
                $scope.jigou_list = jgAdmin;
                $scope.loadingImgShow = false; //rz_setJiGou.html
                if(whichJiGouAddAdmin >= 0){
                  $scope.adminList = $scope.jigou_list[whichJiGouAddAdmin];
                }
              }
              else{
                $scope.jigou_list = '';
                $scope.loadingImgShow = false; //rz_setJiGou.html
                alertInfFun('err', '没有相关的机构!错误信息:' + jgAdmin.error);
              }
            });
          }
          else{
            $scope.jigou_list = '';
            $scope.loadingImgShow = false; //rz_setJiGou.html
            alertInfFun('err', '没有相关的机构!错误信息:' + jgAdmin.error);
          }
        });
      };

      /**
       * 点击新增机构，显示新增页面
       */
      $scope.addNewJiGouBoxShow = function(jg){
        jiGouData.shuju = [];
        var jgsjObj = {};
        if(jg){ //修改机构
          jgsjObj = { //新增机构里面的机构数据
            JIGOU_ID: jg.JIGOU_ID,
            JIGOUMINGCHENG: jg.JIGOUMINGCHENG,
            LEIBIE: jgLeiBieId,
            ZHUANGTAI: 1,
            CHILDREN:{}
          };
        }
        else{ //新增机构
          jgsjObj = { //新增机构里面的机构数据
            JIGOU_ID: '',
            JIGOUMINGCHENG: '',
            LEIBIE: jgLeiBieId,
            ZHUANGTAI: 1,
            CHILDREN:{}
          };
        }
        jiGouData.shuju.push(jgsjObj);
        $scope.isAddNewJiGouBoxShow = true; //显示机构增加页面
        $scope.isAddNewAdminBoxShow = false; //关闭管理员管理页面
        $scope.addNewJiGou = jiGouData;
      };

      /**
       * 关闭添加新机构页面
       */
      $scope.closeAddNewJiGou = function(){
        $scope.isAddNewJiGouBoxShow = false;
        jiGouData.shuju = [];
      };

      /**
       * 保存新增加的机构
       */
      $scope.saveNewAddJiGou = function(){
        $scope.loadingImgShow = true; //rz_setJiGou.html
        if(jiGouData.shuju[0].JIGOUMINGCHENG){
          $http.post(modifyJiGouUrl, jiGouData).success(function(data){
            if(data.result){
              $scope.loadingImgShow = false; //rz_setJiGou.html
              $('.save-msg').show().fadeOut(3000);
              jiGouData.shuju[0].JIGOUMINGCHENG = '';
              $scope.getJgList(jgLeiBieId);
            }
            else{
              $scope.loadingImgShow = false; //rz_setJiGou.html
              alertInfFun('err', data.error);
            }
          });
        }
        else{
          $scope.loadingImgShow = false; //rz_setJiGou.html
          alertInfFun('err', '请输入机构名称！');
        }
      };

      /**
       * 删除机构
       */
      $scope.deleteJiGou = function(jg){
        jiGouData.shuju = [];
        var jgsjObj = { //新增机构里面的机构数据
          JIGOU_ID: jg.JIGOU_ID,
          JIGOUMINGCHENG: jg.JIGOUMINGCHENG,
          LEIBIE: jgLeiBieId,
          ZHUANGTAI: -1,
          CHILDREN:{}
        };
        jiGouData.shuju.push(jgsjObj);
        $http.post(modifyJiGouUrl, jiGouData).success(function(data){
          if(data.result){
            $('.delete-msg').show().fadeOut(3000);
            jiGouData.shuju = [];
            $scope.getJgList(jgLeiBieId);
          }
          else{
            alertInfFun('err', data.error);
          }
        });
      };

      /**
       * 展示管理机构管理页面
       */
      $scope.manageAdmin = function(jg, idx){
        adminData.shuju = {};
        adminData.shuju.JIGOU_ID = jg.JIGOU_ID;
        adminData.shuju.ADMINISTRATORS = [];
        whichJiGouAddAdmin = idx;
        var adminObj = {
          UID: '',
          YONGHUMING: '',
          MIMA: '',
          ZHUANGTAI: 1
        };
        adminData.shuju.ADMINISTRATORS.push(adminObj);
        $scope.isAddNewAdminBoxShow = true; //显示管理管理员页面
        $scope.isAddNewJiGouBoxShow = false; //关闭机构增加页面
        $scope.adminList = jg;
        $scope.newAdmin = adminData;
      };

      /**
       * 保存管理员的修改
       */
      $scope.saveNewAddAdmin = function(){
        $scope.loadingImgShow = true; //rz_setJiGou.html
        if(adminData.shuju.ADMINISTRATORS[0].YONGHUMING){
          if(adminData.shuju.ADMINISTRATORS[0].MIMA){
            $http.post(modifyJiGouAdminUrl, adminData).success(function(data){
              if(data.result){
                $scope.loadingImgShow = false; //rz_setJiGou.html
                $('.save-msg').show().fadeOut(3000);
                $scope.getJgList(jgLeiBieId);
                adminData.shuju.ADMINISTRATORS[0].YONGHUMING = '';
                adminData.shuju.ADMINISTRATORS[0].MIMA = '';
              }
              else{
                $scope.loadingImgShow = false; //rz_setJiGou.html
                alertInfFun('err', data.error);
              }
            });
          }
          else{
            $scope.loadingImgShow = false; //rz_setJiGou.html
            alertInfFun('pmt', '请输入管理员密码！');
          }
        }
        else{
          $scope.loadingImgShow = false; //rz_setJiGou.html
          alertInfFun('pmt', '请输入管理员账号！');
        }
      };

      /**
       * 删除机构管理员
       */
      $scope.deleteJiGouAdmin = function(adm){
        adminData.shuju.ADMINISTRATORS[0].UID = adm.UID;
        adminData.shuju.ADMINISTRATORS[0].YONGHUMING = adm.YONGHUMING;
        adminData.shuju.ADMINISTRATORS[0].ZHUANGTAI = -1;
        $http.post(modifyJiGouAdminUrl, adminData).success(function(data){
          if(data.result){
            $scope.getJgList(jgLeiBieId);
            adminData.shuju.ADMINISTRATORS[0].UID = '';
            adminData.shuju.ADMINISTRATORS[0].YONGHUMING = '';
            adminData.shuju.ADMINISTRATORS[0].MIMA = '';
            adminData.shuju.ADMINISTRATORS[0].ZHUANGTAI = 1;
          }
          else{
            alertInfFun('err', data.error);
          }
        });
      };

      /**
       * 关闭管理管理员页面
       */
      $scope.closeManageAdmin = function(){
        $scope.isAddNewAdminBoxShow = false;
        adminData.shuju = {};
        whichJiGouAddAdmin = '';
      };

      /**
       * 重置机构管理员密码
       */
      $scope.resetJgAdminName = function(adm){
        var psw="";
        for(var i = 0; i < 6; i++)
        {
          psw += Math.floor(Math.random()*10);
        }
        adminData.shuju.ADMINISTRATORS[0].UID = adm.UID;
        adminData.shuju.ADMINISTRATORS[0].YONGHUMING = adm.YONGHUMING;
        adminData.shuju.ADMINISTRATORS[0].MIMA = psw;
        adminData.shuju.ADMINISTRATORS[0].ZHUANGTAI = 1;
        $http.post(modifyJiGouAdminUrl, adminData).success(function(data){
          if(data.result){
            $scope.jgAdminName = adm.YONGHUMING;
            $scope.jgAmdinNewPsw = psw;
            $scope.isResetJgAdminPsw = true;
            adminData.shuju.ADMINISTRATORS[0].UID = '';
            adminData.shuju.ADMINISTRATORS[0].YONGHUMING = '';
            adminData.shuju.ADMINISTRATORS[0].MIMA = '';
            adminData.shuju.ADMINISTRATORS[0].ZHUANGTAI = 1;
          }
          else{
            alertInfFun('err', data.error);
          }
        });
      };

      /**
       * 展示科目设置(领域)
       */
      $scope.renderLingYuSetTpl = function(){
        $scope.loadingImgShow = true; //rz_setLingYu.html
        // 查询机领域
        $http.get(qryLingYuUrl).success(function(data) {
          if(data.length){
            $scope.lingyu_list = data;
            $scope.loadingImgShow = false; //rz_setLingYu.html
            $scope.isShenHeBox = false; //判断是不是审核页面
            $scope.adminSubWebTpl = 'views/partials/rz_setLingYu.html';
          }
          else{
            $scope.lingyu_list = '';
            $scope.loadingImgShow = false; //rz_setLingYu.html
            alertInfFun('err', '没用相关的领域！');
          }
        });
      };

      /**
       * 添加领域
       */
      $scope.addNd = function(nd) {
        var newNd = {};
        newNd.LINGYU_ID = '';
        newNd.LINGYUMINGCHENG = '';
        newNd.BIANMA = '';
        newNd.ZHUANGTAI = 1;
        newNd.CHILDREN = [];
        switch (nd.LEIBIE){
          case 0:
            newNd.LEIBIE = 1;
            break;
          case 1:
            newNd.LEIBIE = 2;
            break;
        }
        nd.CHILDREN.push(newNd);
      };

      /**
       * 删除领域//
       */
      $scope.removeNd = function(parentNd, thisNd, idx) {
        lingYuData.shuju = [];
        thisNd.ZHUANGTAI = -1;
        lingYuData.shuju.push(thisNd);
        $scope.loadingImgShow = true; //rz_setLingYu.html
        $http.post(modifyLingYuUrl, lingYuData).success(function(data){
          if(data.result){
            parentNd.CHILDREN.splice(idx, 1);
            $scope.loadingImgShow = false; //rz_setLingYu.html
          }
          else{
            $scope.loadingImgShow = false; //rz_setLingYu.html
            alertInfFun('err', data.error);
          }
        });
      };

      /**
       * 保存修改过后的领域数据
       */
      $scope.saveLingYuChange = function(){
        lingYuData.shuju = [];
        $scope.loadingImgShow = true; //rz_setLingYu.html
        lingYuData.shuju = $scope.lingyu_list;
        $http.post(modifyLingYuUrl, lingYuData).success(function(data){
          if(data.result){
//            $('.save-msg').show().fadeOut(3000);
            alertInfFun('suc', '保存成功！');
            $scope.loadingImgShow = false; //rz_setLingYu.html
          }
          else{
            $scope.loadingImgShow = false; //rz_setLingYu.html
            alertInfFun('err', data.error);
          }
        });
      };

      /**
       * 学校科目选择 modifyJiGouLingYuUrl
       */
      $scope.renderLingYuSelectTpl = function(){
        $scope.jgSelectLingYu = [];
        lingYuData.shuju = [];
        $scope.loadingImgShow = true; //rz_selectLingYu.html
        var qryLingYuByJiGou = qryLingYuUrl + '&jigouid=' + userInfo.JIGOU[0].JIGOU_ID;
        $http.get(qryLingYuUrl).success(function(data) { //查询全部的领域
          if(data.length){
            $http.get(qryLingYuByJiGou).success(function(jgLy) { //查询本机构下的领域
              if(jgLy.length){
                $scope.jgSelectLingYu = jgLy;
                $scope.loadingImgShow = false; //rz_selectLingYu.html
                $scope.lingyu_list = data;
                $scope.isShenHeBox = false; //判断是不是审核页面
                selectedLyArr = _.map(jgLy, function(ly){return 'sly' + ly.LINGYU_ID + ';'});
                selectedLyStr = selectedLyArr.toString();
                $scope.selectedLyStr = selectedLyStr;
                $scope.adminSubWebTpl = 'views/partials/rz_selectLingYu.html';
              }
              else{
                $scope.loadingImgShow = false; //rz_selectLingYu.html
                $scope.lingyu_list = data;
                $scope.isShenHeBox = false; //判断是不是审核页面
                $scope.adminSubWebTpl = 'views/partials/rz_selectLingYu.html';
              }
            });
          }
          else{
            $scope.lingyu_list = '';
            $scope.loadingImgShow = false; //rz_selectLingYu.html
            alertInfFun('err', '没用相关的领域！');
          }
        });
      };

      /**
       * 添加领域到已选 media-body
       */
      $scope.addLingYuToSelect = function(event, nd){
        var ifCheckOrNot = $(event.target).prop('checked');
        if(ifCheckOrNot){ //添加
          if(nd.PARENT_LINGYU_ID == 0){ // 父领域
            $scope.jgSelectLingYu.push(nd);
            if(nd.CHILDREN.length){
              _.each(nd.CHILDREN, function(ly, idx, lst){
                var hasLingYuArr, hasIn;
                hasLingYuArr = _.map($scope.jgSelectLingYu, function(sly){return sly.LINGYU_ID});
                hasIn = _.contains(hasLingYuArr, ly.LINGYU_ID);
                if(!hasIn){
                  $scope.jgSelectLingYu.push(ly);
                }
              });
              $(event.target).closest('.media-body').find('.media input[type="checkbox"]').prop("checked", true);
            }
          }
          else{ //子领域
            $scope.jgSelectLingYu.push(nd);
          }
        }
        else{ //删除
          if(nd.PARENT_LINGYU_ID == 0){ // 父领域

            if(nd.CHILDREN.length){
              _.each(nd.CHILDREN, function(ly,idx,lst){
                _.each($scope.jgSelectLingYu, function(sly, sIdx, sLst){
                  if(sly.LINGYU_ID == nd.LINGYU_ID){
                    $scope.jgSelectLingYu.splice(sIdx, 1);
                  }
                  if(sly.LINGYU_ID == ly.LINGYU_ID){
                    $scope.jgSelectLingYu.splice(sIdx, 1);
                  }
                });
              });
              $(event.target).closest('.media-body').find('.media input[type="checkbox"]').prop("checked", false);
            }
          }
          else{ //子领域
            _.each($scope.jgSelectLingYu, function(sly, idx, lst){
              if(sly.LINGYU_ID == nd.LINGYU_ID){
                $scope.jgSelectLingYu.splice(idx, 1);
              }
            });
          }
        }
      };

      /**
       * 从已选科目删除领域
       */
      $scope.deleteSelectedLingYu = function(sly, idx){
        $scope.loadingImgShow = true; //rz_selectLingYu.html
        var targetClass = '.checkbox' + sly.LINGYU_ID,
          slyObj = {};
        $('.media').find(targetClass).prop('checked', false);
        lingYuData.shuju = [];
        slyObj.JIGOU_ID = jigouid;
        slyObj.LINGYU_ID = sly.LINGYU_ID;
        slyObj.ZHUANGTAI = -1;
        slyObj.LEIBIE = sly.LEIBIE;
        lingYuData.shuju.push(slyObj);
        $http.post(modifyJiGouLingYuUrl, lingYuData).success(function(data){
          if(data.result){
            $scope.jgSelectLingYu.splice(idx, 1);
            $scope.loadingImgShow = false; //rz_selectLingYu.html
          }
          else{
            $scope.loadingImgShow = false; //rz_selectLingYu.html
            alertInfFun('err', data.error);
          }
        });
      };

      /**
       * 保存题库 queryTiKuBaseUrl
       */
      var saveTiKuFun = function(){
        var tiKuObj = {
          token: token,
          caozuoyuan: caozuoyuan,
          jigouid: jigouid,
          lingyuid: '',
          shuju:{
            TIKUID: "",
            TIKUMULUID: 1,
            TIKUMINGCHENG: "",
            TIKUXINGZHI: 5,
            QUANXIANBIANMA: '1,2,3,4,5',
            ZHUANGTAI: 1
          }
        },
          queryTiKuUrl,
          lyLength = $scope.jgSelectLingYu.length,
          count = 0;
        var chaXunTiKu = function(lyData){
          queryTiKuUrl = queryTiKuBaseUrl + lyData.LINGYU_ID;
          $http.get(queryTiKuUrl).success(function(data){
            count ++;
            if(count <= lyLength){
              if(data.length){
                chaXunTiKu($scope.jgSelectLingYu[count]);
              }
              else{
                tiKuObj.lingyuid = lyData.LINGYU_ID;
                tiKuObj.shuju.TIKUMINGCHENG = lyData.LINGYUMINGCHENG;
                $http.post(xiuGaiTiKuUrl, tiKuObj).success(function(tiku){
                  if(tiku.error){
                    alertInfFun('err', tiku.error);
                  }
                  else{
                    chaXunTiKu($scope.jgSelectLingYu[count]);
                  }
                });
              }
            }
          });
        };
        chaXunTiKu($scope.jgSelectLingYu[0]);
      };

      /**
       * 修改试卷目录 queryShiJuanMuLuUrl  alterShiJuanMuLuUrl
       */
      var alterShiJuanMuLu = function(){
        var sjMuLuObj = {
            token: token,
            caozuoyuan: caozuoyuan,
            jigouid: jigouid,
            lingyuid: '',
            shuju:{
              SHIJUANMULUID: "",
              MULUMINGCHENG: "",
//              FUMULUID: "",
              ZHUANGTAI: 1
            }
          },
          querySjMuLuUrl,
          lyLength = $scope.jgSelectLingYu.length,
          count = 0;
        var chaXunSjMuLu = function(lyData){
          querySjMuLuUrl = queryShiJuanMuLuUrl + lyData.LINGYU_ID;
          $http.get(querySjMuLuUrl).success(function(data){
            count ++;
            if(count <= lyLength){
              if(data.length){
                chaXunSjMuLu($scope.jgSelectLingYu[count]);
              }
              else{
                sjMuLuObj.lingyuid = lyData.LINGYU_ID;
                sjMuLuObj.shuju.MULUMINGCHENG = lyData.LINGYUMINGCHENG;
                $http.post(alterShiJuanMuLuUrl, sjMuLuObj).success(function(mulu){
                  if(mulu.error){
                    alertInfFun('err', mulu.error);
                  }
                  else{
                    chaXunSjMuLu($scope.jgSelectLingYu[count]);
                  }
                });
              }
            }
          });
        };
        chaXunSjMuLu($scope.jgSelectLingYu[0]);
      };

      /**
       * 保存已选的领域
       */
      $scope.saveChooseLingYu = function(){
        $scope.loadingImgShow = true; //rz_selectLingYu.html
        lingYuData.shuju = [];
        _.each($scope.jgSelectLingYu, function(sly){
          var slyObj = {};
          slyObj.JIGOU_ID = jigouid;
          slyObj.LINGYU_ID = sly.LINGYU_ID;
          slyObj.ZHUANGTAI = sly.ZHUANGTAI;
          slyObj.LEIBIE = sly.LEIBIE;
          lingYuData.shuju.push(slyObj);
        });
        $http.post(modifyJiGouLingYuUrl, lingYuData).success(function(data){
          if(data.result){
            saveTiKuFun();
            alterShiJuanMuLu();
            alertInfFun('suc', '保存成功！');
            $scope.loadingImgShow = false; //rz_selectLingYu.html
          }
          else{
            $scope.loadingImgShow = false; //rz_selectLingYu.html
            alertInfFun('err', data.error);
          }
        });
      };

      /**
       * 大纲设置
       */
      $scope.renderDaGangSetTpl = function(){
        $scope.loadingImgShow = true; //rz_setDaGang.html
        var lingYuChildArr = [];
        $scope.dgZsdList = ''; //重置公共知识大纲知识点
        $scope.pubDaGangList = ''; //重置所有所有公共知识点
        $scope.publicKnowledge = ''; //重置公共知识点
        // 查询领域
        $http.get(qryLingYuUrl).success(function(data) {
          if(data.length){
            _.each(data[0].CHILDREN, function(sub1, idx1, lst1){
              _.each(sub1.CHILDREN, function(sub2, idx2, lst2){
                lingYuChildArr.push(sub2);
              });
            });
            $scope.lingYuChild = lingYuChildArr;
            $scope.loadingImgShow = false; //rz_setDaGang.html
            $scope.isShenHeBox = false; //判断是不是审核页面
            $scope.adminSubWebTpl = 'views/partials/rz_setDaGang.html';
          }
          else{
            $scope.lingyu_list = '';
            $scope.loadingImgShow = false; //rz_setDaGang.html
            $scope.adminSubWebTpl = 'views/partials/rz_setDaGang.html';
            alertInfFun('err', '没用相关的领域！');
          }
        });
      };

      /**
       * 由领域获得大纲数据
       */
      var dgLyId = '',
        publicKnowledgeData, //存放公共知识点数据的变量
        pubZsdIdArr = []; //存放公共知识点id的数组
      $scope.getPubDaGangList = function(lyId){
        var qryZsdgUrl = qryZsdgBaseUrl + lyId,
          qryPubLyZsdUrl = qryZsdBaseUrl + lyId,
          pubZsdgArr = []; //存放公共知识大纲的数组
        $scope.loadingImgShow = true; //rz_setDaGang.html
        dgLyId = lyId;
        $scope.dgZsdList = ''; //重置公共知识大纲知识点
        $scope.pubDaGangList = ''; //重置所有所有公共知识点
        $scope.publicKnowledge = ''; //重置公共知识点
        daGangData.lingyuid = lyId;
        //查询知识大纲
        $http.get(qryZsdgUrl).success(function(zsdg){
          //有知识大纲
          if(zsdg.length){
            $scope.loadingImgShow = false; //rz_setDaGang.html
            _.each(zsdg, function(dg, idx, lst){
              if(dg.LEIXING == 1){
                pubZsdgArr.push(dg);
              }
            });
            //有公共知识大纲
            if(pubZsdgArr.length){
              $scope.pubDaGangList = pubZsdgArr;
            }
            //没有公共知识大纲
            else{
              alertInfFun('pmt', '没有公共知识大纲，请新增一个！');
            }
          }
          //没有知识大纲
          else{
            $scope.loadingImgShow = false; //rz_setDaGang.html
            alertInfFun('pmt', '没有公共知识大纲，请新增一个！');
          }
        });

        //查询此领域下的所有公共知识点
        $http.get(qryPubLyZsdUrl).success(function(zsd){
          $scope.loadingImgShow = true; //rz_setDaGang.html
          if(zsd.error){
            $scope.loadingImgShow = false; //rz_setDaGang.html
            alertInfFun('err', '此领域下没有公共知识点！');
            publicKnowledgeData = '';
          }
          else{
            $scope.loadingImgShow = false; //rz_setDaGang.html
            publicKnowledgeData = zsd;
            //得到此领域下的公共知识点id的数组
            pubZsdIdArr = _.map(zsd, function(szsd){
              return szsd.ZHISHIDIAN_ID;
            });
          }
        });
      };

      /**
       * 由所选的知识大纲，得到知识点
       */
      $scope.getPubDgZsdData = function(dgId){
        var qryZsdgZsdUrl = qryZsdgZsdBaseUrl + dgLyId + '&zhishidagangid=' + dgId, //查询知识大纲知识点的url
          pubDgZsdIdArr = [], //存放公共知识大纲知识点id的数组
          diffZsdIdArr, //存放不同知识点id的变量
          singleZsdData, //存放一条公共知识点数据的变量
          pubZsdList = [], //存放多条公共知识点的变量
          selectDgDetail; //存放所选知识大纲的详细信息
        $scope.loadingImgShow = true; //rz_setDaGang.html
        $scope.publicKnowledge = ''; //重置公共知识点
        //得到知识大纲知识点id的递归函数
        function _do(item) {
          pubDgZsdIdArr.push(item.ZHISHIDIAN_ID);
          if(item.ZIJIEDIAN && item.ZIJIEDIAN.length > 0){
            _.each(item.ZIJIEDIAN, _do);
          }
        }
        //得到所选的知识大纲的详细信息
        selectDgDetail = _.findWhere($scope.pubDaGangList, { ZHISHIDAGANG_ID: dgId });
        if(_.size(selectDgDetail)){
          daGangData.shuju.ZHISHIDAGANG_ID = selectDgDetail.ZHISHIDAGANG_ID;
          daGangData.shuju.ZHISHIDAGANGMINGCHENG = selectDgDetail.ZHISHIDAGANGMINGCHENG;
          daGangData.shuju.DAGANGSHUOMING = selectDgDetail.DAGANGSHUOMING;
          daGangData.shuju.GENJIEDIAN_ID = selectDgDetail.GENJIEDIAN_ID;
          daGangData.shuju.LEIXING = 1;
          daGangData.shuju.ZHUANGTAI = selectDgDetail.ZHUANGTAI;
          daGangData.shuju.JIEDIAN = [];
          isAddNewPubDg = false; //是否是新建知识大纲
        }

        //查询此公共知识大纲下的知识点
        $http.get(qryZsdgZsdUrl).success(function(dgZsd){
          if(dgZsd.length){
            $scope.loadingImgShow = false; //rz_setDaGang.html
            $scope.dgZsdList = dgZsd;
            //从公共知识点中去除大纲中已有的知识点
            //得到知识大纲知识点的数组
            _.each(dgZsd, _do);

            //从已有的公共知识点中减去知识大纲知识点
            diffZsdIdArr = _.difference(pubZsdIdArr, pubDgZsdIdArr);
            //得到相对应的公共知识大纲知识点
            _.each(diffZsdIdArr, function(zsdId, idx, lst){
              singleZsdData = _.findWhere(publicKnowledgeData, { ZHISHIDIAN_ID: zsdId });
              pubZsdList.push(singleZsdData);
            });
            $scope.publicKnowledge = pubZsdList;
          }
          else{
            $scope.loadingImgShow = false; //rz_setDaGang.html
            $scope.dgZsdList = '';
          }
        });
      };

      /**
       * 添加知识点
       */
      $scope.dgAddNd = function(nd) {
        var newNd = {};
        newNd.JIEDIAN_ID = '';
        newNd.ZHISHIDIAN_ID = '';
        newNd.ZHISHIDIANMINGCHENG = '';
        newNd.ZHISHIDIAN_LEIXING = 1;
        newNd.JIEDIANLEIXING = '';
        newNd.JIEDIANXUHAO = nd.ZIJIEDIAN.length + 1;
        newNd.ZHUANGTAI = 1;
        newNd.ZIJIEDIAN = [];
        nd.ZIJIEDIAN.push(newNd);
      };

      /**
       * 删除知识点
       */
      $scope.dgRemoveNd = function(parentNd, nd, idx) {
        function getPubZsd(item) {
          if(item.ZHISHIDIAN_ID){
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
       * 那一个输入框被选中了
       */
      var targetInput, targetNd;
      $scope.getInputIndex = function(event, nd){
        targetInput = $(event.target);
        targetNd = nd;
      };

      /**
       * 将公共知识点添加到知识大纲
       */
      $scope.addToDaGang = function(zsd, idx){
        targetNd.ZHISHIDIAN_ID = zsd.ZHISHIDIAN_ID;
        targetNd.ZHISHIDIANMINGCHENG = zsd.ZHISHIDIANMINGCHENG;
//        targetInput.focus();  //此处有问题先注释掉
        targetNd = '';
        $scope.publicKnowledge.splice(idx, 1);
      };

      /**
       * 当输入介绍后检查公共知识大纲中是否已经存在知识点
       */
      $scope.compareInputVal = function(nd){
        var str  = nd.ZHISHIDIANMINGCHENG;
        str = str.replace(/\s+/g,"");
        var result = _.findWhere($scope.publicKnowledge, { ZHISHIDIANMINGCHENG: str });
        if(result){
          nd.ZHISHIDIAN_ID = result.ZHISHIDIAN_ID;
          nd.ZHISHIDIANMINGCHENG = result.ZHISHIDIANMINGCHENG;
          $scope.publicKnowledge = _.reject($scope.publicKnowledge, function(pkg){
            return pkg.ZHISHIDIAN_ID == result.ZHISHIDIAN_ID;
          });
        }
      };

      /**
       * 新增公共知识大纲
       */
      var isAddNewPubDg = false; //是不是新建知识大纲
      $scope.addNewPubDaGang = function(){
        var jieDianObj = {},
          selectLyText = $(".daGangLySelect").find("option:selected").text();
        $scope.dgZsdList = ''; //重置公共知识大纲知识点
        daGangJieDianData = []; //定义一个大纲节点的数据
        //保存大纲是用到的第一级子节点
        jieDianObj.JIEDIAN_ID = '';
        jieDianObj.ZHISHIDIAN_ID = '';
        jieDianObj.ZHISHIDIANMINGCHENG = selectLyText + '新建公共知识大纲';
        jieDianObj.ZHISHIDIAN_LEIXING = 1;
        jieDianObj.JIEDIANLEIXING = '';
        jieDianObj.JIEDIANXUHAO = 1;
        jieDianObj.ZHUANGTAI = 1;
        jieDianObj.ZIJIEDIAN = [];
        daGangJieDianData.push(jieDianObj);
        isAddNewPubDg = true;
        $scope.dgZsdList = daGangJieDianData;

        //保存大纲其他数据赋值
        daGangData.shuju.ZHISHIDAGANG_ID = '';
        daGangData.shuju.ZHISHIDAGANGMINGCHENG = '';
        daGangData.shuju.DAGANGSHUOMING = selectLyText + '新建公共知识大纲';
        daGangData.shuju.GENJIEDIAN_ID = '';
        daGangData.shuju.LEIXING = 1;
        daGangData.shuju.ZHUANGTAI = 1;
        daGangData.shuju.JIEDIAN = [];

        //重新加载公共知识点
        $scope.publicKnowledge = publicKnowledgeData;
      };

      /**
       * 保存知识大纲
       */
      $scope.saveDaGangData = function() {
        var countEmpty = true;
        $scope.loadingImgShow = true; //rz_setDaGang.html
        function _do(item) {
          item.ZHISHIDIAN_LEIXING = item.LEIXING || 1;
          item.ZHISHIDIANMINGCHENG = item.ZHISHIDIANMINGCHENG.replace(/\s+/g,"");
          if(!item.ZHISHIDIANMINGCHENG){
            countEmpty = false;
          }
          delete item.LEIXING;
          if (item.ZIJIEDIAN && item.ZIJIEDIAN.length > 0) {
            _.each(item.ZIJIEDIAN, _do);
          }
        }
        daGangData.shuju.JIEDIAN = $scope.dgZsdList;
        daGangData.shuju.ZHISHIDAGANGMINGCHENG = $scope.dgZsdList[0].ZHISHIDIANMINGCHENG;
        _.each(daGangData.shuju.JIEDIAN, _do);
        //保存知识大纲
        if(countEmpty){
          $http.post(modifyZsdgUrl, daGangData).success(function(data) {
            console.log(data);
            if(data.result){
              $scope.loadingImgShow = false; //rz_setDaGang.html
              alertInfFun('suc', '保存成功！');
              $scope.getPubDaGangList(dgLyId); //重新查询此领域下的大纲
            }
            else{
              $scope.loadingImgShow = false; //rz_setDaGang.html
              alertInfFun('err', data.error);
            }
          });
        }
        else{
          $scope.loadingImgShow = false; //rz_setDaGang.html
          alertInfFun('pmt', '知识点名称不能为空！');
        }
      };

      /**
       * 科目题型选择//
       */
      $scope.renderTiXingSelectTpl = function(){
        $scope.loadingImgShow = true; //rz_selectTiXing.html
        var qryLingYuByJiGou = qryLingYuUrl + '&jigouid=' + userInfo.JIGOU[0].JIGOU_ID,
          childLyArr = [];
        $http.get(qryLingYuByJiGou).success(function(jgLy) { //查询本机构下的领域
          if(jgLy.length){
            _.each(jgLy, function(ply, idx, lst){
              childLyArr.push(ply);
              if(ply.CHILDREN.length){
                _.each(ply.CHILDREN, function(cly, cidx, clst){
                  childLyArr.push(cly);
                });
              }
            });
            $http.get(qryTiXingUrl).success(function(allTx){
              if(allTx.length){
                $scope.selectTiXingLiYing = childLyArr;
                $scope.allTiXing = allTx;
                $scope.loadingImgShow = false; //rz_selectTiXing.html
                $scope.isShenHeBox = false; //判断是不是审核页面
                $scope.adminSubWebTpl = 'views/partials/rz_selectTiXing.html';
              }
              else{
                $scope.loadingImgShow = false; //rz_selectTiXing.html
                alertInfFun('err', allTx.error);
              }
            });
          }
          else{
            $scope.loadingImgShow = false; //rz_selectTiXing.html
            $scope.isShenHeBox = false; //判断是不是审核页面
            $scope.adminSubWebTpl = 'views/partials/rz_selectTiXing.html';
            alertInfFun('err', jgLy.error);
          }
        });
      };

      /**
       * 那个领域被选中
       */
      var originKmtx;
      $scope.whichLingYuActive = function(lyId){
        originKmtx = '';
        $scope.activeLingYu = lyId;
        $http.get(qryKmTx + lyId).success(function(data){
          if(data.error){
            alertInfFun('err', data.error);
          }
          else{
            $scope.kmtxList = data;
            originKmtx = _.map(data, function(tx){return tx.TIXING_ID});
            $scope.selectedTxLyStr = _.map(data, function(tx){return 'tx' + tx.TIXING_ID + ';'}).toString();
          }
        });
      };

      /**
       * 添加或者删除题型
       */
      $scope.addOrRemoveTiXing = function(event, tx){
        tiXingData.shuju = [];
        var hasIn = _.contains(originKmtx, tx.TIXING_ID),
          ifCheckOrNot = $(event.target).prop('checked');
        if(ifCheckOrNot){
          $scope.kmtxList.push(tx);
        }
        else{
          if(hasIn){
            var indexInOkt = _.indexOf(originKmtx, tx.TIXING_ID);
            $scope.kmtxList[indexInOkt].ZHUANGTAI = -1;
          }
          else{
            $scope.kmtxList = _.reject($scope.kmtxList, function(kmtx){ return kmtx.TIXING_ID == tx.TIXING_ID; });
          }
        }
      };

      /**
       * 保存已选的题型
       */
      $scope.saveSelectTiXing = function(){
        $scope.loadingImgShow = true; //rz_selectTiXing.html
        tiXingData.shuju = [];
        _.each($scope.kmtxList, function(kmtx, idx, lst){
          var txObj = {};
          txObj.TIXING_ID = kmtx.TIXING_ID;
          txObj.JIGOU_ID = jigouid;
          txObj.LINGYU_ID = $scope.activeLingYu;
          txObj.ZHUANGTAI = kmtx.ZHUANGTAI >= -1 ? kmtx.ZHUANGTAI : 1;
          tiXingData.shuju.push(txObj);
        });
        $http.post(modifyTxJgLyUrl, tiXingData).success(function(data){
          if(data.result){
            alertInfFun('err', '保存成功！');
            $scope.loadingImgShow = false; //rz_selectTiXing.html
          }
          else{
            $scope.loadingImgShow = false; //rz_selectTiXing.html
            alertInfFun('err', data.error);
          }
        });
      };

    }]);
});
