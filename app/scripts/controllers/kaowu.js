define(['jquery', 'underscore', 'angular', 'intimidatetime', 'config'], // 000 开始
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
          xiuGaiKaoChangUrl = baseKwAPIUrl + 'xiugai_kaodiankaochang', //修改考场的url
          paperPageArr = [], //定义试卷页码数组
          sjlbIdArrRev = [], //存放所有试卷ID的数组
          totalPaperPage,//符合条件的试卷一共有多少页
          itemNumPerPage = 10, //每页显示多少条数据
          paginationLength = 11, //分页部分，页码的长度，目前设定为11
          qryShiJuanGaiYaoBase = baseMtAPIUrl + 'chaxun_shijuangaiyao?token=' + token + '&caozuoyuan=' + caozuoyuan +
          '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&shijuanid=', //查询试卷概要的基础URL
          getUserNameBase = baseRzAPIUrl + 'get_user_name?token=' + token + '&uid='; //得到用户名的URL

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
         * 显示考试列表,可分页的方法
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
                  $scope.txTpl = 'views/partials/kaoShiList.html';
                  $scope.isAddNewKaoSheng = false; //显示添加单个考生页面
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
         * 查询本机构下的所有考场
         */
        var qryAllKaoChang = function(){
          $http.get(qryKaoChangDetailBaseUrl).success(function(data){
            if(data.length){
              $scope.allKaoChangList = data;
            }
          });
        };

        /**
         * 新增一个考试 //
         */
        $scope.addNewKaoShi = function(ks){
          $scope.isAddNewKaoSheng = false; //显示添加单个考生页面
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
         *  查询试卷列表的函数，组卷页面加载时，查询数据
         */
//        var qryShiJuanList = function(){
//          paperPageArr = [];
//          sjlbIdArrRev = []; //反转试卷列表id
//          $http.get(qryCxsjlbUrl).success(function(sjlb){
//            if(sjlb.length){
//              $scope.papertListIds = sjlb;
//              var sjlbIdArr; //试卷id列表数组
//              totalPaperPage = Math.ceil(sjlb.length/itemNumPerPage); //试卷一共有多少页
//              for(var i = 1; i <= totalPaperPage; i++){
//                paperPageArr.push(i);
//              }
//              $scope.lastPaperPageNum = totalPaperPage; //最后一页的数值
//              sjlbIdArr = _.map(sjlb, function(sj){
//                return sj.SHIJUAN_ID;
//              });
//              sjlbIdArrRev = sjlbIdArr.reverse(); //将数组反转，按照时间倒叙排列
//              //查询数据开始
//              $scope.getThisSjgyPageData();
//            }
//          }).error(function(err){
//            alert(err);
//          });
//        };

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
          //查询数据的代码 //
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
                  alert('查询创建人名称失败！');
                }
              });
            }
            else{
              alert('很遗憾！没有相关数据！');
            }
          }).error(function(err){
            console.log(err);
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
          $scope.showPopupBox = false;
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
         * 文件上传//
         */
        var fileUpload = function(form, action_url, div_id) {
          var eventHandler, iframe, iframeId;
          iframe = document.createElement("iframe");
          iframe.setAttribute("id", "upload_iframe");
          iframe.setAttribute("name", "upload_iframe");
          iframe.setAttribute("width", "0");
          iframe.setAttribute("height", "0");
          iframe.setAttribute("border", "0");
          iframe.setAttribute("style", "width: 0; height: 0; border: none;");
          form.parentNode.appendChild(iframe);
          window.frames["upload_iframe"].name = "upload_iframe";
          iframeId = document.getElementById("upload_iframe");

          eventHandler = function() {
            var content;
            if (iframeId.detachEvent) {
              iframeId.detachEvent("onload", eventHandler);
            }
            else {
              iframeId.removeEventListener("load", eventHandler, false);
            }
            if (iframeId.contentDocument) {
              content = iframeId.contentDocument.body.innerHTML;
            }
            else if (iframeId.contentWindow) {
              content = iframeId.contentWindow.document.body.innerHTML;
            }
            else {
              if (iframeId.document) {
                content = iframeId.document.body.innerHTML;
              }
            }
            document.getElementById(div_id).innerHTML = content;
            setTimeout("iframeId.parentNode.removeChild(document.getElementById('upload_iframe'))", 1000);
            alert('导入成功！');
          };

          if (iframeId.addEventListener) {
            iframeId.addEventListener("load", eventHandler, true);
          }
          if (iframeId.attachEvent) {
            iframeId.attachEvent("onload", eventHandler);
          }
          form.setAttribute("target", "upload_iframe");
          form.setAttribute("action", action_url);
          form.setAttribute("method", "post");
          form.setAttribute("enctype", "multipart/form-data");
          form.setAttribute("encoding", "multipart/form-data");
          form.submit();
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
         * 导入考生
         */
        $scope.uploadXlsFile = function(kcId){
          var uploadDone = false,
            form = $('#importStudentForm')[0],
            action_url = '/student_import',
            div_id = 'upload-indicator';
          if(kcId){
            if($('.findFileBtn').val()){
              var eventHandler, iframe, iframeId;
              iframe = document.createElement("iframe");
              iframe.setAttribute("id", "upload_iframe");
              iframe.setAttribute("name", "upload_iframe");
              iframe.setAttribute("width", "0");
              iframe.setAttribute("height", "0");
              iframe.setAttribute("border", "0");
              iframe.setAttribute("style", "width: 0; height: 0; border: none;");
              form.parentNode.appendChild(iframe);
              window.frames["upload_iframe"].name = "upload_iframe";
              iframeId = document.getElementById("upload_iframe");

              eventHandler = function() {
                var content;
                if (iframeId.detachEvent) {
                  iframeId.detachEvent("onload", eventHandler);
                }
                else {
                  iframeId.removeEventListener("load", eventHandler, false);
                }
                if (iframeId.contentDocument) {
                  content = iframeId.contentDocument.body.innerHTML;
                  uploadDone = true;
                }
                else if (iframeId.contentWindow) {
                  content = iframeId.contentWindow.document.body.innerHTML;
                  uploadDone = true;
                }
                else {
                  if (iframeId.document) {
                    content = iframeId.document.body.innerHTML;
                    uploadDone = true;
                  }
                }
                document.getElementById(div_id).innerHTML = content;
                if(uploadDone){
                  kaoshi_data.shuju.KAOCHANG[selectKaoChangIdx].USERS = JSON.parse($('#upload-indicator pre').html());
                  setTimeout("iframeId.parentNode.removeChild(document.getElementById('upload_iframe'))", 1000);
                  $scope.showListBtn = true;
                  alert('导入成功！');
                }
              };

              if (iframeId.addEventListener) {
                iframeId.addEventListener("load", eventHandler, true);
              }
              if (iframeId.attachEvent) {
                iframeId.attachEvent("onload", eventHandler);
              }
              form.setAttribute("target", "upload_iframe");
              form.setAttribute("action", action_url);
              form.setAttribute("method", "post");
              form.setAttribute("enctype", "multipart/form-data");
              form.setAttribute("encoding", "multipart/form-data");
              form.submit();
            }
            else{
              alert('请选择上传文件！');
            }
          }
          else{
            alert('请选择考场！');
          }
        };

        /**
         * 显示导入成功后的考生列表
         */
        $scope.showImportList = function(){
          if(kaoChangId){
            if(kaoshi_data.shuju.KAOCHANG[selectKaoChangIdx].USERS.length){
              $scope.showImportStuds = true; //显示考生列表table
            }
            else{
              alert('您还没有上传任何考生信息！');
            }
          }
          else{
            alert('请选择考场！');
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
            usr.XUEHAO = studentID.val();
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
         * 查询考场数据
         */
        var queryKaoChangList = function(){
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
         * 显示考场列表
         */
        $scope.showKaoChangList = function(){
          queryKaoChangList();
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
