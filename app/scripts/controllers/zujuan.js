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
            SHIJUAN_ID: '',
            SHIJUANMINGCHENG: '',
            FUBIAOTI: '',
            SHIJUANMULU_ID: '',
            SHIJUANMUBAN_ID: '',
            SHIJUAN_TIMU: [],
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
            SHIJUANZONGFEN: '',
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
        //mbdtdLength, //得到模板大题的长度
        nanduTempData = [ //存放题型难度的数组
          {
            nanduId: '1',
            nanduName:'容易',
            nanduCount: []
          },
          {
            nanduId: '2',
            nanduName:'较易',
            nanduCount: []
          },
          {
            nanduId: '3',
            nanduName:'一般',
            nanduCount: []
          },
          {
            nanduId: '4',
            nanduName:'较难',
            nanduCount: []
          },
          {
            nanduId: '5',
            nanduName:'困难',
            nanduCount: []
          }
        ],
        nanduLength = nanduTempData.length, //难度数组的长度
        deletelsmbData = { //删除临时模板的数据模型
          token: token,
          caozuoyuan: caozuoyuan,
          jigouid: jigouid,
          lingyuid: lingyuid,
          muban_id: []
        },
        deletelsmbUrl = baseMtAPIUrl + 'shanchu_muban', //删除临时模板的url
        kmtxListLength, //获得科目题型的长度
        qryCxsjlbUrl = baseMtAPIUrl + 'chaxun_shijuanliebiao?token=' + token + '&caozuoyuan=' + caozuoyuan +
        '&jigouid=' + jigouid + '&lingyuid=' + lingyuid, //查询试卷列表url
        qryPaperDetailUrlBase = baseMtAPIUrl + 'chaxun_shijuanxiangqing?token=' + token + '&caozuoyuan=' + caozuoyuan +
        '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&shijuanid=';//查询试卷列表url


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
      $scope.nanduTempData = nanduTempData; //难度的数组
      $scope.shijuanyulanBtn = false; //试卷预览的按钮
      $scope.fangqibencizujuanBtn = false; //放弃本次组卷的按钮
      $scope.baocunshijuanBtn = false; //保存试卷的按钮

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
        $scope.kmtxList = _.each(data, function(txdata, idx, lst){
          txdata.itemsNum = 0;
        });
//        $scope.kmtxList = kmtxListData;
        kmtxListLength = data.length; //科目题型的长度
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
        mbdt_data = []; // 得到模板大题的数组//
       // mbdtdLength = 0; //得到模板大题的长度

        //mubanData.shuju.MUBANDATI = [];
        _.each($scope.kmtxList, function(kmtx, idx, lst){
          var mubandatiItem = {
            MUBANDATI_ID: '',
            DATIMINGCHENG: '',
            SHUOMINGDAOYU:'',
            TIMUSHULIANG: '',
            MEITIFENZHI: '',
            XUHAO: '',
            ZHUANGTAI: 1,
            TIMUARR:[],//自己添加的数组
            datiScore: ''//自己定义此大题的分数
          };
          mubandatiItem.MUBANDATI_ID = kmtx.TIXING_ID;
          mubandatiItem.DATIMINGCHENG = kmtx.TIXINGMINGCHENG;
          mubandatiItem.XUHAO = idx;
          mubanData.shuju.MUBANDATI.push(mubandatiItem);
          mbdt_data.push(mubandatiItem);
         // mbdtdLength ++; //得到科目题型的长度
        });

        $http.post(xgmbUrl, mubanData).success(function(data){
          if(data.result){
            $rootScope.session.lsmb_id.push(data.id); //新创建的临时模板id

            shijuanData.shuju.SHIJUANMUBAN_ID = data.id; //将创建的临时试卷模板id赋值给试卷的试卷模板id
            //console.log(shijuanData);
            deferred.resolve();
          }
        }).error(function(err){
            alert(err);
            deferred.reject();
          });

        return deferred.promise;
      };

      /**
       * 显示试题列表
       */
      $scope.showTestList = function(txid){
        var dashboardWith = $('.dashboard').width();
        if(dashboardWith == 120){
          $('.popupWrap').animate({
            left: '341px'
          }, 500, function() {
            $('.popupWrap').css('left','auto');
          });
        }
        else{
          $('.popupWrap').animate({
            left: '241px'
          }, 500, function() {
            $('.popupWrap').css('left','auto');
          });
        }
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
          $scope.shijuanyulanBtn = true; //试卷预览的按钮
          $scope.fangqibencizujuanBtn = true; //放弃本次组卷的按钮
          $scope.baocunshijuanBtn = true; //保存试卷的按钮
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

      /**
      * 由收到组卷返回的组卷的首页
      */
      var backToZjHomeFun = function(){
        $scope.paper_hand_form = false; //手动组卷时添加的样式
        $('.popupWrap').css('left', '-360px'); //将div.popupWrap的left属性还原
        $scope.txTpl = 'views/partials/paper_preview.html'; //加载试卷预览模板

      };
      $scope.backToZjHome = function(){
        backToZjHomeFun();
        $scope.sjPreview = false;
      };

      /**
       * 题型统计的函数
       */
      var tixingStatistics = function(lv1, lv2){
        for(var lp = 0; lp < lv2; lp++){
          if(mubanData.shuju.MUBANDATI[lv1].MUBANDATI_ID == $scope.kmtxList[lp].TIXING_ID){
            $scope.kmtxList[lp].itemsNum =  mubanData.shuju.MUBANDATI[lv1].TIMUARR.length;
            //得到总题量
            var tixingSum = _.reduce($scope.kmtxList, function(memo, itm){
              var itemNumVal = itm.itemsNum ? itm.itemsNum : 0;
              return memo + itemNumVal;
            },0);

            //得到已选试题的总量
            $scope.totalSelectedItmes = tixingSum;

            //计算每种题型的百分比
            _.each($scope.kmtxList, function(tjkmtx, idx, lst){
              var itemNumVal = tjkmtx.itemsNum ? tjkmtx.itemsNum : 0,
                percentVal = ((itemNumVal/tixingSum)*100).toFixed(0) + '%';
              return tjkmtx.txPercentNum = percentVal;
            });
          }
        }
      };

      /**
       * 将题加入试卷 //
       */
      $scope.addToPaper = function(tm){
//        if(g){
//
//        }
        var sjtmItem = {
            TIMU_ID: '',
            MUBANDATI_ID: '',
            WEIZHIXUHAO: '',
            FENZHI: ''
          },
        mbdtdLength = mubanData.shuju.MUBANDATI.length;

        //将试题加入到对应的题目大题的数据中
        for(var i = 0; i < mbdtdLength; i++){
          //将题加入到mubanData数据中
          if(mubanData.shuju.MUBANDATI[i].MUBANDATI_ID == tm.TIXING_ID){ //将TIMULEIXING_ID换成TIXING_ID
            tm.xiaotiScore = '';
            mubanData.shuju.MUBANDATI[i].TIMUARR.push(tm);

            console.log(mubanData);

            //统计每种题型的数量和百分比
            tixingStatistics(i, kmtxListLength);

            //均分大题分数
            $scope.divideDatiScore(mubanData.shuju.MUBANDATI[i]);
          }
        }

        //统计难度的数量
        for(var j = 0; j < nanduLength; j++){
          if(nanduTempData[j].nanduId == tm.NANDU_ID){
            nanduTempData[j].nanduCount.push(tm.TIMU_ID);

            //每种难度的数量和百分比
            nanduPercent();
          }
        }

        //将试题加入试卷
        sjtmItem.TIMU_ID = tm.TIMU_ID;
        sjtmItem.MUBANDATI_ID = tm.TIXING_ID; //将TIMULEIXING_ID换成TIXING_ID
        shijuanData.shuju.SHIJUAN_TIMU.push(sjtmItem);
        //加入试卷按钮和移除试卷按钮的显示和隐藏
        addOrRemoveItemToPaper(shijuanData.shuju.SHIJUAN_TIMU);
        //console.log(shijuanData);
        //console.log(mubanData);
      };

      /**
       * 将题移除试卷
       */
      $scope.removeOutPaper = function(tm){
        var mbdtdLength = mubanData.shuju.MUBANDATI.length;
        shijuanData.shuju.SHIJUAN_TIMU = _.reject(shijuanData.shuju.SHIJUAN_TIMU, function(shtm){
          return shtm.TIMU_ID  == tm.TIMU_ID;
        });
        //加入试卷按钮和移除试卷按钮的显示和隐藏
        addOrRemoveItemToPaper(shijuanData.shuju.SHIJUAN_TIMU);

        //难度统计
        for(var k = 0; k < nanduLength; k++){
          if(nanduTempData[k].nanduId == tm.NANDU_ID){
            var ndCountLenght = nanduTempData[k].nanduCount.length;
            for(var l = 0; l < ndCountLenght; l++){
              if(nanduTempData[k].nanduCount[l] == tm.TIMU_ID){
                nanduTempData[k].nanduCount.splice(l, 1);

                //每种难度的数量和百分比
                nanduPercent();
              }
            }
          }
        }
        //查找要删除的元素的位置
        for(var i = 0; i < mbdtdLength; i++){

          //从mubanData中删除数据
          if(mubanData.shuju.MUBANDATI[i].MUBANDATI_ID == tm.TIXING_ID){ // 判断那个题目类型id; 将TIMULEIXING_ID换成TIXING_ID
            var tmarrLength = mubanData.shuju.MUBANDATI[i].TIMUARR.length; // 得到这个题目类型下面的题目数组
            for(var j = 0; j < tmarrLength; j ++){
              if(mubanData.shuju.MUBANDATI[i].TIMUARR[j].TIMU_ID == tm.TIMU_ID){ //找到要删除的对应数据
                mubanData.shuju.MUBANDATI[i].TIMUARR.splice(j, 1);

                //统计每种题型的数量
                tixingStatistics(i, kmtxListLength);

                //均分大题分数
                $scope.divideDatiScore(mubanData.shuju.MUBANDATI[i]);

                break;
              }
            }
          }
        }
        //console.log(shijuanData);
      };

      /**
       * 加入试卷按钮和移除试卷按钮的显示和隐藏
       */
      var addOrRemoveItemToPaper = function(arr){
        var selectTestStr = '';
        _.each(arr, function(shtm, idx, lst){
          selectTestStr += 'selectTest' + shtm.TIMU_ID + ',';
        });
        $scope.selectTestStr = selectTestStr;
      };

      /**
       *  计算难度的百分比
       */
      var nanduPercent = function(){
        var nanduSum = _.reduce($scope.nanduTempData, function(memo, ndItm){
          var ndItemNumVal = ndItm.nanduCount.length;
          return memo + ndItemNumVal;
        },0);

        _.each($scope.nanduTempData, function(ndkmtx, idx, lst){
          var ndItemNumVal = ndkmtx.nanduCount.length,
            percentVal = ((ndItemNumVal/nanduSum)*100).toFixed(0) + '%';
          return ndkmtx.ndPercentNum = percentVal;
        });
      };

      /**
       * 试卷预览代码
       */
      $scope.shijuanPreview = function(){
        $scope.mubanData = mubanData;
        backToZjHomeFun();
        $scope.sjPreview = true;
      };

      /**
       * 均分大题的分值
       */
      $scope.divideDatiScore = function(mbdt){
        var datiTotalScore = mbdt.datiScore, //本大题总分
            xiaotiAverageScore = (datiTotalScore/mbdt.TIMUARR.length).toFixed(0); //每小题的分数

        _.each(mbdt.TIMUARR, function(xiaoti, idx, lst){
          if(idx + 1 < mbdt.TIMUARR.length){
            xiaoti.xiaotiScore = xiaotiAverageScore;
            datiTotalScore -= xiaotiAverageScore;
          }
          if(idx +1 == mbdt.TIMUARR.length){ //给最后一小题赋值
            xiaoti.xiaotiScore = datiTotalScore;
          }
        });
      };

      /**
       * 有小题的到大题的分值
       */
      $scope.addXiaotiScore = function(mbdt){
        var datiScore = 0;
        _.each(mbdt.TIMUARR, function(xiaoti, idx, lst){
          datiScore += parseInt(xiaoti.xiaotiScore);
        });
        mbdt.datiScore = datiScore;
      };

      /**
       * 删除大题
       */
      $scope.deleteDaTi = function(idx){
        var targetMbdtId = mubanData.shuju.MUBANDATI[idx].MUBANDATI_ID,
            mubandatiLength, //定义一个模板大题的长度
            i, j, k;

        //删除试卷里面对应的数据
        shijuanData.shuju.SHIJUAN_TIMU = _.reject(shijuanData.shuju.SHIJUAN_TIMU, function(sjtm){
          return sjtm.MUBANDATI_ID == targetMbdtId;
        });

        //删除$scope.kmtxList中对应的元素,此处不删除的话，试题统计就会有问题
        for(j = 0; j < kmtxListLength; j++){
          if(targetMbdtId == $scope.kmtxList[j].TIXING_ID){
            $scope.kmtxList[j].itemsNum = 0;
            $scope.kmtxList[j].txPercentNum = '0%';
            break;
          }
        }

        //删除难度中对应的数据 nanduTempData nanduLength
        _.each(mubanData.shuju.MUBANDATI[idx].TIMUARR, function(dtm, idx, lst){
          _.each(nanduTempData, function(ndtd, ndidx, ndlst){
            if(ndtd.nanduId == dtm.NANDU_ID){
              var thisNaduLength = ndtd.nanduCount.length;
              for(k = 0; k < thisNaduLength; k++){
                if(ndtd.nanduCount[k] == dtm.TIMU_ID){
                  ndtd.nanduCount.splice(k, 1);
                }
              }
            }
          });
        });

        //加入试卷按钮和移除试卷按钮的显示和隐藏
        addOrRemoveItemToPaper(shijuanData.shuju.SHIJUAN_TIMU);

        mubanData.shuju.MUBANDATI.splice(idx, 1); //删除大图数据,放在最后
        mubandatiLength = mubanData.shuju.MUBANDATI.length; //给删除所选项后的模板大题的长度
        //统计每种题型的数量和百分比
        for(i = 0; i < mubandatiLength; i++){
          tixingStatistics(i, kmtxListLength);
        }
        //难度统计
        nanduPercent();
      };

      /**
       * 保存试卷
       */
      $scope.savePaper = function(){
        console.log(mubanData);
        console.log(shijuanData);
        var fenZhiIsNull = 0;
        shijuanData.shuju.SHIJUAN_TIMU = [];

        _.each(mubanData.shuju.MUBANDATI, function(dati, idx, lst){
          _.each(dati.TIMUARR, function(tm, subidx, lst){
            var  shijuanTimu = { //重组试卷数据
              TIMU_ID: '',
              MUBANDATI_ID: '',
              WEIZHIXUHAO: '',
              FENZHI: ''
            };
            shijuanTimu.MUBANDATI_ID = dati.MUBANDATI_ID; //模板大题的id
            shijuanTimu.TIMU_ID = tm.TIMU_ID; //试题的id
            shijuanTimu.WEIZHIXUHAO = subidx; //位置序号
            if(tm.xiaotiScore && tm.xiaotiScore > 0){
              shijuanTimu.FENZHI = tm.xiaotiScore; //得到小题的分数
            }
            else{
              shijuanTimu.FENZHI = '';
              fenZhiIsNull ++;
            }
            shijuanData.shuju.SHIJUAN_TIMU.push(shijuanTimu);
          });
        });
        if(!fenZhiIsNull){
          //提交数据
          if(shijuanData.shuju.SHIJUANMUBAN_ID && shijuanData.shuju.SHIJUAN_TIMU.length){
            $http.post(xgsjUrl, shijuanData).success(function(data){
              //console.log(data);
              if(data.result){
                alert('恭喜你！试卷保存成功！');
                $scope.clearData();
                $scope.showPaperList();
                $scope.shijuanyulanBtn = false; //试卷预览的按钮
                $scope.fangqibencizujuanBtn = false; //放弃本次组卷的按钮
                $scope.baocunshijuanBtn = false; //保存试卷的按钮
              }
            }).error(function(err){
              alert(err);
            });

            //更新数据模板
            mubanData.shuju.SHIJUANMUBAN_ID = shijuanData.shuju.SHIJUANMUBAN_ID;
            $http.post(xgmbUrl, mubanData).success(function(data){
              if(data.result){
                $scope.clearData();
              }
            }).error(function(err){
              alert(err);
            });
          }
          else{
            alert('请检查试卷的完整性！');
          }
        }
        else{
          alert('每小题的分数不能为空！请给每个小题一个分数！');
        }
      };

      /**
       * 删除临时模板
       */
      var deleteTempTemp = function(){
        deletelsmbData.muban_id = $rootScope.session.lsmb_id;
        if(deletelsmbData.muban_id.length){
          $http.post(deletelsmbUrl, deletelsmbData).success(function(data){
            console.log(data);
            if(data.result){
              $rootScope.session.lsmb_id = [];
              deletelsmbData.muban_id = [];
              shijuanData.shuju.SHIJUANMUBAN_ID = ''; //清空试卷模板id
            }
          }).error(function(err){
            alert(err);
          });
        }
      };

      /**
       * 清除试卷、模板、难度、题型的数据
       */
      $scope.clearData = function(){
        deleteTempTemp();
        mubanData.shuju.MUBANDATI = []; //清除模板中试题的临时数据
        shijuanData.shuju.SHIJUAN_TIMU = []; //清除试卷中的数据
        shijuanData.shuju.SHIJUANMINGCHENG = ''; //试卷名称重置
        shijuanData.shuju.FUBIAOTI = ''; //试卷副标题重置
        mubanData.shuju.ZONGDAOYU = ''; //试卷模板总导语重置
        _.each($scope.nanduTempData, function(ndkmtx, idx, lst){ //清除难度的数据
            ndkmtx.nanduCount = [];
            ndkmtx.ndPercentNum = '0%';
          return ndkmtx;
        });
        _.each($scope.kmtxList, function(tjkmtx, idx, lst){ //清除科目题型的统计数据
            tjkmtx.itemsNum = 0;
            tjkmtx.txPercentNum = '0%';
            return tjkmtx;
        });
        $scope.selectTestStr = ''; //清除试题加入和移除按钮
        $scope.backToZjHome(); //返回选择手动和自动组卷页面
        $scope.shijuanyulanBtn = false; //试卷预览的按钮
        $scope.fangqibencizujuanBtn = false; //放弃本次组卷的按钮
        $scope.baocunshijuanBtn = false; //保存试卷的按钮
      };

      /**
       * 查看试卷列表
       */
      $scope.showPaperList = function(){
        $scope.clearData();
        $http.get(qryCxsjlbUrl).success(function(data){
          if(data.length){
            $scope.paperListData = data;
            $scope.totalSelectedItmes = 0; //已选试题的总数量
            $scope.txTpl = 'views/partials/paperList.html'; //加载试卷列表模板
          }
        }).error(function(err){
          alert(err);
        });
      };

      /**
       * 查看试卷详情
       */
      $scope.showPaperDetail = function(sjId){
        var qryPaperDetailUrl = qryPaperDetailUrlBase + sjId;
        mubanData.shuju.MUBANDATI = [];
        shijuanData.shuju.SHIJUAN_TIMU = [];

        $http.get(qryPaperDetailUrl).success(function(data){
          if(!data.error){
            //给临时模板赋值
            mubanData.shuju.SHIJUANMUBAN_ID = data.MUBAN.SHIJUANMUBAN_ID; //模板id
            mubanData.shuju.MUBANMINGCHENG = data.MUBAN.MUBANMINGCHENG; //模板名称
            mubanData.shuju.ZONGDAOYU = data.MUBAN.ZONGDAOYU; //总导语
//            mubanData.shuju.MUBANDATI = data.MUBANDATI; //模板大题数组
            //给试卷赋值
            shijuanData.shuju.SHIJUAN_ID = data.SHIJUAN.SHIJUAN_ID; //试卷id
            shijuanData.shuju.SHIJUANMINGCHENG = data.SHIJUAN.SHIJUANMINGCHENG; //试卷名称
            shijuanData.shuju.FUBIAOTI = data.SHIJUAN.FUBIAOTI; //副标题
            shijuanData.shuju.SHIJUANMUBAN_ID = data.SHIJUAN.SHIJUANMUBAN_ID; //试卷模板id

            //将模板大题赋值到模板里面
            _.each(data.MUBANDATI, function(mbdt, indx, lst){
              mbdt.TIMUARR = []; //自己添加的数组
              mbdt.datiScore = 0; //自己定义此大题的分数
              mubanData.shuju.MUBANDATI.push(mbdt);
            });

            var mbdtdLength = mubanData.shuju.MUBANDATI.length;//模板大题的长度

            //将试卷详情放入临时模板的数组中
            _.each(data.TIMU, function(tm, indx, lst){
              // SHIJUAN_TIMU里的元素
              var sjtm = {
                TIMU_ID: '',
                MUBANDATI_ID: '',
                WEIZHIXUHAO: '',
                FENZHI: ''
              };

              //将本题加入试卷
              sjtm.TIMU_ID = tm.TIMU_ID;
              sjtm.MUBANDATI_ID = tm.MUBANDATI_ID;
              sjtm.WEIZHIXUHAO = tm.WEIZHIXUHAO;
              sjtm.FENZHI = tm.FENZHI;
              shijuanData.shuju.SHIJUAN_TIMU.push(sjtm);

              //将此题加入模板
              for(var i = 0; i < mbdtdLength; i++){
                //将题加入到临时模板
                if(tm.MUBANDATI_ID == mubanData.shuju.MUBANDATI[i].MUBANDATI_ID){
                  tm.DETAIL.xiaotiScore = tm.FENZHI;
                  mubanData.shuju.MUBANDATI[i].TIMUARR.push(tm.DETAIL);
                  mubanData.shuju.MUBANDATI[i].datiScore += tm.FENZHI;
                }
                //统计每种题型的数量和百分比
                tixingStatistics(i, kmtxListLength);
              }

              //难度统计  nanduTempData NANDU_ID
              for(var j = 0; j < nanduLength; j++){
                if(nanduTempData[j].nanduId == tm.DETAIL.NANDU_ID){
                  nanduTempData[j].nanduCount.push(tm.TIMU_ID);
                }
              }
            });
            nanduPercent(); //难度统计
            addOrRemoveItemToPaper(shijuanData.shuju.SHIJUAN_TIMU); //添加和删除按钮
            $scope.shijuanPreview(); //试卷预览
            $scope.shijuanyulanBtn = true; //试卷预览的按钮
            $scope.fangqibencizujuanBtn = true; //放弃本次组卷的按钮
            $scope.baocunshijuanBtn = true; //保存试卷的按钮
          }
        }).error(function(err){
          alert(err);
        });
      };

      /**
       * 当离开本页的时候触发事件，删除无用的临时模板
       */
      $scope.$on('$destroy', function () {
        var nextPath = $location.$$path,
            myInterval = setInterval(1000);
        deletelsmbData.muban_id = $rootScope.session.lsmb_id;
        if(deletelsmbData.muban_id.length){
          $http.post(deletelsmbUrl, deletelsmbData).success(function(data){
            if(data.result){
              $rootScope.session.lsmb_id = [];
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
