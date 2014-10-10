define(['jquery', 'underscore', 'angular', 'config'], // 000 开始
  function ($, _, angular, config) { // 001 开始
    'use strict';

    angular.module('kaoshiApp.controllers.KaowuCtrl', []) //controller 开始
      .controller('KaowuCtrl', ['$rootScope', '$scope', '$location', '$http', '$q', '$timeout', 'Myfileupload',
        'messageService',
        function ($rootScope, $scope, $location, $http, $q, $timeout, Myfileupload, messageService) { // 002 开始
          /**
           * 操作title
           */
          $rootScope.pageName = "考务"; //page title
          $rootScope.styles = ['styles/kaowu.css'];
          $rootScope.isRenZheng = false; //判读页面是不是认证

          /**
           * 定义变量
           */
          var userInfo = $rootScope.session.userInfo,
            baseKwAPIUrl = config.apiurl_kw, //考务的api
            baseMtAPIUrl = config.apiurl_mt, //mingti的api
            baseRzAPIUrl = config.apiurl_rz, //renzheng的api
            token = config.token,
            caozuoyuan = userInfo.UID,//登录的用户的UID   chaxun_kaoshi_liebiao
            jigouid = userInfo.JIGOU[0].JIGOU_ID,
            lingyuid = $rootScope.session.defaultLyId,
            qryKaoChangListUrl = baseKwAPIUrl + 'chaxun_kaodiankaochang_liebiao?token=' + token + '&caozuoyuan='
              + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考场列表的url
            qryKaoChangDetailBaseUrl = baseKwAPIUrl + 'chaxun_kaodiankaochang?token=' + token + '&caozuoyuan='
              + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考场详细的url
            qryKaoShiListUrl = baseKwAPIUrl + 'chaxun_kaoshi_liebiao?token=' + token + '&caozuoyuan='
              + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考试列表的url
            qryKaoShiDetailBaseUrl = baseKwAPIUrl + 'chaxun_kaoshi?token=' + token + '&caozuoyuan='
              + caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询考试详细的url
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
            xiuGaiKaoChangUrl = baseKwAPIUrl + 'xiugai_kaodiankaochang', //修改考场的url
            paperPageArr = [], //定义试卷页码数组
            sjlbIdArrRev = [], //存放所有试卷ID的数组
            totalPaperPage,//符合条件的试卷一共有多少页
            itemNumPerPage = 10, //每页显示多少条数据
            paginationLength = 11, //分页部分，页码的长度，目前设定为11
            qryShiJuanGaiYaoBase = baseMtAPIUrl + 'chaxun_shijuangaiyao?token=' + token + '&caozuoyuan=' + caozuoyuan +
              '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&shijuanid=', //查询试卷概要的基础URL
            getUserNameBase = baseRzAPIUrl + 'get_user_name?token=' + token + '&uid=', //得到用户名的URL
            faBuKaoShiBaseUrl = baseKwAPIUrl + 'fabu_kaoshi?token=' + token + '&caozuoyuan=' + caozuoyuan +
              '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&kaoshi_id=', //发布考试的url
            qryPaperDetailBase = baseMtAPIUrl + 'chaxun_shijuanxiangqing?token=' + token + '&caozuoyuan=' + caozuoyuan +
              '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&shijuanid=', //查询试卷详情的url
            saveDaTiKaUrl = baseMtAPIUrl + 'set_datika', //保存答题卡的url
            downloadDaTiKaUrl = baseMtAPIUrl + 'make_datika?token=' + token + '&caozuoyuan=' + caozuoyuan +
              '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&shijuanid=', //下载答题卡的url
            kaoShiPageArr = [], //定义考试页码数组
            kaoShiIdArrRev = [], //存放所有考试ID的数组
            totalKaoShiPage, //符合条件的考试一共有多少页
            kaoChangPageArr = [], //定义考场页码数组
            kaoChangIdArrRev = [], //存放所有考场ID的数组
            totalKaoChangPage, //符合条件的考场一共有多少页
            xiaFaKaoShiBase = baseKwAPIUrl + 'xiafa_kaoshi?token=' + token + '&caozuoyuan=' + caozuoyuan +
              '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&kaoshiid=', //下发考试
            uploadKsUrl = baseMtAPIUrl + 'excel_to_json'; //上传考生信息

          $scope.tiXingNameArr = config.tiXingNameArr; //题型名称数组
          $scope.letterArr = config.letterArr; //题支的序号
          $scope.cnNumArr = config.cnNumArr; //汉语的大学数字
          $rootScope.dashboard_shown = true;
          $scope.kwParams = { //考务用到的变量
            ksListZt: '' //考试列表的状态
          };

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
          var formatDateZh = function(dateStr){ //转换为中午
            var mydateNew = new Date(dateStr),
              year = mydateNew.getFullYear(), //根据世界时从 Date 对象返回四位数的年份
              month = mydateNew.getMonth() + 1, //根据世界时从 Date 对象返回月份 (0 ~ 11)
              day = mydateNew.getDate(), //根据世界时从 Date 对象返回月中的一天 (1 ~ 31)
              hour = mydateNew.getHours(), //根据世界时返回 Date 对象的小时 (0 ~ 23)
              minute = mydateNew.getMinutes(), //根据世界时返回 Date 对象的分钟 (0 ~ 59)
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
           * 考试的分页数据查询函数
           */
          $scope.getThisKaoShiPageData = function(pg){
            var pgNum = pg - 1,
              kaoshi_id,
              currentPage = pgNum ? pgNum : 0,
              qrySelectKaoShisUrl;
            $scope.kaoShiPages = [];
            //得到分页数组的代码
            var currentKsPageVal = $scope.currentKsPageVal = pg ? pg : 1;
            if(totalKaoShiPage <= paginationLength){
              $scope.kaoShiPages = kaoShiPageArr;
            }
            if(totalKaoShiPage > paginationLength){
              if(currentKsPageVal > 0 && currentKsPageVal <= 6 ){
                $scope.kaoShiPages = kaoShiPageArr.slice(0, paginationLength);
              }
              else if(currentKsPageVal > totalKaoShiPage - 5 && currentKsPageVal <= totalKaoShiPage){
                $scope.kaoShiPages = kaoShiPageArr.slice(totalKaoShiPage - paginationLength);
              }
              else{
                $scope.kaoShiPages = kaoShiPageArr.slice(currentKsPageVal - 5, currentKsPageVal + 5);
              }
            }
            //查询数据的代码
            kaoshi_id = kaoShiIdArrRev.slice(currentPage * itemNumPerPage, (currentPage + 1) * itemNumPerPage).toString();
            qrySelectKaoShisUrl = qryKaoShiDetailBaseUrl + '&kaoshiid=' + kaoshi_id;
            $http.get(qrySelectKaoShisUrl).success(function(ksdtl){
              if(ksdtl.length){
                $scope.loadingImgShow = false; //kaoShiList.html
                $scope.kaoshiList = ksdtl;
              }
              else{
                messageService.alertInfFun('pmt', '没有相关的考试！');
                $scope.loadingImgShow = false; //kaoShiList.html
              }
            });
          };

          /**
           * 显示考试列表,可分页的方法, zt表示状态 1，2，3，4为完成；5，6已完成
           */
          $scope.showKaoShiList = function(zt){
            var ztArr = [],
              qryKaoShiList;
            zt = zt || 'ing';
            $scope.loadingImgShow = true; //kaoShiList.html
            kaoShiPageArr = []; //定义考试页码数组
            kaoShiIdArrRev = []; //存放所有考试ID的数组
            //先查询所有考试的Id
            switch (zt) {
              case 'all':
                ztArr = [];
                break;
              case 'ing':
                ztArr = [0, 1, 2, 3, 4];
                break;
              case 'done':
                ztArr = [5, 6];
                break;
            }
            $scope.kwParams.ksListZt = zt;
            qryKaoShiList = qryKaoShiListUrl + '&zhuangtai=' + ztArr;
            $http.get(qryKaoShiList).success(function(kslst){
              if(kslst.length){
                $scope.kaoShiListIds = kslst; //得到所有的考试ids
                totalKaoShiPage = Math.ceil(kslst.length/itemNumPerPage); //得到所有考试的页码
                for(var i = 1; i <= totalKaoShiPage; i++){
                  kaoShiPageArr.push(i);
                }
                kaoShiIdArrRev = _.map(kslst, function(ksid){ return ksid.KAOSHI_ID; });
                $scope.lastKaoShiPageNum = totalKaoShiPage; //最后一页的数值
                //查询数据开始
                $scope.getThisKaoShiPageData();
                $scope.txTpl = 'views/partials/kaoShiList.html';
                $scope.isAddNewKaoSheng = false; //显示添加单个考生页面
                isEditKaoShi = false;//是否为编辑考试
                isDeleteKaoShi = false;//是否为删除考试
              }
              else{
                $scope.kaoshiList = '';
                kaoShiPageArr = [];
                $scope.kaoShiPages = [];
                $scope.kaoShiListIds = [];
                $scope.kwParams.ksListZt = '';
                $scope.txTpl = 'views/partials/kaoShiList.html';
                $scope.isAddNewKaoSheng = false; //显示添加单个考生页面
                isEditKaoShi = false;//是否为编辑考试
                isDeleteKaoShi = false;//是否为删除考试
                messageService.alertInfFun('pmt', '没有相关的考试！');
                $scope.loadingImgShow = false; //kaoShiList.html
              }
            });
          };

          /**
           * 考务页面加载时，加载考试列表
           */
          $scope.showKaoShiList();

          /**
           * 重新加载 mathjax
           */
          $scope.$on('onRepeatLast', function(scope, element, attrs){
            $('.reloadMath').click();
          });

          /**
           * 显示试卷详情
           */
          $scope.showShiJuanInfo = function(sjId){
            var newCont,
              tgReg = new RegExp('<\%{.*?}\%>', 'g');
            var qryPaperDetail = qryPaperDetailBase + sjId;
            $http.get(qryPaperDetail).success(function(data){
              if(data){
                //给模板大题添加存放题目的数组
                _.each(data.MUBANDATI, function(mbdt, idx, lst){
                  mbdt.TIMUARR = [];
                  mbdt.datiScore = 0;
                });
                //将各个题目添加到对应的模板大题中
                _.each(data.TIMU, function(tm, idx, lst){
                  //修改填空题的题干
                  newCont = tm.DETAIL.TIGAN.tiGan.replace(tgReg, function(arg) {
                    var text = arg.slice(2, -2), //提起内容
                      textJson = JSON.parse(text),
                      _len = textJson.size,
                      i, xhStr = '';
                    for(i = 0; i < _len; i ++ ){
                      xhStr += '_';
                    }
                    return xhStr;
                  });
                  tm.DETAIL.TIGAN.tiGan = newCont;
                  _.each(data.MUBANDATI, function(mbdt, subIdx, subLst){
                    if(mbdt.MUBANDATI_ID == tm.MUBANDATI_ID){
                      mbdt.TIMUARR.push(tm);
                      mbdt.datiScore += parseFloat(tm.FENZHI);
                    }
                  });
                });
                //赋值
                $scope.paperDetail = data;
                $scope.showPaperDetail = true;
              }
              else{
                messageService.alertInfFun('err', '查询试卷失败！错误信息为：' + data.error);
              }
            });
          };

          /**
           * 关闭试卷详情
           */
          $scope.closePaperDetail = function(){
            $scope.showPaperDetail = false;
          };

          /**
           * 查询本机构下的所有考场
           */
          var qryAllKaoChang = function(){
            $scope.loadingImgShow = true; //kaoChangList.html
            $http.get(qryKaoChangDetailBaseUrl).success(function(data){
              if(data.length){
                $scope.allKaoChangList = data;
                $scope.loadingImgShow = false; //kaoChangList.html
              }
              else{
                $scope.loadingImgShow = false; //kaoChangList.html
                messageService.alertInfFun('pmt', '没有相关的考场数据!');
              }
            });
          };

          /**
           * 新增一个考试
           */
          $scope.addNewKaoShi = function(ks){
            $scope.isAddNewKaoSheng = false; //显示添加单个考生页面
            $scope.showPaperDetail = false; //控制试卷详情的显示和隐藏
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
                LEIXING: 0,
                XUZHI: '',
                SHIJUAN_ID: '',
                shijuan_name: '',
                ZHUANGTAI: 0,
                KAOCHANG:[]
              }
            };
            if(isEditKaoShi){
              qryAllKaoChang();
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
              kaoshi_data.shuju.KAOCHANG = ks.KAODIANKAOCHANG;
              kaoshi_data.shuju.ZHUANGTAI = ks.ZHUANGTAI;
//            //将考生转化为自己所需要的样式
//            _.each(ks.KAOSHENG, function(stu){
//              var usr = {};
//              usr.XINGMING = stu.XINGMING;
//              usr.XUEHAO = stu.YONGHUHAO;
//              kaoshi_data.shuju.USERS.push(usr);
//            });

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
              kaoshi_data.shuju.ZHUANGTAI = -1;
            }
            else{
              qryAllKaoChang();
              $scope.kaoshiData = kaoshi_data;
              $scope.txTpl = 'views/partials/editKaoShi.html';
            }
          };

          /**
           * 查询试卷概要的分页代码
           */
          $scope.getThisSjgyPageData = function(pg){
            var qryShiJuanGaiYao,
              pgNum = pg - 1,
              timu_id,
              currentPage = pgNum ? pgNum : 0,
              userIdArr = [];//存放user id的数组
            //得到分页数组的代码
            var currentPageVal = $scope.currentPageVal = pg ? pg : 1;
            if(totalPaperPage <= paginationLength){
              $scope.paperPages = paperPageArr;
            }
            if(totalPaperPage > paginationLength){
              if(currentPageVal > 0 && currentPageVal <= 6 ){
                $scope.paperPages = sjlbIdArrRev.slice(0, paginationLength);
              }
              else if(currentPageVal > totalPaperPage - 5 && currentPageVal <= totalPaperPage){
                $scope.paperPages = sjlbIdArrRev.slice(totalPaperPage - paginationLength);
              }
              else{
                $scope.paperPages = sjlbIdArrRev.slice(currentPageVal - 5, currentPageVal + 5);
              }
            }
            //查询数据的代码
            timu_id = sjlbIdArrRev.slice(currentPage * itemNumPerPage, (currentPage + 1) * itemNumPerPage).toString();
            qryShiJuanGaiYao = qryShiJuanGaiYaoBase + timu_id; //查询详情url
            $http.get(qryShiJuanGaiYao).success(function(sjlbgy){
              if(sjlbgy.length){
                _.each(sjlbgy, function(sj, idx, lst){
                  sj.NANDU = JSON.parse(sj.NANDU);
                  userIdArr.push(sj.CHUANGJIANREN_UID);
                });
                var userIdStr = _.chain(userIdArr).sortBy().uniq().value().toString();
                var getUserNameUrl = getUserNameBase + userIdStr;
                $http.get(getUserNameUrl).success(function(users){
                  if(users.length){
                    _.each(sjlbgy, function(sj, idx, lst){
                      _.each(users, function(usr, subidx, sublst){
                        if(usr.UID == sj.CHUANGJIANREN_UID){
                          sj.chuangjianren = usr.XINGMING;
                        }
                      });
                    });
                    $scope.paperListData = sjlbgy;
                    $scope.isShowPaperList = true;
                    $scope.showPopupBox = true; //试卷列表弹出层显示
                  }
                  else{
                    messageService.alertInfFun('err', '查询创建人名称失败！');
                  }
                });
              }
              else{
                messageService.alertInfFun('err', '没有相关数据！');
              }
            });
          };

          /**
           * 显示试卷列表
           */
          $scope.showPaperList = function(){
            paperPageArr = [];
            sjlbIdArrRev = []; //反转试卷列表id
            $http.get(qryCxsjlbUrl).success(function(sjlb){
              if(sjlb.length){
                $scope.papertListIds = sjlb;
                var sjlbIdArr; //试卷id列表数组
                totalPaperPage = Math.ceil(sjlb.length/itemNumPerPage); //试卷一共有多少页
                for(var i = 1; i <= totalPaperPage; i++){
                  paperPageArr.push(i);
                }
                $scope.lastPaperPageNum = totalPaperPage; //最后一页的数值
                sjlbIdArr = _.map(sjlb, function(sj){
                  return sj.SHIJUAN_ID;
                });
                sjlbIdArrRev = sjlbIdArr.reverse(); //将数组反转，按照时间倒叙排列
                //查询数据开始
                $scope.getThisSjgyPageData();
              }
              else{
                messageService.alertInfFun('err', sjlb.error);
              }
            });
          };

          /**
           * 关闭试卷列表
           */
          $scope.closePaperList = function(){
            $scope.showPopupBox = false;
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
            var qryPaperDetail = qryPaperDetailBase + paperId.SHIJUAN_ID;
            $http.get(qryPaperDetail).success(function(data){
              if(!data.error){
                //给模板大题添加存放题目的数组
                _.each(data.MUBANDATI, function(mbdt, idx, lst){
                  mbdt.TIMUARR = [];
                  mbdt.datiScore = 0;
                });
                //将各个题目添加到对应的模板大题中
                _.each(data.TIMU, function(tm, idx, lst){
                  _.each(data.MUBANDATI, function(mbdt, subIdx, subLst){
                    if(mbdt.MUBANDATI_ID == tm.MUBANDATI_ID){
                      mbdt.TIMUARR.push(tm);
                      mbdt.datiScore += parseFloat(tm.FENZHI);
                    }
                  });
                });
                //将答题卡内容有字符串转换为数字
                data.SHIJUAN.DATIKA = JSON.parse(data.SHIJUAN.DATIKA);
                //赋值
                $scope.paperDetail = data;
                console.log($scope.paperDetail);
                kaoshi_data.shuju.SHIJUAN_ID = paperId.SHIJUAN_ID; //试卷id
                kaoshi_data.shuju.shijuan_name = paperId.SHIJUANMINGCHENG; //试卷名称
                $scope.showPopupBox = false;
              }
              else{
                messageService.alertInfFun('err', '查询试卷失败！错误信息为：' + data.error);
              }
            });
          };

          /**
           *设置答题卡
           */
          var allTiMuForCard; //存放所有需要放到答题卡中的试题
          $scope.kwSetDaTiKa = function(bl){
            var idxCount = 0;
            allTiMuForCard = [];
            //将所有需要答题卡的试题全部添加到allTiMuForCard中
            _.each($scope.paperDetail.MUBANDATI, function(mbdt, idx, lst){
              if(mbdt.MUBANDATI_ID > 8){
                _.each(mbdt.TIMUARR, function(tma, subIdx, lst){
                  var textCont = mbdt.DATIMINGCHENG + '第' + (subIdx + 1) + '题',
                    tiMuInfo = {
                      timu_id: '',
                      percent: 0.9,
                      text: textCont,
                      idxNum: idxCount
                    };
                  tiMuInfo.timu_id = tma.TIMU_ID;
                  allTiMuForCard.push(tiMuInfo);
                  idxCount ++;
                });
              }
            });
            $scope.setTiMuNum(1, bl);
          };

          /**
           * 设置每页答题卡的题目数量//
           */
          $scope.setTiMuNum = function(tmNum, bl){
            $('.set-tiMu-num a').removeClass('tiMuNumAon').eq(tmNum - 1).addClass('tiMuNumAon');
            var answerCards = [], //存放答题卡的数组
              tmn = tmNum || 1, //每页题目的数量
              tiMuPercent = Math.floor(90/tmNum)/100, //每题在答题卡中的百分数
              percentYuShu = 90 % tmNum, //余数百分比
              lastTiMuPercent = tiMuPercent + percentYuShu/100, //最后一题的百分比
              allTiMuLength = allTiMuForCard.length, //所有题目的长度
              yushu = allTiMuForCard.length % tmn, //余数
              intAnswerCardLen = Math.floor(allTiMuLength/tmn), //allTiMuForCard除以参数得到的整数
              answerCardLen = yushu > 0 ? intAnswerCardLen + 1 : intAnswerCardLen; //答题卡长度, 用allTiMuForCard除以参数得到的数据

            //为每道题的percent赋值
            _.each(allTiMuForCard, function(tm, idx, lst){
              //余数百分比弄够除尽
              if(percentYuShu == 0){
                //每页答题卡题目数量相同
                if(yushu == 0){
                  tm.percent = tiMuPercent;
                }
                //最后一页的题目数量少于其他答题卡
                else{
                  var surplus = 90 % yushu; //余数百分比
                  //如果百分比除以最后一页题目的数量能够被整除
                  if(surplus == 0){
                    if(idx < allTiMuLength - yushu){
                      tm.percent = tiMuPercent;
                    }
                    else{
                      tm.percent = (90/yushu)/100;
                    }
                  }
                  //如果百分比除以最后一页题目的数量不能够被整除
                  else{
                    var spTiMuPercent = Math.floor(90/yushu)/100, //每题在答题卡中的百分数
                      spLastTiMuPercent = spTiMuPercent + surplus/100; //最后一题的百分比
                    if(idx < allTiMuLength - yushu){
                      tm.percent = tiMuPercent;
                    }
                    else{
                      if(idx < allTiMuLength){
                        tm.percent = spTiMuPercent;
                      }
                      else{
                        tm.percent = spLastTiMuPercent;
                      }
                    }
                  }
                }
              }
              //余数百分比弄不够除尽
              else{
                //每页答题卡题目数量相同
                if(yushu == 0){
                  if((idx + 1) % tmNum == 0){
                    tm.percent = lastTiMuPercent;
                  }
                  else{
                    tm.percent = tiMuPercent;
                  }
                }
                //最后一页的题目数量少于其他答题卡
                else{
                  var rmSurplus = 90 % yushu; //余数百分比
                  //如果百分比除以最后一页题目的数量能够被整除
                  if(rmSurplus == 0){
                    if(idx < allTiMuLength - yushu){
                      if((idx + 1) % tmNum == 0){
                        tm.percent = lastTiMuPercent;
                      }
                      else{
                        tm.percent = tiMuPercent;
                      }
                    }
                    else{
                      tm.percent = (90/yushu)/100;
                    }
                  }
                  //如果百分比除以最后一页题目的数量不能够被整除
                  else{
                    var spTiMuPer = Math.floor(90/yushu)/100, //每题在答题卡中的百分数
                      spLastTiMuPer = spTiMuPer + rmSurplus/100; //最后一题的百分比
                    if(idx < allTiMuLength - yushu){
                      tm.percent = tiMuPercent;
                    }
                    else{
                      if(idx < allTiMuLength){
                        tm.percent = spTiMuPer;
                      }
                      else{
                        tm.percent = spLastTiMuPer;
                      }
                    }
                  }
                }
              }
            });
            //为每张答题分配题目
            for(var i = 0; i < answerCardLen; i++){
              var daTiKa = { //答题卡数据格式
                token: token,
                caozuoyuan: caozuoyuan,
                jigouid: jigouid,
                lingyuid: lingyuid,
                shiJuanId: $scope.paperDetail.SHIJUAN.SHIJUAN_ID,
                shuju: {
                  pageNo: i,
                  header: {
                    percent: 0.05,
                    title: $scope.paperDetail.SHIJUAN.SHIJUANMINGCHENG + '答题卡',
                    subTitle: ''
                  },
                  footer: {
                    percent: 0.05,
                    text: '书写过程中不要超出书写范围，否则可能会导致答题无效。'
                  },
                  body:[]
                }
              };
              if(i <= intAnswerCardLen){
                daTiKa.shuju.body = allTiMuForCard.slice(i*tmn, (i+1)*tmn);
              }
              else{
                daTiKa.shuju.body = allTiMuForCard.slice(i*tmn);
              }
              answerCards.push(daTiKa);
            }
            $scope.answerCards = answerCards;
            if(!bl){
              $('.popup-all-height').show();
            }
          };

          /**
           * 关闭答题卡设置页面
           */
          $scope.closeKwDaTiKaSet = function(){
            $('.popup-all-height').hide();
          };

          /**
           * 阻止点击冒泡
           */
          $scope.stopClosePopup = function(event){
            event.preventDefault();
            event.stopPropagation();
          };

          /**
           * 下载答题卡
           */
          $scope.downloadDaTiKa = function(bl){
            $scope.closeKwDaTiKaSet();
            //保存大题卡
            var daTiKaDataRule = {
                token: token,
                caozuoyuan: caozuoyuan,
                jigouid: jigouid,
                lingyuid: lingyuid,
                shuju:{
                  shiJuanId: '',
                  pages: []
                }
              },
              downloadDaTiKa = downloadDaTiKaUrl + $scope.paperDetail.SHIJUAN.SHIJUAN_ID;

            if($scope.answerCards){
              daTiKaDataRule.shuju.shiJuanId = $scope.paperDetail.SHIJUAN.SHIJUAN_ID;
            }
            else{
              $scope.kwSetDaTiKa(bl);
              daTiKaDataRule.shuju.shiJuanId = $scope.paperDetail.SHIJUAN.SHIJUAN_ID;
            }
            _.each($scope.answerCards, function(dtk, idx, lst){
              daTiKaDataRule.shuju.pages.push(dtk.shuju);
            });
            $http.post(saveDaTiKaUrl, daTiKaDataRule).success(function(dtkdata){
              if(dtkdata.result){
                var aLink = document.createElement('a');
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
                aLink.href = downloadDaTiKa;
                aLink.dispatchEvent(evt);
                $('.downloadDaTiKaBtn').prop('disabled', true);
                var cancelDisabled = function(){
                  $('.downloadDaTiKaBtn').prop('disabled', false);
                };
                $timeout(cancelDisabled, 25000);
              }
              else{
                messageService.alertInfFun('err', '保存答题卡生成规则时错误！错误信息为：' + dtkdata.error);
              }
            });
          };

          /**
           * 将考场添加到考试
           */
          var selectKaoChangIdx, //如何考场已经存在，得到他的索引位置
            kaoChangId; //定义一个存放考场的字段
          $scope.selectKaoChang = function(kcId){
            kaoChangId = kcId;
            var isKaoChangExist = _.find(kaoshi_data.shuju.KAOCHANG, function(kch){
              return kch.KID == kcId;
            }); //查看新添加的考场是否存在

            if(isKaoChangExist){
              var kids = _.map(kaoshi_data.shuju.KAOCHANG, function(kch){
                return kch.KID;
              }); //得到本场考试的所有考场ID
              selectKaoChangIdx = _.indexOf(kids, kcId); //得到新添加的考场位置索引
            }
            else{
              var kcInfo = {};
              kcInfo.KID = kcId;
              kcInfo.USERS = [];
              kaoshi_data.shuju.KAOCHANG.push(kcInfo);
              selectKaoChangIdx = kaoshi_data.shuju.KAOCHANG.length - 1;
            }
            $scope.selectKaoChangIdx = selectKaoChangIdx;
          };

          /**
           * 添加单个考生页面显示
           */
          $scope.addNewKaoSheng = function(){
            $scope.isAddNewKaoSheng = true; //显示添加单个考生页面
            $scope.isImportKaoSheng = false; //导入考试页面隐藏
            $scope.studentNameIsNull = false; //考生姓名重置为空
            $scope.studentIDIsNull = false; //考生学号重置为空
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
          $scope.uploadXlsFile = function() {
            var file = $scope.uploadFiles,
              fields = [{"name": "token", "data": token}],
              kaoShengOldArr = [],
              kaoShengNewArr = [];
            Myfileupload.uploadFileAndFieldsToUrl(file, fields, uploadKsUrl).then(function(result){
              $scope.uploadFileUrl = result.data;
              $scope.uploadFiles = [];
              if(result.data.json){
                for(var item in result.data.json){
                  kaoShengOldArr = result.data.json[item];
                  break;
                }
                _.each(kaoShengOldArr, function(ks, idx, list){
                  var ksObj = {XINGMING: '', YONGHUHAO:'', BANJI: ''};
                  _.each(ks, function(value, key, list){
                    switch (key){
                      case '姓名' :
                        ksObj.XINGMING = value;
                        break;
                      case '学号':
                        ksObj.YONGHUHAO = value;
                        break;
                      case '班级':
                        ksObj.BANJI = value;
                    }
                  });
                  kaoShengNewArr.push(ksObj);
                });
                kaoshi_data.shuju.KAOCHANG[selectKaoChangIdx].USERS = kaoShengNewArr;
                messageService.alertInfFun('suc', '上传成功！');
              }
              else{
                messageService.alertInfFun('err', result.error);
              }
            });
          };

          /**
           * 导入考生列表页面显示
           */
          $scope.importKaoSheng = function(){
            $scope.isImportKaoSheng = true; //导入考生页面显示
            $scope.isAddNewKaoSheng = false; //添加单个考生页面隐藏
            $scope.isUploadDone = false;
            $scope.showImportStuds = false;
            $scope.showListBtn = false;
          };

          /**
           * 显示导入成功后的考生列表
           */
          $scope.showImportList = function(){
            if(kaoChangId){
              if(kaoshi_data.shuju.KAOCHANG[selectKaoChangIdx].USERS &&
                kaoshi_data.shuju.KAOCHANG[selectKaoChangIdx].USERS.length > 0){
                $scope.showImportStuds = true; //显示考生列表table
              }
              else{
                messageService.alertInfFun('err', '您还没有上传任何考生信息！');
              }
            }
            else{
              messageService.alertInfFun('pmt', '请选择考场！');
            }
          };

          /**
           * 关闭导入成功后的考生列表
           */
          $scope.hideImportList = function(){
            $scope.showImportStuds = false;
          };

          /**
           * 取消添加新考试
           */
          $scope.cancelAddStudent = function(){
            $scope.isAddNewKaoSheng = false; //显示添加单个考生页面
          };

          /**
           * 取消导入考生
           */
          $scope.cancelImportStudent = function(){
            $scope.isImportKaoSheng = false; //导入考生页面显示隐藏
            $scope.showImportStuds = false; //隐藏考生列表table
          };

          /**
           * 保存新添加的考生
           */
          $scope.saveNewStudent = function(){
            var usr = {},
              studentName = $('.studentName'),
              studentID = $('.studentID'),
              studentClass = $('.studentClass');
            if(!studentName.val()){
              $scope.studentNameIsNull = true;
            }
            if(!studentID.val()){
              $scope.studentIDIsNull = true;
            }
            if(studentName.val() && studentID.val()){
              usr.XINGMING = studentName.val();
              usr.YONGHUHAO = studentID.val();
              usr.BANJI = studentClass.val();
              kaoshi_data.shuju.KAOCHANG[selectKaoChangIdx].USERS.push(usr);
              studentName.val('');
              studentID.val('');
              studentClass.val('');
            }
          };

          /**
           * 删除考生
           */
          $scope.deleteStudent = function(idx){
            kaoshi_data.shuju.KAOCHANG[selectKaoChangIdx].USERS.splice(idx, 1);
          };

          /**
           * 检查输入的学号和姓名是否为空
           */
          $scope.checkInputVal = function(){
            var studentName = $('.studentName').val(),
              studentID = $('.studentID').val();
            if(studentName){
              $scope.studentNameIsNull = false;
            }
            if(studentID){
              $scope.studentIDIsNull = false;
            }
          };

          /**
           * 保存考试
           */
          $scope.saveKaoShi = function(){
            $scope.kaoShengErrorInfo = '';
            if($scope.paperDetail.SHIJUAN.DATIKA && $scope.paperDetail.SHIJUAN.DATIKA.length > 0){
//              var saveKaoConfirm = confirm('本试卷含有答题卡，请先下载答题卡，否则将影响考试！是否去下载答题卡？');
//              if(saveKaoConfirm){
//                $scope.downloadDaTiKa(true);
//              }
              if($('.start-date').val()){
                if(kaoshi_data.shuju.KAOCHANG && kaoshi_data.shuju.KAOCHANG.length > 0){
                  if(kaoshi_data.shuju.KAOCHANG[selectKaoChangIdx].USERS &&
                    kaoshi_data.shuju.KAOCHANG[selectKaoChangIdx].USERS.length){
                    $scope.startDateIsNull = false;
                    var inputStartDate = $('.start-date').val(),
                      startDate = Date.parse(inputStartDate), //开始时间
                      endDate = startDate + kaoshi_data.shuju.SHICHANG * 60 * 1000, //结束时间
                      shijuan_info = { //需要同步的试卷数据格式
                        token: token,
                        caozuoyuan: caozuoyuan,
                        jigouid: jigouid,
                        lingyuid: lingyuid,
                        shijuanid: ''
                      };
                    kaoshi_data.shuju.KAISHISHIJIAN = inputStartDate;
                    kaoshi_data.shuju.JIESHUSHIJIAN = formatDateZh(endDate);
                    shijuan_info.shijuanid = kaoshi_data.shuju.SHIJUAN_ID;
                    $http.post(tongBuShiJuanUrl, shijuan_info).success(function(rst){
                      if(rst.result){
                        $http.post(xiuGaiKaoShiUrl, kaoshi_data).success(function(data){
                          if(data.result){
                            $scope.showKaoShiList();
                            messageService.alertInfFun('suc', '考试添加成功！');
                          }
                          else{
                            messageService.alertInfFun('err', data.error);
                            $scope.kaoShengErrorInfo = JSON.parse(data.error);
                          }
                        });
                      }
                      else{
                        messageService.alertInfFun('err', rst.error);
                      }
                    });
                  }
                  else{
                    messageService.alertInfFun('err', '请添加考生！')
                  }
                }
                else{
                  messageService.alertInfFun('err', '请选择考场！');
                }
              }
              else{
                $scope.startDateIsNull = true;
              }
            }
            else{
              if($('.start-date').val()){
                if(kaoshi_data.shuju.KAOCHANG && kaoshi_data.shuju.KAOCHANG.length > 0){
                  if(kaoshi_data.shuju.KAOCHANG[selectKaoChangIdx].USERS &&
                    kaoshi_data.shuju.KAOCHANG[selectKaoChangIdx].USERS.length){
                    $scope.startDateIsNull = false;
                    var inputStartDate = $('.start-date').val(),
                      startDate = Date.parse(inputStartDate), //开始时间
                      endDate = startDate + kaoshi_data.shuju.SHICHANG * 60 * 1000, //结束时间
                      shijuan_info = { //需要同步的试卷数据格式
                        token: token,
                        caozuoyuan: caozuoyuan,
                        jigouid: jigouid,
                        lingyuid: lingyuid,
                        shijuanid: ''
                      };
                    kaoshi_data.shuju.KAISHISHIJIAN = inputStartDate;
                    kaoshi_data.shuju.JIESHUSHIJIAN = formatDateZh(endDate);
                    shijuan_info.shijuanid = kaoshi_data.shuju.SHIJUAN_ID;
                    $http.post(tongBuShiJuanUrl, shijuan_info).success(function(rst){
                      if(rst.result){
                        $http.post(xiuGaiKaoShiUrl, kaoshi_data).success(function(data){
                          if(data.result){
                            $scope.showKaoShiList();
                            messageService.alertInfFun('suc', '考试添加成功！');
                          }
                          else{
                            messageService.alertInfFun('err', data.error);
                            $scope.kaoShengErrorInfo = JSON.parse(data.error);
                          }
                        });
                      }
                      else{
                        messageService.alertInfFun('err', rst.error);
                      }
                    });
                  }
                  else{
                    messageService.alertInfFun('err', '请添加考生！')
                  }
                }
                else{
                  messageService.alertInfFun('err', '请选择考场！');
                }
              }
              else{
                $scope.startDateIsNull = true;
              }
            }
          };

          /**
           * 结束考试 xiaFaKaoShiBase $scope.kaoshiList
           */
          $scope.endKaoShi = function(){
            var xiaFaKaoShiUrl,
              kaoShiIds = [],
              count = 0,
              kaoShiIdsLen;
            _.each($scope.kaoshiList, function(ks, idx, lst){
              if(ks.ZHUANGTAI == 4){
                kaoShiIds.push(ks.KAOSHI_ID);
              }
            });
            kaoShiIdsLen = kaoShiIds.length;
            var xiaFaKaoShiFun = function(ksId){
              xiaFaKaoShiUrl = xiaFaKaoShiBase + ksId;
              if(count <= kaoShiIdsLen -1){
                $http.get(xiaFaKaoShiUrl).success(function(data){
                  if(data.result){
                    count ++;
                    xiaFaKaoShiFun(kaoShiIds[count]);
                  }
                  else{
                    messageService.alertInfFun('err', data.error);
                    count = kaoShiIdsLen + 1;
                  }
                });
              }
            };
            if(kaoShiIds.length > 0){
              xiaFaKaoShiFun(kaoShiIds[0]);
            }
          };

          /**
           * 修改考试
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
                  $scope.showKaoShiList($scope.kwParams.ksListZt);
                  messageService.alertInfFun('suc', '考试删除成功！');
                }
                else{
                  messageService.alertInfFun('err', data.error);
                }
              });
            }
          };

          /**
           * 发布考试 faBuKaoShiBaseUrl
           */
          $scope.faBuKaoShi = function(ksId){
            var faBuKaoShiUrl = faBuKaoShiBaseUrl + ksId;
            var confirmInfo = confirm('确定要发布本次考试吗？');
            if(confirmInfo){
              $http.get(faBuKaoShiUrl).success(function(data){
                if(data.result){
                  $scope.showKaoShiList();
                  messageService.alertInfFun('suc', '本次考试发布成功！');
                }
                else{
                  messageService.alertInfFun('err', '考试发布失败！');
                }
              });
            }
          };

          /**
           * 查询考场数据
           */
          $scope.getThisKaoChangPageData = function(pg){
            $scope.loadingImgShow = true; //kaoChangList.html
            var pgNum = pg - 1,
              kaochang_id,
              currentPage = pgNum ? pgNum : 0,
              qrySelectKaoChangsUrl;
            //得到分页数组的代码
            var currentKcPageVal = $scope.currentKcPageVal = pg ? pg : 1;
            if(totalKaoChangPage <= paginationLength){
              $scope.kaoChangPages = kaoChangPageArr;
            }
            if(totalKaoChangPage > paginationLength){
              if(currentKcPageVal > 0 && currentKcPageVal <= 6 ){
                $scope.kaoChangPages = kaoChangPageArr.slice(0, paginationLength);
              }
              else if(currentKcPageVal > totalKaoChangPage - 5 && currentKcPageVal <= totalKaoChangPage){
                $scope.kaoChangPages = kaoChangPageArr.slice(totalKaoChangPage - paginationLength);
              }
              else{
                $scope.kaoChangPages = kaoChangPageArr.slice(currentKcPageVal - 5, currentKcPageVal + 5);
              }
            }
            //查询数据的代码
            kaochang_id = kaoChangIdArrRev.slice(currentPage * itemNumPerPage, (currentPage + 1) * itemNumPerPage).toString();
            qrySelectKaoChangsUrl = qryKaoChangDetailBaseUrl + '&kid=' + kaochang_id;
            $http.get(qrySelectKaoChangsUrl).success(function(kcdtl){
              if(kcdtl.length){
                $scope.loadingImgShow = false; //kaoChangList.html
                $scope.kaoChangList = kcdtl;
              }
              else{
                messageService.alertInfFun('err', '没有相关的考场信息！');
                $scope.loadingImgShow = false; //kaoChangList.html
              }
            });
          };

          /**
           * 显示考场列表
           */
          $scope.showKaoChangList = function(){
            $scope.loadingImgShow = true; //kaoChangList.html
            kaoChangPageArr = []; //定义考场页码数组
            kaoChangIdArrRev = []; //存放所有考场ID的数组
            $http.get(qryKaoChangListUrl).success(function(kclst){
              if(kclst.length){
                $scope.kaoChangListIds = kclst; //得到所有的考试ids
                totalKaoChangPage = Math.ceil(kclst.length/itemNumPerPage); //得到所有考试的页码
                for(var i = 1; i <= totalKaoChangPage; i++){
                  kaoChangPageArr.push(i);
                }
                kaoChangIdArrRev = _.map(kclst, function(kcid){ return kcid.KID; });
                $scope.lastKaoChangPageNum = totalKaoChangPage; //最后一页的数值
                //查询数据开始
                $scope.getThisKaoChangPageData();
                $scope.txTpl = 'views/partials/kaoChangList.html';
                isEditKaoChang = false; //是否为编辑考场
                isDeleteKaoChang = false; //是否为删除考场
              }
              else{
                $scope.txTpl = 'views/partials/kaoChangList.html';
                isEditKaoChang = false; //是否为编辑考场
                isDeleteKaoChang = false; //是否为删除考场
                messageService.alertInfFun('err', '没有相关的考场信息！');
                $scope.loadingImgShow = false; //kaoChangList.html
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
                  qryAllKaoChang();
                  messageService.alertInfFun('suc', '考场删除成功！');
                }
                else{
                  messageService.alertInfFun('err', data.error);
                }
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
            $scope.loadingImgShow = true; //保存考场
            $http.post(xiuGaiKaoChangUrl, kaochang_data).success(function(data){
              if(data.result){
                $scope.loadingImgShow = false; //保存考场
                messageService.alertInfFun('suc', '考场保存成功！');
                $scope.showKaoChangList();
              }
              else{
                messageService.alertInfFun('err', data.error);
              }
            });
          };


        } // 002 结束
      ]); //controller 结束
  } // 001 结束
); // 000 结束
