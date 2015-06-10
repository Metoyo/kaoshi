define(['angular', 'config', 'jquery', 'lazy'], function (angular, config, $, lazy) {
  'use strict';

  /**
   * @ngdoc function
   * @name kaoshiApp.controller:GuanLiCtrl
   * @description
   * # GuanLiCtrl
   * Controller of the kaoshiApp
   */
  angular.module('kaoshiApp.controllers.GuanLiCtrl', [])
    .controller('GuanLiCtrl', ['$rootScope', '$scope', 'DataService', '$http',
      function ($rootScope, $scope, DataService, $http) {

        $rootScope.isRenZheng = false; //判读页面是不是认证
        /**
         * 声明变量
         */
        var userInfo = $rootScope.session.userInfo;
        var baseMtAPIUrl = config.apiurl_mt; //mingti的api
        var baseRzAPIUrl = config.apiurl_rz; //renzheng的api
        var token = config.token;
        var caozuoyuan = userInfo.UID ;//登录的用户的UID
        var jigouid = userInfo.JIGOU[0].JIGOU_ID;
        var lingyuid = $rootScope.session.defaultLyId;
        var tiKuLingYuId = $rootScope.session.defaultTiKuLyId;
        var kxhManageUrl = baseRzAPIUrl + 'kexuhao'; //课序号管理的url
        var qryTeacherUrl = baseRzAPIUrl + 'query_jgly_teacher?token=' + token + '&jigouid=' + jigouid +
          '&lingyuid=' + lingyuid; //查询本机构下教师
        var numPerPage = 10; //每页10条数据
        var keXuHaoPagesArr = []; //存放课序号分页的数组
        var keXuHaoStore; //存放课序号原始数据
        var paginationLength = 7; //分页部分，页码的长度，目前设定为7

        $scope.guanliParams = {
          tabActive: '',
          addNewKxh: '' //添加课序号
        };
        $scope.glEditBoxShow = ''; //弹出层显示那一部分内容
        $scope.jgLyTeachers = ''; //本机构和领域下的老师
        $scope.keXuHaoPgData = ''; //课序号数据
        $scope.glSelectData = '';

        /**
         * 查询本机构下的老师
         */
        var qryJiGouTeachers = function(jsArr, itmeType){
          $http.get(qryTeacherUrl).success(function(data){
            if(data && data.length > 0){
              if(itmeType && (itmeType == 'modifyKeXuHao')){
                if(jsArr && jsArr.length > 0){
                  Lazy(jsArr).each(function(sjs){
                    Lazy(data).each(function(js){
                      if(js.UID == sjs.UID){
                        js.ckd = true;
                      }
                    });
                  });
                }
              }
              $scope.jgLyTeachers = data;
            }
            else{
              DataService.alertInfFun('err', data.error);
            }
          });
        };

        /**
         * 查询课序号
         */
        var queryKeXuHao = function(){
          var qryKxhUrl = kxhManageUrl + '?token=' + token + '&JIGOU_ID=' + jigouid + '&LINGYU_ID=' + lingyuid;
          $http.get(qryKxhUrl).success(function(data){
            if(data && data.length > 0){
              var dataLength = data.length; //所以二级专业长度
              if(dataLength > 10){
                var lastPage = Math.ceil(dataLength/numPerPage); //最后一页
                $scope.lastKxhPageNum = lastPage;
                keXuHaoPagesArr = [];
                if(lastPage){
                  for(var i = 1; i <= lastPage; i++){
                    keXuHaoPagesArr.push(i);
                  }
                }
                keXuHaoStore = data;
                $scope.keXuHaoDist(1);
              }
              else{
                $scope.keXuHaoData = data;
              }
            }
            else{
              DataService.alertInfFun('err', data.error);
            }
          });
        };

        /**
         * 显示弹出层
         */
        $scope.showKeXuHaoPop = function(item, data){
          $scope.showKeXuHaoManage = true;
          $scope.glEditBoxShow = item;
          if(item == 'addKeXuHao'){
            qryJiGouTeachers();
          }
          if(item == 'modifyKeXuHao'){
            qryJiGouTeachers(data.JIAOSHI, 'modifyKeXuHao');
            $scope.guanliParams.modifyKxh = data.KEXUHAO_MINGCHENG;
          }
          if(data){
            $scope.glSelectData = data;
          }
        };

        /**
         * 关闭课序号管理的弹出层
         */
        $scope.closeKeXuHaoManage = function(){
          $scope.showKeXuHaoManage = false;
          $scope.glEditBoxShow = ''; //弹出层显示那一部分重置
        };

        /**
         * 课序号的分页数据
         */
        $scope.keXuHaoDist = function(pg){
          var startPage = (pg-1) * numPerPage;
          var endPage = pg * numPerPage;
          var lastPageNum = $scope.lastKxhPageNum;
          $scope.currentKxhPageVal = pg;
          //得到分页数组的代码
          var currentPageNum = pg ? pg : 1;
          if(lastPageNum <= paginationLength){
            $scope.keXuHaoPages = keXuHaoPagesArr;
          }
          if(lastPageNum > paginationLength){
            if(currentPageNum > 0 && currentPageNum <= 4 ){
              $scope.keXuHaoPages = keXuHaoPagesArr.slice(0, paginationLength);
            }
            else if(currentPageNum > lastPageNum - 4 && currentPageNum <= lastPageNum){
              $scope.keXuHaoPages = keXuHaoPagesArr.slice(lastPageNum - paginationLength);
            }
            else{
              $scope.keXuHaoPages = keXuHaoPagesArr.slice(currentPageNum - 4, currentPageNum + 3);
            }
          }
          $scope.keXuHaoData = keXuHaoStore.slice(startPage, endPage);
        };

        /**
         * 课序号管理保存数据
         */
        $scope.saveKeXuHaoModify = function(){
          var saveType = $scope.glEditBoxShow;
          var keXuHaoObj;
          var uidArr = [];
          if(saveType == 'addKeXuHao'){ //新增课序号
            if($scope.guanliParams.addNewKxh){
              keXuHaoObj = {
                token: token,
                caozuoyuan: caozuoyuan,
                shuju: {
                  KEXUHAO_ID: '',
                  KEXUHAO_MINGCHENG: $scope.guanliParams.addNewKxh,
                  JIGOU_ID: jigouid,
                  LINGYU_ID: lingyuid,
                  SETTINGS: '',
                  UIDS: ''
                }
              };
              Lazy($scope.jgLyTeachers).each(function(th){
                if(th.ckd && (th.ckd == true)){
                  uidArr.push(th.UID);
                }
              });
              if(uidArr && uidArr.length > 0){
                keXuHaoObj.shuju.UIDS = uidArr.join(',');
                $http.post(kxhManageUrl, keXuHaoObj).success(function(data){
                  if(data.result){
                    $scope.glEditBoxShow = ''; //弹出层显示那一部分内容重置
                    $scope.guanliParams.addNewKxh = ''; //课序号重置
                    $scope.showKeXuHaoManage = false; //课序号重置
                    queryKeXuHao();
                    DataService.alertInfFun('suc', '新增课序号成功！');
                  }
                  else{
                    DataService.alertInfFun('err', data.error);
                  }
                });
              }
              else{
                DataService.alertInfFun('pmt', '请选择任课课老师！');
              }
            }
            else{
              DataService.alertInfFun('pmt', '新课序号为空！');
            }
          }
          if(saveType == 'modifyKeXuHao'){ //修改课序号
            if($scope.guanliParams.modifyKxh){
              keXuHaoObj = {
                token: token,
                caozuoyuan: caozuoyuan,
                shuju: {
                  KEXUHAO_ID: '',
                  KEXUHAO_MINGCHENG: $scope.guanliParams.modifyKxh,
                  JIGOU_ID: jigouid,
                  LINGYU_ID: lingyuid,
                  SETTINGS: '',
                  UIDS: ''
                }
              };
              if($scope.glSelectData){
                keXuHaoObj.shuju.KEXUHAO_ID = $scope.glSelectData.KEXUHAO_ID;
                Lazy($scope.jgLyTeachers).each(function(th){
                  if(th.ckd && (th.ckd == true)){
                    uidArr.push(th.UID);
                  }
                });
                if(uidArr && uidArr.length > 0) {
                  keXuHaoObj.shuju.UIDS = uidArr.join(',');
                  $http.post(kxhManageUrl, keXuHaoObj).success(function(data){
                    if(data.result){
                      $scope.glEditBoxShow = ''; //弹出层显示那一部分内容重置
                      $scope.guanliParams.addNewKxh = ''; //课序号重置
                      $scope.showKeXuHaoManage = false; //课序号重置
                      $scope.glSelectData = '';
                      queryKeXuHao();
                      DataService.alertInfFun('suc', '修改成功！');
                    }
                    else{
                      DataService.alertInfFun('err', data.error);
                    }
                  });
                }
              }
            }
          }
          //if(saveType == 'addSingleWork'){ //添加单个员工
          //  if($scope.guanliParams.singleWorkName){
          //    if($scope.guanliParams.singleWorkID){
          //      //先去查询UID
          //      var chaXunStuUrl = chaXunJiGouYongHuUrl + '?token=' + token + '&jigouid=' + jigouid +
          //        '&sfzh=' + $scope.guanliParams.singleWorkID;
          //      $http.get(chaXunStuUrl).success(function(data){
          //        if(data && data.length){
          //          keXuHaoObj = {
          //            token: token,
          //            kexuhaoid: '',
          //            users: [{uid: data[0].UID, zhuangtai:1}]
          //          };
          //          if($scope.selectBmOrKxh){
          //            keXuHaoObj.kexuhaoid = $scope.selectBmOrKxh.KEXUHAO_ID;
          //            $http.post(modifyKxhYh, keXuHaoObj).success(function(addKxh){
          //              if(addKxh.result){
          //                DataService.alertInfFun('suc', '添加用户成功!');
          //                $scope.renYuanAddType = '';
          //                $scope.glSelectData = '';
          //                $scope.showKeXuHaoManage = false;
          //                $scope.guanliParams.singleWorkName = '';
          //                $scope.guanliParams.singleWorkID = '';
          //                $scope.chaXunKxhYongHu($scope.selectBmOrKxh);
          //              }
          //              else{
          //                DataService.alertInfFun('err', addKxh.error);
          //              }
          //            });
          //          }
          //          else{
          //            DataService.alertInfFun('pmt', '课序号ID为空！');
          //          }
          //        }
          //        else{
          //          DataService.alertInfFun('err', data.error);
          //        }
          //      });
          //    }
          //    else{
          //      DataService.alertInfFun('pmt', '缺少身份证！');
          //    }
          //  }
          //  else{
          //    DataService.alertInfFun('pmt', '缺少姓名！');
          //  }
          //}
          //if(saveType == 'addBatchWorks'){ //批量添加员工
          //  var file = $scope.uploadFiles;
          //  var worksData = {
          //    token: token,
          //    kexuhaoid: ''
          //  };
          //  if($scope.selectBmOrKxh){
          //    worksData.kexuhaoid = $scope.selectBmOrKxh.KEXUHAO_ID;
          //    $scope.loadingImgShow = true;
          //    var fd = new FormData();
          //    for(var j = 1; j <= file.length; j++){
          //      fd.append('file' + j, file[j - 1]);
          //    }
          //    for(var key in worksData){
          //      fd.append(key, worksData[key]);
          //    }
          //    $http.post(modifyKxhYh, fd, {transformRequest: angular.identity, headers:{'Content-Type': undefined}})
          //      .success(function(data){
          //        if(data){
          //          $scope.loadingImgShow = false;
          //          $scope.showKeXuHaoManage = '';
          //          DataService.alertInfFun('suc', '批量新增成功！');
          //          $scope.chaXunKxhYongHu($scope.selectBmOrKxh);
          //        }
          //        else{
          //          $scope.loadingImgShow = false;
          //          DataService.alertInfFun('err', data.error);
          //        }
          //      });
          //  }
          //  else{
          //    DataService.alertInfFun('pmt', '请选择课序号！');
          //  }
          //}
        };

        /**
         * 删除专业
         */
        $scope.deleteKeXuHao = function(kxh){
          var keXuHaoObj = {
            token: token,
            caozuoyuan: caozuoyuan,
            shuju: {
              KEXUHAO_ID: ''
            }
          };
          if(kxh){
            keXuHaoObj.shuju.KEXUHAO_ID = kxh.KEXUHAO_ID;
            if(confirm('确定要删除此课序号吗？')){
              $http.delete(kxhManageUrl, {params: keXuHaoObj}).success(function(data){
                if(data.result){
                  DataService.alertInfFun('suc', '删除成功！');
                  queryKeXuHao();
                }
                else{
                  DataService.alertInfFun('err', data.error);
                }
              });
            }
          }
        };

        /**
         * 考生内容切换
         */
        $scope.guanLiTabSlide = function (tab) {
          $scope.guanliParams.tabActive = '';
          $scope.glSelectData = '';
          $scope.keXuHaoPgData = '';
          keXuHaoPagesArr = [];
          keXuHaoStore = '';
          //if (tab == 'people') {
          //  $scope.guanliParams.tabActive = 'people';
          //  $scope.guanLiTpl = 'views/guanli/renyuan.html';
          //}
          if (tab == 'kexuhao') {
            queryKeXuHao();
            $scope.guanliParams.tabActive = 'kexuhao';
            $scope.guanLiTpl = 'views/guanli/kexuhao.html';
          }
          //if (tab == 'bumen') {
          //  $scope.workersData = '';
          //  $scope.selectBmOrKxh = '';
          //  $scope.banZuData = '';
          //  $scope.guanliParams.addWorkJgId = '';
          //  $scope.kowledgeList = '';
          //  $scope.guanliParams.selected_zy = '';
          //  $scope.guanliParams.selected_bm = '';
          //  $scope.guanliParams.selected_bz = '';
          //  $scope.guanliParams.tabActive = 'bumen';
          //  $scope.guanLiTpl = 'views/guanli/bumen.html';
          //  getJgList();
          //}
        };
        $scope.guanLiTabSlide('kexuhao');

    }]);
});
