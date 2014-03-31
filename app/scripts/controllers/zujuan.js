define(['jquery', 'underscore', 'angular', 'config', 'services/urlredirect'],
  function ($, _, angular, config, UrlredirectService) {
  'use strict';

  angular.module('kaoshiApp.controllers.ZujuanCtrl', [])
    .controller('ZujuanCtrl', ['$rootScope', '$scope', '$location', '$http', 'urlRedirect', '$q',
      function ($rootScope, $scope, $location, $http, urlRedirect, $q) {
      /**
       * 操作title
       */
      $rootScope.pageName = "组卷"; //page title
      $rootScope.styles = [
        'styles/zujuan.css'
      ];
      $rootScope.dashboard_shown = true;
      $rootScope.session.lsmb_id = []; //存放临时模板id的数组
      /**
       * 声明变量
       */
      var userInfo = $rootScope.session.userInfo,
        baseMtAPIUrl = config.apiurl_mt, //mingti的api
        token = config.token,
        caozuoyuan = userInfo.UID,//登录的用户的UID
        jigouid = userInfo.JIGOU[0].JIGOU_ID,
        lingyuid = userInfo.LINGYU[0].LINGYU_ID,
        chaxunzilingyu = true,
        qryDgUrl = baseMtAPIUrl + 'chaxun_zhishidagang?token=' + token + '&caozuoyuan=' + caozuoyuan
          + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&chaxunzilingyu=' + chaxunzilingyu,//查询大纲的url

        qryKnowledgeBaseUrl = baseMtAPIUrl + 'chaxun_zhishidagang_zhishidian?token=' + token + '&caozuoyuan=' +
          caozuoyuan + '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&zhishidagangid=', //查询知识点基础url

        qryKnowledge = '', //定义一个空的查询知识点的url
        selectZsd,//定义一个选中知识点的变量（数组)
        timuleixing_id = '', //用于根据题目类型查询题目的字符串
        nandu_id = '', //用于根据难度查询题目的字符串
        zhishidian_id = '', //用于根据知识点查询题目的字符串

        qryKmTx = baseMtAPIUrl + 'chaxun_kemu_tixing?token=' + token + '&caozuoyuan=' + caozuoyuan + '&jigouid=' +
          jigouid + '&lingyuid=', //查询科目包含什么题型的url

        qrytimuliebiaoBase = baseMtAPIUrl + 'chaxun_timuliebiao?token=' + token + '&caozuoyuan=' + caozuoyuan +
          '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询题目列表的url

        qrytimuxiangqingBase = baseMtAPIUrl + 'chaxun_timuxiangqing?token=' + token + '&caozuoyuan=' + caozuoyuan +
          '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询题目详情基础url

        timudetails,//获得的题目数组
        tiMuIdArr = [], //获得查询题目ID的数组
        pageArr = [], //根据得到的数据定义一个分页数组
        totalPage, //符合条件的数据一共有多少页
        itemNumPerPage = 10, //每页显示多少条数据
        paginationLength = 11, //分页部分，页码的长度，目前设定为11
        shijuanData = { //试卷的数据模型
          token: token,
          caozuoyuan: caozuoyuan,
          jigouid: jigouid,
          lingyuid: lingyuid,
          shuju:{
            SHIJUANID: '',
            SHIJUANMINGCHENG: '',
            FUBIAOTI: '',
            SHIJUANMULUID: '',
            SHIJUANMUBANID: '',
            SHIJUAN_TIMU: [
//              {
//                TIMUID: '',
//                MUBANDATIID: '',
//                WEIZHIXUHAO: '',
//                FENZHI: ''
//              }
            ],
            ZHUANGTAI: 1
          }
        },
        xgsjUrl = baseMtAPIUrl + 'xiugai_shijuan', //提交试卷数据的URL
        mubanData = { //模板的数据模型
          token: token,
          caozuoyuan: caozuoyuan,
          jigouid: jigouid,
          lingyuid: lingyuid,
          shuju: {
            SHIJUANMUBAN_ID: '',
            MUBANMINGCHENG: '',
            SHIJUANZONGFEN: 100,
            ISYUNXUHUITUI: 1,
            SUIJIPAITIFANGSHI: 1,
            DATIBIANHAOGESHI: 3,
            XIAOTIBIANHAOGESHI: 1,
            ZONGDAOYU: '',
            HASFUBIAOTI: 1,
            LEIXING: 2,
            MUBANDATI: []
          }
        },
        xgmbUrl = baseMtAPIUrl + 'xiugai_muban', //提交模板数据的URL
        mbdt_data = [], // 得到模板大题的数组
        mbdtdLength, //得到模板大题的长度
        tempShiTiData = {

        }, //临时存放试题的数据模型
        deletelsmbData = { //删除临时模板的数据模型
          token: token,
          caozuoyuan: caozuoyuan,
          jigouid: jigouid,
          lingyuid: lingyuid,
          muban_id: $rootScope.session.lsmb_id
        },
        deletelsmbUrl = baseMtAPIUrl + 'shanchu_muban'; //删除临时模板的url


      /**
       * 初始化是DOM元素的隐藏和显示
       */
      $scope.keMuList = true; //科目选择列表内容隐藏
      $scope.dgListBox = true; //大纲选择列表隐藏
      $scope.letterArr = config.letterArr; //题支的序号
      $scope.cnNumArr = config.cnNumArr; //汉语的大学数字
      $scope.shijuanData = shijuanData; // 试卷的数据
      $scope.mubanData = mubanData; // 模板的数据
      $scope.sjPreview = false; //试卷预览里面的试题试题列表
      $scope.addOrRemoveItem = true;

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

      //查询科目题型(chaxun_kemu_tixing)
      $http.get(qryKmTx + userInfo.LINGYU[0].LINGYU_ID).success(function(data){ //页面加载的时候调用科目题型
        $scope.kmtxList = data;
      });

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
       点击checkbox得到checkbox的值(既是大纲知识点的值)
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
        zhishidian_id = selectZsd.toString();
        qryTestFun();
      };

      /**
       * dagangListWrap宽度可拖拽
       */
      var resize = function(el, dragItem, reductionItem, minWidth, maxWidth){
        //初始化参数
        var els = document.getElementById(dragItem).style,
          x = 0, //鼠标的 X 和 Y 轴坐标
          dragItemClass = '#' + dragItem, //得到需要元素的class
          distNum = 100;

        $(el).mousedown(function(e) {
          //按下元素后，计算当前鼠标与对象计算后的坐标
          x = e.clientX - el.offsetWidth - $(dragItemClass).width();
          //在支持 setCapture 做些东东
          el.setCapture ? (
            //捕捉焦点
            el.setCapture(),
              //设置事件
            el.onmousemove = function(ev) {
              mouseMove(ev || event);
            },
            el.onmouseup = mouseUp
            ) : (
            //绑定事件
            $(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp)
            );
          //防止默认事件发生

          e.preventDefault();
        });
        //移动事件
        function mouseMove(e) {
          var subDbWidth = $(dragItemClass).width();
          if(subDbWidth < minWidth - 1){
            $(document).unbind('mousemove', mouseMove);
            els.width = minWidth + 'px';
            $(reductionItem).css('padding-left',els.width);
          }
          if(subDbWidth >= minWidth - 1 && subDbWidth <= maxWidth + 4){
            els.width = e.clientX - x + 'px';
            $(reductionItem).css('padding-left',els.width);
          }
          if(subDbWidth > maxWidth + 4){
            $(reductionItem).css('padding-left',els.width);
            els.width = maxWidth + 'px';
            $(document).unbind('mousemove', mouseMove);
          }
          distNum = $('.sliderItemInner').width()/maxWidth; //得到难度系数
          $('.coefft').html(distNum.toFixed(2));
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
            $(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp)
            );
        }
      };
      resize(document.getElementById('sliderBtn'), 'sliderItem','', 0, 220);//初始化拖拽

      /**
       * 获得难度分布的数组
       */
      $scope.getNanduDist = function(){
        var x = $('.coefft').html(),//得到难度系数
          n = 5, //有几段难度分布
          nl = n - 1,
          i, u, a, b,
          fx = 1,
          distArr = [];
        if(x == 0){
          distArr[0] = 1;
          for(i = 1; i <= nl; i++){
            distArr[i] = 0;
          }
        }
        else if(x == 1){
          distArr[nl] = 1;
          for(i = 0; i < nl; i++){
            distArr[i] = 0;
          }
        }
        else{
          u = Math.tan((x-0.5) * Math.PI)/2 + 0.5;
          if(u <= 0){
            for(i = 1; i <= nl; i++){
              a = i/n;
              b = (i + 1)/n;
              distArr[i] = (b-a)*(2-b-a)/(1-u);
              fx = fx - distArr[i];
            }
            distArr[0] = fx;
          }
          else if(u >= 1){
            for(i = 0; i < nl; i++){
              a = i/n;
              b = (i + 1)/n;
              distArr[i] = (b*b - a*a)/u;
              fx = fx - distArr[i];
            }
            distArr[nl] = fx;
          }
          else{
            for(i = 0; i <= nl; i++){
              a = i/n;
              b = (i + 1)/n;
              if(u >= b){
                distArr[i] = (b*b - a*a)/u;
              }
              else if(u <= a){
                distArr[i] = (b-a)*(2-b-a)/(1-u);
              }
              else{
                distArr[i] = (u*u - a*a)/u + (b-u)*(2-b-u)/(1-u);
              }
            }
          }
        }
//        console.log(distArr);
      };

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
       * 查询试题的函数
       */
      var qryTestFun = function(){
        var qrytimuliebiao = qrytimuliebiaoBase + '&timuleixing_id=' + timuleixing_id +
          '&nandu_id=' + nandu_id + '&zhishidian_id=' + zhishidian_id; //查询题目列表的url
        tiMuIdArr = [];
        pageArr = [];

        $http.get(qrytimuliebiao).success(function(data){
          $scope.testListId = data;
          _.each(data, function(tm, idx, lst){
            tiMuIdArr.push(tm.TIMU_ID);
          });
          //获得一共多少页的代码开始
          totalPage = Math.ceil(data.length/itemNumPerPage);
          for(var i = 1; i <= totalPage; i++){
            pageArr.push(i);
          }
          $scope.lastPageNum = totalPage; //最后一页的数值
          //查询数据开始
          $scope.getThisPageData();
        })
          .error(function(err){
            console.log(err);
          });
      };

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
       * 提交临时模板的数据
       */
      var getShiJuanMuBanData = function(){
        var deferred = $q.defer();
        mbdt_data = []; // 得到模板大题的数组
        mbdtdLength = 0; //得到模板大题的长度

        //mubanData.shuju.MUBANDATI = [];
        _.each($scope.kmtxList, function(kmtx, idx, lst){
          var mubandatiItem = {
            MUBANDATIID: '',
            DATIMINGCHENG: '',
            SHUOMINGDAOYU:'',
            TIMUSHULIANG: '',
            MEITIFENZHI: '',
            XUHAO: '',
            ZHUANGTAI: 1,
            TIMUARR:[]
          };
          mubandatiItem.MUBANDATIID = kmtx.TIXING_ID;
          mubandatiItem.DATIMINGCHENG = kmtx.TIXINGMINGCHENG;
          mubandatiItem.XUHAO = idx;
          mubanData.shuju.MUBANDATI.push(mubandatiItem);
          mbdt_data.push(mubandatiItem);
          mbdtdLength ++;
        });

        $http.post(xgmbUrl, mubanData).success(function(data){
          if(data.result){
            $rootScope.session.lsmb_id.push(data.id); //新创建的临时模板id
            shijuanData.shuju.SHIJUANMUBANID = data.id; //将创建的临时试卷模板id赋值给试卷的试卷模板id
            console.log($rootScope.session.lsmb_id);
            deferred.resolve();
          }
        }).error(function(err){
            alert(err);
            deferred.reject();
          });

        return deferred.promise;
      };
//      $scope.getShiJuanMuBan = function(){
//        getShiJuanMuBanData();
//      };

      /**
       * 删除临时模板
       */
//      var deleteLinShiMuBan = function(){
//
//        $http.post(deletelsmbUrl, deletelsmbData).success(function(data){
//          console.log(data);
//        }).error(function(err){
//            alert(err);
//          });
//      };
//      deleteLinShiMuBan(); //初始化时，删除没有用到的临时模板
//
//      $scope.deleteLinShiMu = function(){ //临时性的
//        deleteLinShiMuBan();
//      };

      /**
       * 显示试题列表
       */
      $scope.showTestList = function(txid){
        $('.popupWrap').animate({
          left: '341px'
        }, 500, function() {
          $('.popupWrap').css('left','auto');
        });
        //加载手动组卷的模板
        $scope.paper_hand_form = true;
        //查询试题的函数
        $scope.getTiXingId(txid);
        $scope.txSelectenIdx = txid;
        $scope.txTpl = 'views/partials/paper_hand_form.html';
      };

      /**
       *  手动组卷
       */
      $scope.handMakePaper = function(txid){
        var promise = getShiJuanMuBanData(); //保存试卷模板成功以后
        promise.then(function(){
          $scope.showTestList(txid);
        });
      };

      /**
       * 自动组卷
       */
//      $scope.autoMakePaper = function(){
//        $('.popupWrap').css('left','341px').animate({
//          left: '-260px'
//        }, 500, function() {
//
//        });
//      };
      console.log('hello');

      /**
      * 由收到组卷返回的组卷的首页
      */
      var backToZjHomeFun = function(){
        $scope.paper_hand_form = false; //手动组卷时添加的样式
        $('.popupWrap').css('left', '-260px'); //将div.popupWrap的left属性还原
        $scope.txTpl = 'views/partials/paper_preview.html'; //加载试卷预览模板
      };
      $scope.backToZjHome = function(){
        backToZjHomeFun();
        $scope.sjPreview = false;
      };

      /**
       * 将题加入试卷
       */
      $scope.addToPaper = function(tm){
        var sjtmItem = {
            TIMUID: '',
            MUBANDATIID: '',
            WEIZHIXUHAO: '',
            FENZHI: ''
          };
        //将试题加入到对应的题目大题的数据中
        for(var i = 0; i < mbdtdLength; i++){
         if(mubanData.shuju.MUBANDATI[i].MUBANDATIID == tm.TIMULEIXING_ID){
           mubanData.shuju.MUBANDATI[i].TIMUARR.push(tm);
         }
        }
        //将试题加入试卷
        sjtmItem.TIMUID = tm.TIMU_ID;
        sjtmItem.MUBANDATIID = tm.TIMULEIXING_ID;
        //sjtmItem.WEIZHIXUHAO = shijuanData.shuju.SHIJUAN_TIMU.length = 0 ? 0 : shijuanData.shuju.SHIJUAN_TIMU.length + 1;
        shijuanData.shuju.SHIJUAN_TIMU.push(sjtmItem);
        //加入试卷按钮和移除试卷按钮的显示和隐藏
        addOrRemoveItemToPaper(shijuanData.shuju.SHIJUAN_TIMU);

      };

      /**
       * 将题移除试卷
       */
      $scope.removeOutPaper = function(tm){
        shijuanData.shuju.SHIJUAN_TIMU = _.reject(shijuanData.shuju.SHIJUAN_TIMU, function(shtm){
          return shtm.TIMUID  == tm.TIMU_ID;
        });
        addOrRemoveItemToPaper(shijuanData.shuju.SHIJUAN_TIMU);
      };

      /**
       * 加入试卷按钮和移除试卷按钮的显示和隐藏
       */
      var addOrRemoveItemToPaper = function(arr){
        var selectTestStr = '';
        _.each(arr, function(shtm, idx, lst){
          selectTestStr += 'selectTest' + shtm.TIMUID + ',';
        });
        $scope.selectTestStr = selectTestStr;
      };

        /**
       * 试卷预览代码
       */
      $scope.shijuanPreview = function(){
        $scope.mubanData = mubanData;
        console.log(mubanData);
        backToZjHomeFun();
        $scope.sjPreview = true;
      };



      /**
       * 当离开本页的时候触发事件，删除无用的临时模板
       */
      $scope.$on('$destroy', function () {
        var nextPath = $location.$$path,
            myInterval = setInterval(1000);
        if($rootScope.session.lsmb_id.length){
          $http.post(deletelsmbUrl, deletelsmbData).success(function(data){
            if(data.result){
              $rootScope.session.lsmb_id = [];
              deletelsmbData.muban_id = [];
              clearInterval(myInterval);
              urlRedirect.goTo('/zujuan', nextPath);
            }
          }).error(function(err){
            alert(err);
          });
        }
        else{
          urlRedirect.goTo('/zujuan', nextPath);
        }
      });

    }]);
});
