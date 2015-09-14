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
        var chaXunStuBaseUrl = baseRzAPIUrl + 'query_student'; //查询机构下面的用户
        var modifyKxhYh = baseRzAPIUrl + 'kexuhao_yonghu'; //修改课序号下面的用户
        var xiuGaiYh = baseRzAPIUrl + 'xiugai_yonghu'; //修改用户
        var singleYhAddToKxh = baseRzAPIUrl + 'add_yonghu_withkxh'; //单个新用户添加课序号
        var importUser = baseRzAPIUrl + 'import_users2'; //大批新增用户
        var totalStuPage = []; //所有的课序号考生的页码数

        $scope.guanliParams = {
          tabActive: '',
          addNewKxh: '', //添加课序号
          addNewKxhSetting: '', //添加课序号设置
          modifyKxh: '', //课序号修改
          singleStuName: '', //学生姓名
          singleStuID: '' //学生学号
        };
        $scope.glEditBoxShow = ''; //弹出层显示那一部分内容
        $scope.jgLyTeachers = ''; //本机构和领域下的老师
        $scope.keXuHaoPgData = ''; //课序号数据
        $scope.glSelectData = ''; //课序号保存是选中的课序号
        $scope.selectKxh = ''; //选中的课序号

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
              var sortData = Lazy(data).sortBy(function(stu){
                return stu.KEXUHAO;
              }).toArray();
              Lazy(sortData).each(function(kxh){
                kxh.jiaoShiStr = Lazy(kxh.JIAOSHI).map(function(js){
                  return js.XINGMING;
                }).toArray().join(';');
              });
              if(dataLength > 10){
                var lastPage = Math.ceil(dataLength/numPerPage); //最后一页
                $scope.lastKxhPageNum = lastPage;
                keXuHaoPagesArr = [];
                if(lastPage){
                  for(var i = 1; i <= lastPage; i++){
                    keXuHaoPagesArr.push(i);
                  }
                }
                keXuHaoStore = sortData;
                $scope.keXuHaoDist(1);
              }
              else{
                $scope.keXuHaoData = sortData;
              }
            }
            else{
              DataService.alertInfFun('err', data.error);
            }
          });
        };

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

        /**
         * 显示弹出层
         */
        $scope.showKeXuHaoPop = function(item, data){
          $scope.showKeXuHaoManage = true;
          $scope.glEditBoxShow = item;
          $scope.uploadFiles = [];
          if(item == 'addKeXuHao'){
            qryJiGouTeachers();
          }
          if(item == 'modifyKeXuHao'){
            qryJiGouTeachers(data.JIAOSHI, 'modifyKeXuHao');
            $scope.guanliParams.modifyKxh = data;
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
                  SETTINGS: $scope.guanliParams.addNewKxhSetting,
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
                  if(data.result == true){
                    $scope.glEditBoxShow = ''; //弹出层显示那一部分内容重置
                    $scope.guanliParams.addNewKxh = ''; //课序号重置
                    $scope.guanliParams.addNewKxhSetting = '';
                    $scope.showKeXuHaoManage = false; //课序号重置
                    $scope.guanliParams.modifyKxh = '';
                    queryKeXuHao();
                    DataService.alertInfFun('suc', '新增课序号成功！');
                  }
                  if(data.result == false){
                    DataService.alertInfFun('pmt', '课序号名称已存在！请修改课序号名称！');
                  }
                  if(data.error){
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
                  KEXUHAO_MINGCHENG: $scope.guanliParams.modifyKxh.KEXUHAO_MINGCHENG,
                  JIGOU_ID: jigouid,
                  LINGYU_ID: lingyuid,
                  SETTINGS: $scope.guanliParams.modifyKxh.SETTINGS,
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
                      $scope.guanliParams.addNewKxhSetting = '';
                      $scope.showKeXuHaoManage = false; //课序号重置
                      $scope.glSelectData = '';
                      $scope.guanliParams.modifyKxh = '';
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
          if(saveType == 'addSingleStu'){ //添加单个学生
            if($scope.guanliParams.singleStuName){
              if($scope.guanliParams.singleStuID){
                //先去查询UID
                var chaXunStuUrl = chaXunStuBaseUrl + '?token=' + token + '&jigouid=' + jigouid +
                  '&xuehao=' + $scope.guanliParams.singleStuID + '&xingming=' + $scope.guanliParams.singleStuName;
                $http.get(chaXunStuUrl).success(function(data){
                  if(data && data.length > 0){
                    keXuHaoObj = {
                      token: token,
                      kexuhaoid: '',
                      users: [{uid: data[0].UID, zhuangtai:1}]
                    };
                    if($scope.selectKxh){
                      keXuHaoObj.kexuhaoid = $scope.selectKxh.KEXUHAO_ID;
                      $http.post(modifyKxhYh, keXuHaoObj).success(function(addKxh){
                        if(addKxh.result){
                          DataService.alertInfFun('suc', '添加用户成功!');
                          $scope.renYuanAddType = '';
                          $scope.glSelectData = '';
                          $scope.showKeXuHaoManage = false;
                          $scope.guanliParams.singleStuName = '';
                          $scope.guanliParams.singleStuID = '';
                          $scope.chaXunKxhYongHu($scope.selectKxh);
                        }
                        else{
                          DataService.alertInfFun('err', addKxh.error);
                        }
                      });
                    }
                    else{
                      DataService.alertInfFun('pmt', '课序号ID为空！');
                    }
                  }
                  else if(data && data.length == 0){
                    var singleYhObj = {
                      token: token,
                      YONGHULEIBIE: 2,
                      YONGHUHAO: $scope.guanliParams.singleStuID,
                      XINGMING: $scope.guanliParams.singleStuName,
                      ZHUANGTAI: 1,
                      JIGOU: [{JIGOU_ID: jigouid, ZHUANGTAI: 1}],
                      KEXUHAO_ID: $scope.selectKxh.KEXUHAO_ID
                    };
                    $http.post(singleYhAddToKxh, singleYhObj).success(function(result){
                      if(result.result){
                        $scope.renYuanAddType = '';
                        $scope.glSelectData = '';
                        $scope.showKeXuHaoManage = false;
                        $scope.guanliParams.singleStuName = '';
                        $scope.guanliParams.singleStuID = '';
                        $scope.chaXunKxhYongHu($scope.selectKxh);
                        DataService.alertInfFun('suc', '添加用户成功!');
                      }
                      else{
                        DataService.alertInfFun('err', result.error);
                      }
                    });
                  }
                  else{
                    DataService.alertInfFun('err', data.error);
                  }
                });
              }
              else{
                DataService.alertInfFun('pmt', '缺少学号！');
              }
            }
            else{
              DataService.alertInfFun('pmt', '缺少姓名！');
            }
          }
          if(saveType == 'addBatchStus'){ //批量添加学生
            var file = $scope.uploadFiles;
            var stusData = {
              token: token,
              jigouid: jigouid,
              kexuhaoid: ''
            };
            if($scope.selectKxh){
              stusData.kexuhaoid = $scope.selectKxh.KEXUHAO_ID;
              $scope.loadingImgShow = true;
              var fd = new FormData();
              for(var j = 1; j <= file.length; j++){
                fd.append('file' + j, file[j - 1]);
              }
              for(var key in stusData){
                fd.append(key, stusData[key]);
              }
              $http.post(importUser, fd, {transformRequest: angular.identity, headers:{'Content-Type': undefined}})
                .success(function(data){
                  if(data && data.length > 0){
                    $scope.loadingImgShow = false;
                    $scope.showKeXuHaoManage = '';
                    DataService.alertInfFun('suc', '批量新增成功！');
                    $scope.chaXunKxhYongHu($scope.selectKxh);
                  }
                  else{
                    $scope.loadingImgShow = false;
                    DataService.alertInfFun('err', data.error);
                  }
                });
            }
            else{
              DataService.alertInfFun('pmt', '请选择课序号！');
            }
          }
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
          $scope.studentsOrgData = '';
          $scope.studentsData = '';
          $scope.studentsPages = '';
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
          //  $scope.studentsData = '';
          //  $scope.selectKxh = '';
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

        /**
         * 查询课序号学生
         */
        $scope.chaXunKxhYongHu = function(kxh){
          $scope.studentsData = '';
          if(kxh){
            $scope.selectKxh = kxh;
            var chaXunYongHu = chaXunStuBaseUrl + '?token=' + token + '&kexuhaoid=' + kxh.KEXUHAO_ID;
            $http.get(chaXunYongHu).success(function(data){
              if(data && data.length > 0){
                $scope.studentsOrgData = data;
                kxh.STUDENTS = data.length;
                studentsPages(data);
              }
              else{
                $scope.studentsOrgData = '';
              }
            });
          }
          else{
            DataService.alertInfFun('pmt', '缺少课序号ID！');
          }
        };

        /**
         * 学生分页数码
         */
        var studentsPages = function(wks){
          totalStuPage = [];
          $scope.studentsPages = '';
          $scope.lastStuPageNum = '';
          if(wks && wks.length > 10){
            var stusLength;
            var stusLastPage;
            stusLength = wks.length;
            stusLastPage = Math.ceil(stusLength/numPerPage);
            $scope.lastStuPageNum = stusLastPage;
            for(var i = 1; i <= stusLastPage; i++){
              totalStuPage.push(i);
            }
            $scope.studentPgDist(1);
          }
          else{
            $scope.studentsData = $scope.studentsOrgData.slice(0);
          }
        };

        /**
         * 学生分页
         */
        $scope.studentPgDist = function(pg){
          var startPage = (pg-1) * numPerPage;
          var endPage = pg * numPerPage;
          var lastPageNum = $scope.lastStuPageNum;
          $scope.currentStuPageVal = pg;
          //得到分页数组的代码
          var currentPageNum = pg ? pg : 1;
          if(lastPageNum <= paginationLength){
            $scope.studentsPages = totalStuPage;
          }
          if(lastPageNum > paginationLength){
            if(currentPageNum > 0 && currentPageNum <= 4 ){
              $scope.studentsPages = totalStuPage.slice(0, paginationLength);
            }
            else if(currentPageNum > lastPageNum - 4 && currentPageNum <= lastPageNum){
              $scope.studentsPages = totalStuPage.slice(lastPageNum - paginationLength);
            }
            else{
              $scope.studentsPages = totalStuPage.slice(currentPageNum - 4, currentPageNum + 3);
            }
          }
          $scope.studentsData = $scope.studentsOrgData.slice(startPage, endPage);
        };

        /**
         * 删除课序号
         */
        $scope.deleteKxhYh = function(yh){
          if(yh){
            var obj = {
              token: token,
              kexuhaoid: '',
              users: ''
            };
            if(yh == 'all'){
              obj.users = [];
              Lazy($scope.studentsData).each(function(wk){
                var wkObj = {uid: wk.UID, zhuangtai: -1};
                obj.users.push(wkObj);
              });
            }
            else{
              obj.users = [{uid: yh.UID, zhuangtai: -1}];
            }
            if($scope.selectKxh){
              obj.kexuhaoid = $scope.selectKxh.KEXUHAO_ID;
              if(confirm('确定要删除学生吗？')){
                $http.post(modifyKxhYh, obj).success(function(data){
                  if(data.result){
                    $scope.studentsOrgData = Lazy($scope.studentsOrgData).reject(function(wk){
                      return wk.UID == yh.UID;
                    }).toArray();
                    $scope.studentsData = Lazy($scope.studentsData).reject(function(wk){
                      return wk.UID == yh.UID;
                    }).toArray();
                    $scope.chaXunKxhYongHu($scope.selectKxh);
                    DataService.alertInfFun('suc', '删除成功！');
                    $scope.showKeXuHaoManage = false;
                  }
                  else{
                    DataService.alertInfFun('err', data.error);
                  }
                });
              }
            }
            else{
              DataService.alertInfFun('pmt', '请选择要删除学生的专业！');
            }
          }
          else{
            DataService.alertInfFun('pmt', '请选择要删除的人员！');
          }
        };

    }]);
});
