define(['jquery', 'underscore', 'angular', 'datepicker', 'config'], // 000 开始
  function ($, _, angular, datepicker, config) { // 001 开始
  'use strict';

  angular.module('kaoshiApp.controllers.KaowuCtrl', []) //controller 开始
    .controller('KaowuCtrl', ['$rootScope', '$scope', '$location', '$http', 'urlRedirect', '$q',
      function ($rootScope, $scope, $location, $http, $q) { // 002 开始
        /**
         * 操作title
         */
        $rootScope.pageName = "考务"; //page title
        $rootScope.styles = ['styles/kaowu.css'];

        /**
         * 定义变量 //
         */
        var userInfo = $rootScope.session.userInfo,
          baseKwAPIUrl = config.apiurl_kw, //考务的api
          baseMtAPIUrl = config.apiurl_mt, //mingti的api
          token = config.token,
          caozuoyuan = userInfo.UID,//登录的用户的UID   chaxun_kaoshi_liebiao
          jigouid = userInfo.JIGOU[0].JIGOU_ID,
          lingyuid = userInfo.LINGYU[0].LINGYU_ID,
          qryKaoChangListUrl = baseKwAPIUrl + 'chaxun_kaodiankaochang_liebiao?token=' + token + '&caozuoyuan='
            + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考场列表的url
          qryKaoChangDetailBaseUrl = baseKwAPIUrl + 'chaxun_kaodiankaochang?token=' + token + '&caozuoyuan='
            + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考场详细的url
          qryKaoShiListUrl = baseKwAPIUrl + 'chaxun_kaoshi_liebiao?token=' + token + '&caozuoyuan='
            + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考试列表的url
          qryKaoShiDetailBaseUrl = baseKwAPIUrl + 'chaxun_kaoshi?token=' + token + '&caozuoyuan='
            + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考试详细的url
          kaoshiNumsPerPage = 10, //每页显示多少条考试
          kaoChangNumsPerPage = 10, //每页显示多少条考场信息
          qryCxsjlbUrl = baseMtAPIUrl + 'chaxun_shijuanliebiao?token=' + token + '&caozuoyuan=' + caozuoyuan +
            '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询试卷列表url
          kaoshi_data, //考试的数据格式
          kaochang_data, //考场的数据格式
          xiuGaiKaoShiUrl = baseKwAPIUrl + 'xiugai_kaoshi', //修改考试的url
          tongBuShiJuanUrl = baseKwAPIUrl + 'tongbu_shijuan', // 同步试卷信息的url
          isEditKaoShi = false, //是否为编辑考试
          isDeleteKaoShi = false, //是否为删除考试
          isEditKaoChang = false, //是否为编辑考场
          isDeleteKaoChang = false, //是否为删除考场
          xiuGaiKaoChangUrl = baseKwAPIUrl + 'xiugai_kaodiankaochang'; //修改考场的url


        /**
         * 格式化时间
         */
        var formatDate = function(dateStr){
          var mydateNew = new Date(dateStr),
//            difMinutes = mydateOld.getTimezoneOffset(), //与本地相差的分钟数
//            difMilliseconds = mydateOld.valueOf() + difMinutes * 60 * 1000, //与本地相差的毫秒数
//            mydateNew = new Date(difMilliseconds),
            year = mydateNew.getUTCFullYear(), //根据世界时从 Date 对象返回四位数的年份
            month = mydateNew.getUTCMonth() + 1, //根据世界时从 Date 对象返回月份 (0 ~ 11)
            day = mydateNew.getUTCDate(), //根据世界时从 Date 对象返回月中的一天 (1 ~ 31)
            hour = mydateNew.getUTCHours(), //根据世界时返回 Date 对象的小时 (0 ~ 23)
            minute = mydateNew.getUTCMinutes(), //根据世界时返回 Date 对象的分钟 (0 ~ 59)
            joinDate; //返回最终时间
          if(month < 10){
            month = '0' + month;
          }
          if(day < 10){
            day = '0' + day;
          }
          if(hour < 10){
            hour = '0' + hour;
          }
          if(minute < 10){
            minute = '0' + minute;
          }
          joinDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
          return joinDate;
        };

        /**
         * 显示考试列表
         */
        $scope.showKaoShiList = function(){
          //先查询所有考试的Id
          $http.get(qryKaoShiListUrl).success(function(kslst){
            if(kslst.length){
              var kaoshiSubIds = kslst.slice(0, kaoshiNumsPerPage), //截取数组
                kaoshiSelectIdsArr = _.map(kaoshiSubIds, function(ksid){ return ksid.KAOSHI_ID; }), //提取KAOSHI_ID
                qrySelectKaoShisUrl = qryKaoShiDetailBaseUrl + '&kaoshiid=' + kaoshiSelectIdsArr.toString();
              $http.get(qrySelectKaoShisUrl).success(function(ksdtl){
                if(ksdtl.length){
                  $scope.kaoshiList = ksdtl;
                  $scope.txTpl = 'views/partials/kaoshiList.html'
                  isEditKaoShi = false;//是否为编辑考试
                  isDeleteKaoShi = false;//是否为删除考试
                }
              });
            }
          });
        };

        /**
         * 考务页面加载时，加载考试列表
         */
        $scope.showKaoShiList();

        /**
         * 新增一个考试 //
         */
        $scope.addNewKaoShi = function(ks){
          kaoshi_data = { //考试的数据格式
            token: token,
            caozuoyuan: caozuoyuan,
            jigouid: jigouid,
            lingyuid: lingyuid,
            shuju:{
              KAOSHI_ID: '',
              KAOSHI_MINGCHENG: '',
              KAISHISHIJIAN: '',
              JIESHUSHIJIAN: '',
              SHICHANG: '',
              XINGZHI: 1,
              LEIXING: 1,
              XUZHI: '',
              SHIJUAN_ID: '',
              shijuan_name: '',
              ZHUANGTAI: 0
            }
          };
          if(isEditKaoShi){
            kaoshi_data.shuju.KAOSHI_ID = ks.KAOSHI_ID;
            kaoshi_data.shuju.KAOSHI_MINGCHENG = ks.KAOSHI_MINGCHENG;
            kaoshi_data.shuju.KAISHISHIJIAN = formatDate(ks.KAISHISHIJIAN);
            kaoshi_data.shuju.JIESHUSHIJIAN = ks.JIESHUSHIJIAN;
            kaoshi_data.shuju.SHICHANG = ks.SHICHANG;
            kaoshi_data.shuju.XINGZHI = ks.XINGZHI;
            kaoshi_data.shuju.LEIXING = ks.LEIXING;
            kaoshi_data.shuju.XUZHI = ks.XUZHI;
            kaoshi_data.shuju.SHIJUAN_ID = ks.SHIJUAN[0].SHIJUAN_ID;
            kaoshi_data.shuju.shijuan_name = ks.SHIJUAN[0].SHIJUAN_MINGCHENG;
            kaoshi_data.shuju.ZHUANGTAI = ks.ZHUANGTAI;

            $scope.kaoshiData = kaoshi_data;
            $scope.txTpl = 'views/partials/editKaoShi.html';
          }
          else if(isDeleteKaoShi){
            kaoshi_data.shuju.KAOSHI_ID = ks.KAOSHI_ID;
            kaoshi_data.shuju.KAOSHI_MINGCHENG = ks.KAOSHI_MINGCHENG;
            kaoshi_data.shuju.KAISHISHIJIAN = ks.KAISHISHIJIAN;
            kaoshi_data.shuju.JIESHUSHIJIAN = ks.JIESHUSHIJIAN;
            kaoshi_data.shuju.SHICHANG = ks.SHICHANG;
            kaoshi_data.shuju.XINGZHI = ks.XINGZHI;
            kaoshi_data.shuju.LEIXING = ks.LEIXING;
            kaoshi_data.shuju.XUZHI = ks.XUZHI;
            kaoshi_data.shuju.SHIJUAN_ID = ks.SHIJUAN[0].SHIJUAN_ID;
            kaoshi_data.shuju.shijuan_name = ks.SHIJUAN[0].SHIJUAN_MINGCHENG;
            kaoshi_data.shuju.ZHUANGTAI = -1;
          }
          else{
            $scope.kaoshiData = kaoshi_data;
            $scope.txTpl = 'views/partials/editKaoShi.html';
          }
        };

        /**
         * 显示试卷列表 //
         */
        $scope.showPaperList = function(){
          $http.get(qryCxsjlbUrl).success(function(data){
            if(data.length){
              $scope.paperListData = data;
              $scope.showAddKaoShiBackBtn = true;
              $scope.txTpl = 'views/partials/paperList.html'; //加载试卷列表模板
            }
          }).error(function(err){
            alert(err);
          });
        };

        /**
         * 返回到试卷添加页面
         */
        $scope.backToAddKaoShi = function(){
          $scope.txTpl = 'views/partials/editKaoShi.html';
        };

        /**
         * 将试卷添加到考试，目前只能添加到一个试卷
         */
        $scope.addToKaoShi = function(paperId){
          kaoshi_data.shuju.SHIJUAN_ID = paperId.SHIJUAN_ID; //试卷id
          kaoshi_data.shuju.shijuan_name = paperId.SHIJUANMINGCHENG; //试卷名称
          $scope.backToAddKaoShi(); //返回添加试卷页面
        };

        /**
         * 保存考试 //
         */
        $scope.saveKaoShi = function(){
          if($('.start-date').val()){
            $scope.startDateIsNull = false;
            var inputStartDate = $('.start-date').val(),
              startDate = new Date(inputStartDate), //开始时间
              endDate = new Date(startDate.valueOf() + kaoshi_data.shuju.SHICHANG * 60 * 1000), //结束时间
              shijuan_info = { //需要同步的试卷数据格式
                token: token,
                caozuoyuan: caozuoyuan,
                jigouid: jigouid,
                lingyuid: lingyuid,
                shijuanid: ''
              };
            kaoshi_data.shuju.KAISHISHIJIAN = inputStartDate;
            kaoshi_data.shuju.JIESHUSHIJIAN = endDate.toUTCString();
            shijuan_info.shijuanid = kaoshi_data.shuju.SHIJUAN_ID;
            $http.post(tongBuShiJuanUrl, shijuan_info).success(function(rst){
              if(rst.result){
                $http.post(xiuGaiKaoShiUrl, kaoshi_data).success(function(data){
                  if(data.result){
                    $scope.showKaoShiList();
                    alert('考试添加成功！');
                  }
                }).error(function(err){
                  alert(err);
                });
              }
            }).error(function(err){
              alert(err);
            });
          }
          else{
            $scope.startDateIsNull = true;
          }
        };

        /**
         * 修改考试 //
         */
        $scope.editKaoShi = function(ks){
          isEditKaoShi = true;
          isDeleteKaoShi = false;
          $scope.addNewKaoShi(ks);
        };

        /**
         * 删除考试
         */
        $scope.deleteKaoShi = function(ks){
          isEditKaoShi = false;
          isDeleteKaoShi = true;
          $scope.addNewKaoShi(ks);
          var confirmInfo = confirm("确定要删除考试吗？");
          if(confirmInfo){
            $http.post(xiuGaiKaoShiUrl, kaoshi_data).success(function(data){
              if(data.result){
                $scope.showKaoShiList();
                alert('考试删除成功！');
              }
            }).error(function(err){
              alert(err);
            });
          }
        };

        /**
         * 显示考场列表
         */
        $scope.showKaoChangList = function(){
          //先查询所有考试的Id
          $http.get(qryKaoChangListUrl).success(function(kclst){
            if(kclst.length){
              var kaoChangSubIds = kclst.slice(0, kaoChangNumsPerPage), //截取数组
                kaoChangSelectIdsArr = _.map(kaoChangSubIds, function(kcid){ return kcid.KID; }), //提取KID
                qrySelectKaoChangsUrl = qryKaoChangDetailBaseUrl + '&kid=' + kaoChangSelectIdsArr;
              $http.get(qrySelectKaoChangsUrl).success(function(kcdtl){
                if(kcdtl.length){
                  $scope.kaoChangList = kcdtl;
                  $scope.txTpl = 'views/partials/kaoChangList.html';
                  isEditKaoChang = false; //是否为编辑考场
                  isDeleteKaoChang = false; //是否为删除考场
                }
              });
            }
          });
        };

        /**
         * 新增考场
         */
        $scope.addNewKaoChang = function(kc){
          kaochang_data = { //考场的数据格式
            token: token,
            caozuoyuan: caozuoyuan,
            jigouid: jigouid,
            lingyuid: lingyuid,
            shuju:{
              KID: '',
              KMINGCHENG: '',
              KAOWEISHULIANG: '',
              XIANGXIDIZHI: '',
              JIAOTONGFANGSHI: '',
              LIANXIREN: '',
              LIANXIFANGSHI: '',
              KLEIXING: 0,
              PARENT_ID: '',
              KAODIANXINGZHI: 0,
              ZHUANGTAI: 1
            }
          };
          if(isEditKaoChang){
            kaochang_data.shuju.KID = kc.KID;
            kaochang_data.shuju.KMINGCHENG = kc.KMINGCHENG;
            kaochang_data.shuju.KAOWEISHULIANG = kc.KAOWEISHULIANG;
            kaochang_data.shuju.XIANGXIDIZHI = kc.XIANGXIDIZHI;
            kaochang_data.shuju.JIAOTONGFANGSHI = kc.JIAOTONGFANGSHI;
            kaochang_data.shuju.LIANXIREN = kc.LIANXIREN;
            kaochang_data.shuju.LIANXIFANGSHI = kc.LIANXIFANGSHI;
            kaochang_data.shuju.KLEIXING = kc.KLEIXING;
            kaochang_data.shuju.PARENT_ID = kc.PARENT_ID;
            kaochang_data.shuju.KAODIANXINGZHI = kc.KAODIANXINGZHI;
            kaochang_data.shuju.ZHUANGTAI = kc.ZHUANGTAI;

            $scope.kaochangData = kaochang_data;
            $scope.txTpl = 'views/partials/editKaoChang.html';
          }
          else if(isDeleteKaoChang){
            kaochang_data.shuju = kc;
            kaochang_data.shuju.ZHUANGTAI = -1;
          }
          else{
            $scope.kaochangData = kaochang_data;
            $scope.txTpl = 'views/partials/editKaoChang.html';
          }
        };

        /**
         * 删除考场
         */
        $scope.deleteKaoChang = function(kc){
          isEditKaoChang = false; //是否为编辑考场
          isDeleteKaoChang = true; //是否为删除考场
          $scope.addNewKaoChang(kc);
          var confirmInfo = confirm("确定要删除考场吗？");
          if(confirmInfo){
            $http.post(xiuGaiKaoChangUrl, kaochang_data).success(function(data){
              if(data.result){
                $scope.showKaoChangList();
                alert('考场删除成功！');
              }
            }).error(function(err){
              alert(err);
            });
          }
        };

        /**
         * 修改考场
         */
        $scope.editKaoChang = function(kc){
          isEditKaoChang = true; //是否为编辑考场
          isDeleteKaoChang = false; //是否为删除考场
          $scope.addNewKaoChang(kc);
        };

        /**
         * 保存考场
         */
        $scope.saveKaoChang = function(){
          $http.post(xiuGaiKaoChangUrl, kaochang_data).success(function(data){
            if(data.result){
              alert('考场保存成功！');
              $scope.showKaoChangList();
            }
          }).error(function(err){
            alert(err);
          });
        };




      } // 002 结束
    ]); //controller 结束
  } // 001 结束
); // 000 结束
