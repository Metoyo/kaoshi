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
        selectedLyArr = ''; //已选择的领域ID

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
            alert(data.error);
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
            }).error(function(data) {
                alert(data.error);
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
            alert('没用相应的机构！');
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
                alert('没有相关的机构！');
              }
            });
          }
          else{
            $scope.jigou_list = '';
            $scope.loadingImgShow = false; //rz_setJiGou.html
            alert('没有相关的机构！');
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
              alert(data.error);
            }
          });
        }
        else{
          $scope.loadingImgShow = false; //rz_setJiGou.html
          alert('请输入机构名称！');
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
            alert(data.error);
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
                alert(data.error);
              }
            });
          }
          else{
            $scope.loadingImgShow = false; //rz_setJiGou.html
            alert('请输入管理员密码！');
          }
        }
        else{
          $scope.loadingImgShow = false; //rz_setJiGou.html
          alert('请输入管理员账号！');
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
            alert(data.error);
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
            alert(data.error);
          }
        });
      };

      /**
       * 展示科目设置(领域)
       */
      $scope.renderLingYuSetTpl = function(){
        $scope.loadingImgShow = true; //rz_setLingYu.html
        // 查询机构类别
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
            alert('没用相关的领域！');
          }
        });
      };

      /**
       * 添加知识点
       */
      $scope.addNd = function(nd) {
        var newNd = {};
        newNd.LINGYU_ID = '';
        newNd.LINGYUMINGCHENG = '';
        newNd.BIANMA = '';
        newNd.ZHUANGTAI = 1;
        newNd.CHILDREN = [];
        nd.CHILDREN.push(newNd);
      };

      /**
       * 删除知识点
       */
      $scope.removeNd = function(parentNd, idx) {
        parentNd.CHILDREN.splice(idx, 1);
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
            $('.save-msg').show().fadeOut(3000);
            $scope.loadingImgShow = false; //rz_setLingYu.html
          }
          else{
            $scope.loadingImgShow = false; //rz_setLingYu.html
            alert(data.error);
          }
        });
      };

      /**
       * 学校科目选择 modifyJiGouLingYuUrl
       */
      $scope.renderLingYuSelectTpl = function(){
        $scope.jgSelectLingYu = '';
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
            alert('没用相关的领域！');
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
                _.each($scope.jgSelectLingYu, function(sly,sIdx,sLst){
                  if(sly.LINGYU_ID == ly.LINGYU_ID){
                    $scope.jgSelectLingYu.splice(sIdx, 1);
                  }
                });
              });
              $(event.target).closest('.media-body').find('.media input[type="checkbox"]').prop("checked", false);
            }
          }
          else{ //子领域
            _.each($scope.jgSelectLingYu, function(sly,idx,lst){
              if(sly.LINGYU_ID == nd.LINGYU_ID){
                $scope.jgSelectLingYu.splice(idx, 1);
              }
            });
          }
        }
      };

      /**
       * 科目题型选择
       */
      $scope.renderTiXingSelectTpl = function(){

      };

    }]);
});
