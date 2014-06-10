define(['jquery', 'underscore', 'angular', 'config'],
  function ($, _, angular, config) { // 001
    'use strict';
    angular.module('kaoshiApp.controllers.ZujuanCtrl', [])
      .controller('ZujuanCtrl', ['$rootScope', '$scope', '$location', '$http', 'urlRedirect', '$q', '$window','$document',
        function ($rootScope, $scope, $location, $http, urlRedirect, $q, $window, $document) { // 002
          /**
           * 操作title、、
           */
          $rootScope.pageName = "组卷"; //page title
          $rootScope.dashboard_shown = true;
          $rootScope.session.lsmb_id = []; //存放临时模板id的数组
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
            sjlbIdArrRev = [], //存放所有试卷ID的数组
            pageArr = [], //根据得到的试题数据定义一个分页数组
            paperPageArr = [], //定义试卷页码数组
            totalPage, //符合条件的试题数据一共有多少页
            totalPaperPage,//符合条件的试卷一共有多少页
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
              '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&shijuanid=',//查询试卷列表url
            paperDetailData, //定义一个存放试卷详情的字段，用于保存试卷详情用于生成答题卡
            paperDetailId, //用来存放所选试卷的id
            paperDetailName, //用来存放所选试卷的名称
            zidongzujuan = baseMtAPIUrl + 'zidongzujuan', //自动组卷的url
            autoMakePaperData = {
              token: token,
              caozuoyuan: caozuoyuan,
              jigouid: jigouid,
              lingyuid: lingyuid,
              shuju: {
                NANDU: '',
                ZHISHIDIAN: [],
                TIXING: []
              }
            }, //自动组卷的数据格式
            saveDaTiKaUrl = baseMtAPIUrl + 'make_datika', //保存答题卡的url
            qryShiJuanGaiYaoBase = baseMtAPIUrl + 'chaxun_shijuangaiyao?token=' + token + '&caozuoyuan=' + caozuoyuan +
              '&jigouid=' + jigouid + '&lingyuid=' + lingyuid + '&shijuanid=', //查询试卷概要的基础URL
            getUserNameBase = baseRzAPIUrl + 'get_user_name?token=' + token + '&uid='; //得到用户名的URL


          /**
           * 初始化是DOM元素的隐藏和显示//
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
          $scope.shijuan_edit = false; //试卷编辑
          $scope.tiXingNameArr = config.tiXingNameArr; //题型名称数组
          $scope.txSelectenIdx = 0; //选择题型的索引
          $scope.ndSelectenIdx = 0; //选择难度的索引
          $scope.isSavePaperConfirm = false; //保存试卷前的确认
          $scope.showBackToPaperListBtn = false; //加载组卷页面是，返回试卷列表页面隐藏
          $scope.addMoreTiMuBtn = false; //添加更多试题的按钮

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
           * 查询科目题型(chaxun_kemu_tixing)
           */
          $http.get(qryKmTx + lingyuid).success(function(kmtx){ //页面加载的时候调用科目题型
            if(kmtx){
              $scope.kmtxList = _.each(kmtx, function(txdata, idx, lst){
                txdata.itemsNum = 0;
              });
              kmtxListLength = kmtx.length; //科目题型的长度
            }
            else{
              alert('获取查询科目题型失败！');
            }
          });

          /**
           * kmtx.datiScore的值清零
           */
          var restoreKmtxDtscore = function(){
            _.each($scope.kmtxList, function(kmtx, idx, lst){
              kmtx.datiScore = 0;
            });
          };

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
           * 难度选择时的拖拽
           */
          $scope.resize = function(idx){
            //初始化参数
            var dragBtn = 'sliderBtn' + idx,
              dragItem = 'sliderItem' + idx,
              showBox = 'coefft' + idx,
              greenBox = 'sliderItemInner' + idx,
              el = document.getElementById(dragBtn),
              els = document.getElementById(dragItem).style,
              x = 0, //鼠标的 X 和 Y 轴坐标
              dragItemClass = '#' + dragItem, //得到需要元素的id
              showBoxClass = '.' + showBox, //时时显示难度的容器
              greenBoxClass = '.' + greenBox, //绿色条的长度
              minWidth = 0,
              maxWidth = 220,
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
              }
              if(subDbWidth >= minWidth - 1 && subDbWidth <= maxWidth + 4){
                els.width = e.clientX - x + 'px';
              }
              if(subDbWidth > maxWidth + 4){
                els.width = maxWidth + 'px';
                $(document).unbind('mousemove', mouseMove);
              }
              distNum = $(greenBoxClass).width()/maxWidth; //得到难度系数
              $(showBoxClass).html(distNum.toFixed(2));
              if($scope.isAutoMakePaperDetailSetShow){
                $scope.ampKmtx[idx].tmNanDu = distNum.toFixed(2) ? distNum.toFixed(2) : 0.5; //每种题型设置个难度
                $scope.ampKmtx[idx].dagangArr = selectZsd;
              }
              else{
                autoMakePaperData.shuju.NANDU = distNum.toFixed(2) ? distNum.toFixed(2) : 0.5; //为自动组卷难度赋值
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
                $(document).unbind('mousemove', mouseMove).unbind('mouseup', mouseUp)
                );
            }
          };

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
            $scope.loadingImgShow = true; //paper_hand_form.html
            var qrytimuliebiao = qrytimuliebiaoBase + '&timuleixing_id=' + timuleixing_id +
              '&nandu_id=' + nandu_id + '&zhishidian_id=' + zhishidian_id; //查询题目列表的url
            tiMuIdArr = [];
            pageArr = [];

            $http.get(qrytimuliebiao).success(function(data){
              if(data.length){
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
              }
              else{
                alert('没有相关试题信息！');
                $scope.loadingImgShow = false; //paper_hand_form.html
              }
            })
            .error(function(err){
              console.log(err);
            });
          };

          /**
           * 查询题目详情的分页代码
           */
          $scope.getThisPageData = function(pg){
            $scope.loadingImgShow = true; //paper_hand_form.html
            var qrytimuxiangqing,
              pgNum = pg - 1,
              timu_id,
              currentPage = pgNum ? pgNum : 0,
              userIdArr = []; //存放user id的数组

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
                _.each(data, function(tm, idx, lst){
                  userIdArr.push(tm.CHUANGJIANREN_UID);
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
                    $scope.loadingImgShow = false; //paper_hand_form.html
                    $scope.timudetails = data;
                    $scope.caozuoyuan = caozuoyuan;
                    timudetails = data;
                  }
                  else{
                    $scope.timudetails = null;
                    alert('查询创建人名称失败！');
                    $scope.loadingImgShow = false; //paper_hand_form.html
                  }
                });
              }
              else{
                alert('没有相关的题目！');
                $scope.loadingImgShow = false; //paper_hand_form.html
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
              mubandatiItem.XUHAO = kmtx.TIXING_ID;
              mubanData.shuju.MUBANDATI.push(mubandatiItem);
              mbdt_data.push(mubandatiItem);
              // mbdtdLength ++; //得到科目题型的长度
            });

            $http.post(xgmbUrl, mubanData).success(function(data){
              if(data.result){
                $rootScope.session.lsmb_id.push(data.id); //新创建的临时模板id

                shijuanData.shuju.SHIJUANMUBAN_ID = data.id; //将创建的临时试卷模板id赋值给试卷的试卷模板id
                deferred.resolve();
              }
            }).error(function(err){
              alert(err);
              deferred.reject();
            });

            return deferred.promise;
          };

          /**
           * 显示试题列表 //
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
            $scope.shijuanyulanBtn = true;
            //查询试题的函数
            $scope.getTiXingId(txid);
            $scope.txSelectenIdx = txid ? txid : 0;
            $scope.txTpl = 'views/partials/paper_hand_form.html';
          };

          /**
           * 点击添加新试卷，显示组卷列表
           */
          $scope.showZuJuanPage = function(){
            $scope.showBackToPaperListBtn = true;
            $scope.txTpl = 'views/partials/paper_preview.html';
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
           * 自动组卷 autoMakePaperData
           */
          var autoMakePaperKmtx;
          $scope.autoMakePaper = function(){
            var promise = getShiJuanMuBanData(); //保存试卷模板成功以后
            promise.then(function(){
              $scope.isAutoMakePaperDetailSetShow = false; //自动组卷加载的时候，详细设置隐藏
              autoMakePaperKmtx = $scope.kmtxList;
              _.each(autoMakePaperKmtx, function(aKmtx, idx, lst){
                aKmtx.tmNum = '';
                aKmtx.tmNanDu = '';
                aKmtx.dagangArr = [];
              });
              $scope.ampKmtx = autoMakePaperKmtx;
              $('.popupWrap').css('left','-260px').animate({
                left: '341px'
              }, 500, function() {

              });
            });

          };

          /**
           * 提交自动数据的参数,难度为整张试卷难度//
           */
          var countnum, txtmLength;
          $scope.submitAutoPaperData = function(){
            $scope.loadingImgShow = true;  //paper_preview.html loading
            countnum = 0;
            autoMakePaperData.shuju.TIXING = [];
            autoMakePaperData.shuju.ZHISHIDIAN = [];
            _.each($scope.ampKmtx, function(tpTx, idx, lst){
              var tixing = {TIXING_ID: '', COUNT: ''};
              if(tpTx.tmNum >= 1){
                tixing.TIXING_ID = tpTx.TIXING_ID;
                tixing.COUNT = tpTx.tmNum;
                autoMakePaperData.shuju.TIXING.push(tixing);
              }
            });
            txtmLength = autoMakePaperData.shuju.TIXING.length;
            autoMakePaperData.shuju.ZHISHIDIAN = selectZsd;
            autoMakePaperData.shuju.NANDU = autoMakePaperData.shuju.NANDU ? autoMakePaperData.shuju.NANDU : 0.5;
            if(autoMakePaperData.shuju.NANDU){
              if(autoMakePaperData.shuju.ZHISHIDIAN){
                if(autoMakePaperData.shuju.TIXING.length){
                  $http.post(zidongzujuan, autoMakePaperData).success(function(sjData){
                    if(sjData.error){
                      alert(sjData.error);
                    }
                    else{
                      console.log(sjData);
                      var mbdtdLength = mubanData.shuju.MUBANDATI.length;//模板大题的长度
                      //将自动组卷生成的数据，添加到试卷模板中 TIXING_TIMU  MUBANDATI_ID
                      //组卷成功后显示试题的代码

                      _.each(sjData.TIXING_TIMU, function(value, key, list){
                        for(var i = 0; i < mbdtdLength; i++){
                          if(mubanData.shuju.MUBANDATI[i].MUBANDATI_ID == key){
                            //将本题加入试卷
                            _.each(value, function(tmId, idx, list){
                              var sjtm = {
                                TIMU_ID: '',
                                MUBANDATI_ID: key,
                                WEIZHIXUHAO: idx,
                                FENZHI: ''
                              };
                              sjtm.TIMU_ID = tmId;
                              shijuanData.shuju.SHIJUAN_TIMU.push(sjtm);
                            });

                            //操作模板
                            (function(index, tiMuIds){
                              var qrytimuxiangqing = qrytimuxiangqingBase + '&timu_id=' + tiMuIds.toString(); //查询详情url
                              $http.get(qrytimuxiangqing).success(function(data){
                                if(data.length){
                                  countnum ++ ;
                                  mubanData.shuju.MUBANDATI[index].TIMUARR = data;
                                  _.each(data, function(tm, idx, lst){
                                    //难度统计  nanduTempData NANDU_ID
                                    for(var j = 0; j < nanduLength; j++){
                                      if(nanduTempData[j].nanduId == tm.NANDU_ID){
                                        nanduTempData[j].nanduCount.push(tm.TIMU_ID);
                                      }
                                    }
                                  });
                                  //统计每种题型的数量和百分比
                                  tixingStatistics(index, kmtxListLength);
                                  nanduPercent(); //难度统计

                                  //判读是否执行完成
                                  if(countnum == txtmLength){
                                    $scope.fangqibencizujuanBtn = true; //放弃本次组卷的按钮
                                    $scope.baocunshijuanBtn = true; //保存试卷的按钮
                                    $scope.loadingImgShow = false;  //paper_preview.html loading
                                    $scope.shijuanPreview();
                                  }
                                }
                                else{
                                  $scope.timudetails = null;
                                }
                              }).error(function(err){
                                console.log(err);
                              });
                            })(i, value);

                            addOrRemoveItemToPaper(shijuanData.shuju.SHIJUAN_TIMU); //添加和删除按钮

                            //二级控制面板上的分数统计
                            restoreKmtxDtscore();
                            _.each(mubanData.shuju.MUBANDATI, function(mbdt, indx, lst){ //再给kmtx.datiScore赋值
                              _.each($scope.kmtxList, function(kmtx, idx, lst){
                                if(kmtx.TIXING_ID == mbdt.MUBANDATI_ID){
                                  kmtx.datiScore = mbdt.datiScore;
                                }
                              });
                            });
                          }
                        }
                      });
                    }
                  });
                }
                else{
                  alert('请您选择一个题型呗！');
                }
              }
              else{
                alert('请高抬贵手选择一个知识点吧！');
              }
            }
            else{
              alert('请给难度一个数值吧！');
            }
          };

          /**
           * 提交自动数据的参数,单个题型难度设置
           */
          $scope.submitDistAutoPaperData = function(){
            var tiXingLen = $scope.ampKmtx.length,
              countnum = 0,
              tiXingLenCount = 0, //定义一个变量用了判断当所有题型长度为空是给出提示
              distAutoMakePaperDataArr = [],
              times = 0,
              haveTmNumLen = 0,
              tmIdsChoLen = 0, //得到符合条件自动组卷的数据长度
              tiXingTiMuObj = {}, //定义一个空对象，用来临时存放返回的题型题目
              tiXingTiMuArr = [],
              mbdtdLength = mubanData.shuju.MUBANDATI.length;//模板大题的长度
            _.each($scope.ampKmtx, function(aktm, idx, lst){
              if(aktm.tmNum){
                haveTmNumLen ++;
              }
            });
            //得到题型数量和难度的数组
            for(var i = 0; i < tiXingLen; i++){
              var distAutoMakePaperData = {
                token: token,
                caozuoyuan: caozuoyuan,
                jigouid: jigouid,
                lingyuid: lingyuid,
                shuju:{}
              },
              subShuJu = {
                NANDU: $scope.ampKmtx[i].tmNanDu ? $scope.ampKmtx[i].tmNanDu : 0.5,
                ZHISHIDIAN: [],
                TIXING: [{TIXING_ID: '', COUNT: ''}]
              };
              if($scope.ampKmtx[i].tmNum){
                tiXingLenCount ++;
                subShuJu.ZHISHIDIAN = $scope.ampKmtx[i].dagangArr > 0 ? $scope.ampKmtx[i].dagangArr : selectZsd;
                if(subShuJu.ZHISHIDIAN){
                  subShuJu.TIXING[0].TIXING_ID = $scope.ampKmtx[i].TIXING_ID;
                  subShuJu.TIXING[0].COUNT = $scope.ampKmtx[i].tmNum;
                  distAutoMakePaperData.shuju = subShuJu;
                  distAutoMakePaperDataArr.push(distAutoMakePaperData);
                }
                else{
                  alert('请选择知识点！');
                  break;
                }
              }
            }
            //得到正确的题目id和题目详情
            if(tiXingLenCount){
              tmIdsChoLen = distAutoMakePaperDataArr.length; //得到符合条件自动组卷的数据长度
              //得到正确的题目id
              var getIdsFun = function(){
                if(times < tmIdsChoLen){
                  $http.post(zidongzujuan, distAutoMakePaperDataArr[times]).success(function(data){
                    if(data.error){
                        alert(data.error);
                    }
                    else{
                      tiXingTiMuArr.push(data);
                      if(times == tmIdsChoLen -1){
                        //得到调用数据（object格式）
                        _.each(tiXingTiMuArr, function(txtma, idx, lst){
                          _.each(txtma.TIXING_TIMU, function(value, key, list){
                            tiXingTiMuObj[key] = value;
                          });
                        });
                        _.each(tiXingTiMuObj, function(value, key, list){
                          for(var k = 0; k < mbdtdLength; k++){
                            if(mubanData.shuju.MUBANDATI[k].MUBANDATI_ID == key){
                              //将本题加入试卷
                              _.each(value, function(tmId, idx, list){
                                var sjtm = {
                                  TIMU_ID: '',
                                  MUBANDATI_ID: key,
                                  WEIZHIXUHAO: idx,
                                  FENZHI: ''
                                };
                                sjtm.TIMU_ID = tmId;
                                shijuanData.shuju.SHIJUAN_TIMU.push(sjtm);
                              });

                              //得到具体的数据
                              (function(index, tiMuIds){
                                var qrytimuxiangqing = qrytimuxiangqingBase + '&timu_id=' + tiMuIds.toString(); //查询详情url
                                $http.get(qrytimuxiangqing).success(function(stdata){
                                  if(stdata.length){
                                    mubanData.shuju.MUBANDATI[index].TIMUARR = stdata;
                                    _.each(stdata, function(tm, idx, lst){
                                      //难度统计  nanduTempData NANDU_ID
                                      for(var j = 0; j < nanduLength; j++){
                                        if(nanduTempData[j].nanduId == tm.NANDU_ID){
                                          nanduTempData[j].nanduCount.push(tm.TIMU_ID);
                                        }
                                      }
                                    });
                                    //统计每种题型的数量和百分比
                                    tixingStatistics(index, kmtxListLength);
                                    nanduPercent(); //难度统计

                                    //判读是否执行完成
                                    if(countnum == tmIdsChoLen - 1){
                                      $scope.fangqibencizujuanBtn = true; //放弃本次组卷的按钮
                                      $scope.baocunshijuanBtn = true; //保存试卷的按钮
                                      $scope.shijuanPreview();
                                    }
                                    countnum ++ ;
                                  }
                                  else{
                                    $scope.timudetails = null;
                                  }
                                }).error(function(err){
                                  console.log(err);
                                });
                              })(k, value);

                              addOrRemoveItemToPaper(shijuanData.shuju.SHIJUAN_TIMU); //添加和删除按钮

                              //二级控制面板上的分数统计
                              restoreKmtxDtscore();
                              _.each(mubanData.shuju.MUBANDATI, function(mbdt, indx, lst){ //再给kmtx.datiScore赋值
                                _.each($scope.kmtxList, function(kmtx, idx, lst){
                                  if(kmtx.TIXING_ID == mbdt.MUBANDATI_ID){
                                    kmtx.datiScore = mbdt.datiScore;
                                  }
                                });
                              });
                            }
                          }
                        });
                      }
                      times ++;
                      getIdsFun();
                    }
                  });
                }
              };
              getIdsFun();
            }
            else{
              alert('请至少选择一种题型！');
            }

          };

          /**
           * 自动组卷详细设置//
           */
          $scope.autoMakePaperDetailSet = function(){
            $scope.isAutoMakePaperDetailSetShow = true;
          };

          /**
           * 自动组卷详细设置//
           */
          $scope.cancelAutoMakePaperDetailSet = function(){
            $scope.isAutoMakePaperDetailSetShow = false;
          };

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
            var sjtmItem = {
                TIMU_ID: '',
                MUBANDATI_ID: '',
                WEIZHIXUHAO: '',
                FENZHI: ''
              },
              mbdtdLength,
              ifMbdtIdIsExist, //新加的是试题的模板大题是否存在
              mubandatiItem = {
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
            if(!isChangeItem){ //添加试题时的代码
              //判断这道试题的大题存不存在
              ifMbdtIdIsExist = _.find(mubanData.shuju.MUBANDATI, function(mbdtItem){
                return mbdtItem.MUBANDATI_ID == tm.TIXING_ID;
              });

              if(ifMbdtIdIsExist){
                mbdtdLength = mubanData.shuju.MUBANDATI.length; //现有题目类型的长度
              }
              else{
                _.each($scope.kmtxList, function(kmtx, idx, lst){
                  if(kmtx.TIXING_ID == tm.TIXING_ID){
                    mubandatiItem.MUBANDATI_ID = tm.TIXING_ID;
                    mubandatiItem.DATIMINGCHENG = kmtx.TIXINGMINGCHENG;
                    mubandatiItem.XUHAO = tm.TIXING_ID;
                    mubanData.shuju.MUBANDATI.push(mubandatiItem);
                    mbdtdLength = mubanData.shuju.MUBANDATI.length; //现有题目类型的长度
                  }
                });
              }
              //将试题加入到对应的题目大题的数据中
              for(var i = 0; i < mbdtdLength; i++){
                //将题加入到mubanData数据中
                if(mubanData.shuju.MUBANDATI[i].MUBANDATI_ID == tm.TIXING_ID){ //将TIMULEIXING_ID换成TIXING_ID

                  tm.xiaotiScore = '';
                  mubanData.shuju.MUBANDATI[i].TIMUARR.push(tm);

                  //统计每种题型的数量和百分比
                  tixingStatistics(i, kmtxListLength);

                  //均分大题分数
                  $scope.divideDatiScore(mubanData.shuju.MUBANDATI[i]);
                }
              }
            }
            else{ //替换试题时的代码 cg_mbdt_idx, cg_timuId, cg_thisItem_idx
              mubanData.shuju.MUBANDATI[cg_mbdt_idx].TIMUARR.splice(cg_thisItem_idx, 1, tm);
              //从试卷中删除被替换的题目
              shijuanData.shuju.SHIJUAN_TIMU = _.reject(shijuanData.shuju.SHIJUAN_TIMU, function(sjtm){
                return sjtm.TIMU_ID == cg_timuId;
              });
              //从难度中删除要替换的题目
              _.each(nanduTempData, function(ndtd, idx, lst){
                ndtd.nanduCount = _.reject(ndtd.nanduCount, function(ndct){
                  return ndct == cg_timuId;
                });
              });
              //均分大题分数
              $scope.divideDatiScore(mubanData.shuju.MUBANDATI[cg_mbdt_idx]);
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

            //如果是替换试题，替换完成后，展示试卷列表
            if(isChangeItem){
              $scope.shijuanPreview(); //试卷预览
              isChangeItem = false; // 是否是题目替换重置
              cg_mbdt_idx = ''; // 需要更换的模板大题Id重置
              cg_timuId = ''; // 需要被更换的题目的Id重置
              cg_thisItem_idx = ''; // 需要被更换的题目的索引重置
              $scope.hideOrShowTixing = false; //如何是换一题，隐藏不必要的题型
            }

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
           * 试卷预览代码//
           */
          $scope.shijuanPreview = function(){
            var mbdtArr = []; //定义一个空的数组用来存放模板大题
            //数据为空的模板大题
            _.each(mubanData.shuju.MUBANDATI, function(mbdt, idx, lst){
              if(mbdt.TIMUARR.length){
                mbdtArr.push(mbdt);
              }
            });
            mubanData.shuju.MUBANDATI = mbdtArr;
            $scope.mubanData = mubanData;
            backToZjHomeFun();
            $scope.sjPreview = true;
            $scope.shijuanyulanBtn = false;
            $scope.addMoreTiMuBtn = true; //添加试卷按钮显示
          };

          /**
           * 均分大题的分值
           */
          $scope.divideDatiScore = function(mbdt){
            var datiTotalScore = mbdt.datiScore, //本大题总分
              datiItemNum = mbdt.TIMUARR.length, //得到本大题下的题目数量
              biLvVal = datiTotalScore/datiItemNum, //本大题总分/大题下的题目数量
              xiaotiAverageScore, //每小题的平均分数
              zeroLen = 0; //记录题目分值为0的个数
            if(biLvVal < 1){
              if(biLvVal == 0.5){
                xiaotiAverageScore = 0.5; //每小题的分数
                _.each(mbdt.TIMUARR, function(xiaoti, idx, lst){
                  xiaoti.xiaotiScore = xiaotiAverageScore;
                });
              }
              else{
                xiaotiAverageScore = 1; //每小题的分数
                _.each(mbdt.TIMUARR, function(xiaoti, idx, lst){
                  if( idx < datiTotalScore){
                    xiaoti.xiaotiScore = xiaotiAverageScore;
                  }
                  else{
                    xiaoti.xiaotiScore = 0;
                    zeroLen ++;
                  }
                });
//                if(zeroLen){
//                  alert('你设置的分数不合理！请检查！');
//                }
              }
            }
            else{
              xiaotiAverageScore = biLvVal.toFixed(0); //每小题的分数
              _.each(mbdt.TIMUARR, function(xiaoti, idx, lst){
                if(idx + 1 < mbdt.TIMUARR.length){
                  xiaoti.xiaotiScore = xiaotiAverageScore;
                  datiTotalScore -= xiaotiAverageScore;
                }
                if(idx +1 == mbdt.TIMUARR.length){ //给最后一小题赋值
                  xiaoti.xiaotiScore = datiTotalScore;
                }
              });
            }

          };

          /**
           * 有小题的到大题的分值
           */
          $scope.addXiaotiScore = function(mbdt){
            var datiScore = 0;
            _.each(mbdt.TIMUARR, function(xiaoti, idx, lst){
              datiScore += parseFloat(xiaoti.xiaotiScore);
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
                $scope.kmtxList[j].datiScore = 0;//删除此大题在二级控制面版上的大题分数
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
           * 从试题统计中删除大题
           */
          $scope.deleteDaTiArr = function(mbdtid){
            var mbdtIds = _.map(mubanData.shuju.MUBANDATI, function(mbdt){ return mbdt.MUBANDATI_ID;}),
                idx = _.indexOf(mbdtIds, mbdtid);
            $scope.deleteDaTi(idx);
          };
          /**
           * 编辑试卷信息
           */
          $scope.editMuBanDaTiNameAndScore = function(styl){
            var focusTarget = '.' + styl;
            $scope.shijuan_edit = true;
            if($scope.shijuan_edit){
              $(focusTarget).prop('autofocus', 'true');
            }
          };

          /**
           * 取消编辑试卷信息
           */
          $scope.cancelEditPaper = function(){
            $scope.shijuan_edit = false;
          };

          /**
           * 保存编辑试卷信息
           */
          $scope.saveEditPaper = function(){
            _.each(mubanData.shuju.MUBANDATI, function(mbdt, indx, lst){
              //均分大题分数
              $scope.divideDatiScore(mbdt);
              //二级控制面板上的分数统计
              _.each($scope.kmtxList, function(kmtx, idx, lst){
                if(kmtx.TIXING_ID == mbdt.MUBANDATI_ID){
                 kmtx.datiScore = mbdt.datiScore;
                }
              });
            });
            //试卷编辑层隐藏
            $scope.shijuan_edit = false;
          };

          /**
           * 更换小题
           */
          var isChangeItem, cg_mbdt_idx, cg_timuId, cg_thisItem_idx;
          $scope.changeItem = function(mbdtId, timuId){
            $scope.showTestList(mbdtId); //显示试题列表
            isChangeItem = true; // 是否是题目替换
            cg_mbdt_idx = this.$parent.$index; // 需要更换的模板大题Id
            cg_timuId = timuId; // 需要被更换的题目的Id
            cg_thisItem_idx = this.$index; // 需要被更换的题目的索引
            $scope.hideOrShowTixing = true; //如何是换一题，隐藏不必要的题型
          };

          /**
           * 保存试卷前的确认
           */
          $scope.savePaperConfirm = function(){
            console.log(mubanData);
            var nanDuArr = {
                paperNanDu: '',
                daTiNanDuArr:[]
              },
              fenZhiIsNull = 0,
              muBanDaTiLen = mubanData.shuju.MUBANDATI.length,
              ppNanDuAdd = 0; //定义一个试卷难度相加字段
            shijuanData.shuju.SHIJUAN_TIMU = [];
            $scope.paperScore = 0;

            _.each(mubanData.shuju.MUBANDATI, function(dati, idx, lst){
              $scope.paperScore += parseInt(dati.datiScore); //将试卷分数转换为整形
              var nanDuObj = { //定义一个存放难度object对象
                  mubandati_id: dati.MUBANDATI_ID,
                  nanDu: ''
                },
                thisDaTiTiMuArrLen = dati.TIMUARR.length, //本大题的题目长度
                dtNanDuAdd = 0; //定义一个难度求和的字段
              _.each(dati.TIMUARR, function(tm, subidx, lst){
                //统计小题难度
                dtNanDuAdd += parseInt(tm.NANDU_ID)/5;
                if(subidx == thisDaTiTiMuArrLen - 1 ){
                  nanDuObj.nanDu = (dtNanDuAdd/thisDaTiTiMuArrLen).toFixed(2);
                  ppNanDuAdd += dtNanDuAdd/thisDaTiTiMuArrLen;
                  nanDuArr.daTiNanDuArr.push(nanDuObj);
                }
                //重组试卷数据
                var  shijuanTimu = {
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
              if(idx == muBanDaTiLen - 1){
                nanDuArr.paperNanDu = (ppNanDuAdd/muBanDaTiLen).toFixed(2);
                shijuanData.shuju.NANDU = nanDuArr;
              }
            });
            if(shijuanData.shuju.SHIJUANMINGCHENG){ //11 检查试卷名称

              if(!fenZhiIsNull){// 22 检查每小题是否有分值 开始
                //提交数据
                if(shijuanData.shuju.SHIJUANMUBAN_ID && shijuanData.shuju.SHIJUAN_TIMU.length){ // 33
                  $scope.isSavePaperConfirm = true;
                  console.log(shijuanData);
                }
                else{ //33
                  alert('请检查试卷的完整性！');
                }
              }
              else{ // 22 检查每小题是否有分值 结束
                alert('每小题的分数不能为空！请给每个小题一个分数！');
              }
            }
            else{ //11 检查试卷名称
              alert('给我起个名字吧 ^ _ ^');
            }
          };

          /**
           * 保存试卷
           */
          $scope.savePaper = function(){
            $http.post(xgsjUrl, shijuanData).success(function(data){
              if(data.result){
                //更新数据模板
                var lsmbIdLenght = $rootScope.session.lsmb_id.length;
                mubanData.shuju.SHIJUANMUBAN_ID = shijuanData.shuju.SHIJUANMUBAN_ID;
                $http.post(xgmbUrl, mubanData).success(function(data){
                  if(data.result){
                    for(var i = 0; i < lsmbIdLenght; i++){
                      if($rootScope.session.lsmb_id[i] == shijuanData.shuju.SHIJUANMUBAN_ID){
                        $rootScope.session.lsmb_id.splice(i, 1);
                        deleteTempTemp(); //删除没用的其他目标
                      }
                    }
                    $scope.showPaperList();
                    $scope.shijuanyulanBtn = false; //试卷预览的按钮
                    $scope.fangqibencizujuanBtn = false; //放弃本次组卷的按钮
                    $scope.baocunshijuanBtn = false; //保存试卷的按钮
                    $scope.isSavePaperConfirm = false;
                    $scope.addMoreTiMuBtn = false; //添加试卷按钮隐藏
                    alert('恭喜你！试卷保存成功！');
                  }
                }).error(function(err){
                  alert(err);
                });

              }

            }).error(function(err){
              alert(err);
            });
          };

          /**
           * 取消保存试卷
           */
          $scope.cancelSavePaper = function(){
            $scope.isSavePaperConfirm = false;
          };

          /**
           * 删除临时模板
           */
          var deleteTempTemp = function(){
            deletelsmbData.muban_id = $rootScope.session.lsmb_id;
            if(deletelsmbData.muban_id.length){
              $http.post(deletelsmbUrl, deletelsmbData).success(function(data){
                if(data.result){
                  $rootScope.session.lsmb_id = [];
                  deletelsmbData.muban_id = [];
                  mubanData.shuju.SHIJUANMUBAN_ID = ''; //清空试卷模板id
                }
              }).error(function(err){
                alert(err);
              });
            }
            else{
              mubanData.shuju.SHIJUANMUBAN_ID = ''; //清空试卷模板id
            }
          };

          /**
           * 清除试卷、模板、难度、题型的数据
           */
          var clearData = function(){
            mubanData.shuju.MUBANDATI = []; //清除模板中试题的临时数据
            shijuanData.shuju.SHIJUAN_TIMU = []; //清除试卷中的数据
            shijuanData.shuju.SHIJUANMINGCHENG = ''; //试卷名称重置
            shijuanData.shuju.FUBIAOTI = ''; //试卷副标题重置
            shijuanData.shuju.SHIJUANMUBAN_ID = ''; //删除试卷中的试卷模板id
            shijuanData.shuju.SHIJUAN_ID = ''; //清楚试卷id
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
           * 放弃组卷
           */
          $scope.dropMakePaper = function(){
            $scope.totalSelectedItmes = 0; //已选试题的总数量
            $scope.addMoreTiMuBtn = false; //添加试卷按钮隐藏
            deleteTempTemp();
            clearData();
            restoreKmtxDtscore();
          };

          /**
           *  查询试卷列表的函数，组卷页面加载时，查询数据
           */
          var isFirstQryPaperList;
          var qryShiJuanList = function(){
            $scope.loadingImgShow = true;  //paperList.html loading
            paperPageArr = [];
            sjlbIdArrRev = []; //反转试卷列表id
            $http.get(qryCxsjlbUrl).success(function(sjlb){
              if(sjlb.length){
                $scope.papertListIds = sjlb;
                isFirstQryPaperList = true;
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
                if(!isDeletePaper){
                  $scope.getThisSjgyPageData();
                  isDeletePaper = false;
                }
              }
              else{
                alert('没有相关试卷信息！');
                $scope.loadingImgShow = false;  //paperList.html loading
              }
            }).error(function(err){
              alert(err);
            });
          };
          qryShiJuanList();

          /**
           * 查看试卷列表
           */
          $scope.showPaperList = function(isBackToPaperList){
            deleteTempTemp();
            clearData();
            restoreKmtxDtscore();
            qryShiJuanList(isBackToPaperList);
          };

          /**
           * 查询试卷概要的分页代码
           */
          $scope.getThisSjgyPageData = function(pg){
            $scope.loadingImgShow = true;  //paperList.html loading
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
                    $scope.loadingImgShow = false;  //paperList.html loading
                    $scope.paperListData = sjlbgy;
                    if(isFirstQryPaperList){
                      $scope.totalSelectedItmes = 0; //已选试题的总数量
                      $scope.showBackToMakePaperBtn = true;
                      $scope.showBackToPaperListBtn = false; //返回试卷列表
                      $scope.txTpl = 'views/partials/paperList.html'; //加载试卷列表模板
                      isFirstQryPaperList = false;
                    }
                  }
                  else{
                    alert('查询创建人名称失败！');
                    $scope.loadingImgShow = false;  //paperList.html loading
                  }
                });
              }
              else{
                alert('很遗憾！没有相关数据！');
                $scope.loadingImgShow = false;  //paperList.html loading
              }
            }).error(function(err){
              console.log(err);
            });
          };

          /**
           * 查看试卷详情
           */
          $scope.showPaperDetail = function(sjId){
            var qryPaperDetailUrl = qryPaperDetailUrlBase + sjId;
            mubanData.shuju.MUBANDATI = [];
            shijuanData.shuju.SHIJUAN_TIMU = [];
            paperDetailData = '';
            paperDetailId = ''; //用来存放所选试卷的id
            paperDetailName = ''; //用来存放所选试卷的名称

            $http.get(qryPaperDetailUrl).success(function(data){
              if(!data.error){
                paperDetailId = data.SHIJUAN.SHIJUAN_ID; //用来存放所选试卷的id
                paperDetailName =  data.SHIJUAN.SHIJUANMINGCHENG; //用来存放所选试卷的名称
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

                //给答题卡用到的数据赋值
//                daTiKaData.shiJuanId = data.SHIJUAN.SHIJUAN_ID;

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

                //二级控制面板上的分数统计
                restoreKmtxDtscore();
                _.each(mubanData.shuju.MUBANDATI, function(mbdt, indx, lst){ //再给kmtx.datiScore赋值
                  _.each($scope.kmtxList, function(kmtx, idx, lst){
                    if(kmtx.TIXING_ID == mbdt.MUBANDATI_ID){
                      kmtx.datiScore = mbdt.datiScore;
                    }
                  });
                });
                $scope.shijuanPreview(); //试卷预览
                $scope.shijuanyulanBtn = false; //试卷预览的按钮
                $scope.fangqibencizujuanBtn = true; //放弃本次组卷的按钮
                $scope.baocunshijuanBtn = true; //保存试卷的按钮
                paperDetailData = mubanData; //用于答题卡赋值
              }
            }).error(function(err){
              alert(err);
            });
          };

          /**
           * 删除试卷 xgsjUrl
           */
          var isDeletePaper;
          $scope.deleteThisPaper = function(paperId, idx){
            var deleteDate = {
              token: token,
              caozuoyuan: caozuoyuan,
              jigouid: jigouid,
              lingyuid: lingyuid,
              shuju:{
                SHIJUAN_ID: paperId,
                ZHUANGTAI: -1
              }
            };
            var alertCon = confirm("确定要删除次试卷吗？");
            if(alertCon){
              $http.post(xgsjUrl, deleteDate).success(function(data){
                if(data.result){
                  $scope.paperListData.splice(idx, 1);
                  isDeletePaper = true;
                  qryShiJuanList();
                  alert('删除成功！');
                }
              });
            }
          };

          /**
           * 上下移动题目 //周
           */
          $scope.moveTM = function(tm, num){
            var dati = _.where(mubanData.shuju.MUBANDATI, { MUBANDATI_ID: tm.TIMULEIXING_ID })[0],
                tmIds = _.map(dati.TIMUARR, function(t){ return t.TIMU_ID;}),
                index = _.indexOf(tmIds, tm.TIMU_ID),
                toIndex = index + num,
                item = dati.TIMUARR[index];
            if(num>0){
              dati.TIMUARR.splice(toIndex + 1, 0, item);
              dati.TIMUARR.splice(index, 1);
            }
            else{
              dati.TIMUARR.splice(index, 1);
              dati.TIMUARR.splice(toIndex, 0, item);
            }
          };

          /**
           * 生成答题卡 paperDetailData
           */
          var allTiMuForCard; //存放所有需要放到答题卡中的试题
          $scope.makeDaTiKa = function(){
            var answerCards = [], //存放答题卡的数组
              yushu, //余数
              intAnswerCardLen, //allTiMuForCard除以3得到的整数
              answerCardLen, //答题卡长度, 用allTiMuForCard除以3得到的数据
              idxCount = 0;
            allTiMuForCard = [];
            //将所有需要答题卡的试题全部添加到allTiMuForCard中
            _.each(paperDetailData.shuju.MUBANDATI, function(mbdt, idx, lst){
              if(mbdt.MUBANDATI_ID > 8){
                _.each(mbdt.TIMUARR, function(tma, subIdx, lst){
                  var textCont = mbdt.DATIMINGCHENG + '题' + '第' + (subIdx + 1) + '题',
                    tiMuInfo = {
                      timu_id: '',
                      percent: 0.45,
                      text: textCont,
                      idxNum: idxCount
                    };
                  tiMuInfo.timu_id = tma.TIMU_ID;
                  allTiMuForCard.push(tiMuInfo);
                  idxCount ++;
                });
              }
            });
            yushu = allTiMuForCard.length % 2;
            intAnswerCardLen = Math.floor(allTiMuForCard.length/2);
            answerCardLen = yushu > 0 ? intAnswerCardLen + 1 : intAnswerCardLen;
            for(var i = 0; i < answerCardLen; i++){
              var daTiKa = { //答题卡数据格式
                token: token,
                caozuoyuan: caozuoyuan,
                jigouid: jigouid,
                lingyuid: lingyuid,
                shuju: {
                  shiJuanId: paperDetailId,
                  pageNo: i,
                  header: {
                    percent: 0.05,
                    title: paperDetailName + '答题卡',
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
                daTiKa.shuju.body = allTiMuForCard.slice(i*2, (i+1)*2);
              }
              else{
                daTiKa.shuju.body = allTiMuForCard.slice(i*2);
              }
              answerCards.push(daTiKa);
            }
            $scope.answerCards = answerCards;
            $scope.txTpl = 'views/partials/daTiKa.html'; //加载答题卡页面
          };

          /**
           * 答题卡中的拖拽
           */
          $scope.resizeVertical = function(e, idx, pIdx, idxNum){
            event.preventDefault();
            var y = 0, //Y 轴坐标
              percentVal, //移动中的元素的百分比
              item = '.daTiRegion' + pIdx + idx,
              slideBtn = $('.slideDown'), //拖动按钮的高度
              resizeDiv = $(item), //定义需要缩放的div
              yushu, //余数
              intAnswerCardLen, //除以540得到的整数
              answerCardLen; //答题卡长度, 除以540得到的数据
            y = e.clientY - slideBtn.height() - resizeDiv.height();
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
            //鼠标移动//
            function mousemove(event) {
              resizeDiv.height(event.clientY - y + 'px');
              allTiMuForCard[idxNum].percent = event.clientY - y; //将高度赋值给对应的数据
            }
            //移除事件
            function mouseup() {
              $document.unbind('mousemove', mousemove);
              $document.unbind('mouseup', mouseup);
            }

            //得到所有答题卡的高度用来计算答题卡的帐数
            var heightSum = _.reduce(allTiMuForCard, function(memo, num){
              return memo + num.percent;
            }, 0);
            yushu = heightSum % 540;
            intAnswerCardLen = Math.floor(heightSum/540);
            answerCardLen = yushu > 0 ? intAnswerCardLen + 1 : intAnswerCardLen;
            if(idx == 0){ //答题卡中的第一题
              if(allTiMuForCard[idxNum].percent >180 && allTiMuForCard[idxNum].percent <= 360){
                if(allTiMuForCard[idxNum].percent + allTiMuForCard[idxNum + 1].percent <= 540){//页面剩下两道题
                  $scope.answerCards[pIdx].shuju.body.pop(); //删除最后一个元素
                  var  pageIdx = pIdx + 1,//页面索引
                    heightCount = 0; //每页答题卡的高度
                  $scope.answerCards[pageIdx].shuju.body = [];
                  for(var i = idxNum + 2; i < answerCardLen; i++){
                    heightCount += allTiMuForCard[i];
                    if(heightCount <= 540){
                      $scope.answerCards[pageIdx].shuju.body.push(allTiMuForCard[i]);
                    }
                    else{
                      pageIdx ++;
                      $scope.answerCards[pageIdx].shuju.body = [];
                    }
                  }
                }
                else{ //页面剩下一道题
                  $scope.answerCards[pIdx].shuju.body.pop(); //删除最后一个元素
                  var  pageIdx = pIdx + 1,//页面索引
                    heightCount = 0; //每页答题卡的高度
                  $scope.answerCards[pageIdx].shuju.body = [];
                  for(var i = idxNum + 1; i < answerCardLen; i++){
                    heightCount += allTiMuForCard[i];
                    if(heightCount <= 540){
                      $scope.answerCards[pageIdx].shuju.body.push(allTiMuForCard[i]);
                    }
                    else{
                      ++ pageIdx;
                      $scope.answerCards[pageIdx].shuju.body = [];
                    }
                  }
                }
              }
              else{ //页面剩下一道题
                var  pageIdx = pIdx + 1,//页面索引
                  heightCount = 0; //每页答题卡的高度
                $scope.answerCards[pageIdx].shuju.body = [];
                for(var i = idxNum + 1; i < answerCardLen; i++){
                  heightCount += allTiMuForCard[i];
                  if(heightCount <= 540){
                    $scope.answerCards[pageIdx].shuju.body.push(allTiMuForCard[i]);
                  }
                  else{
                    ++ pageIdx;
                    $scope.answerCards[pageIdx].shuju.body = [];
                  }
                }
              }
            }
            else if(idx == 1){ //答题卡中的第二题

            }
            else{ //答题卡中的第三题

            }

          };

          /**
           * 保存答题卡
           */
          $scope.loadingImg = false; //loading图片的显示和隐藏
          $scope.saveDaTiKa = function(){
            $scope.loadingImg = true; //loading图片的显示和隐藏
            var daTiKaLen = $scope.answerCards.length,
              times = 0,
              ifSaveDone = true,
              daTiKaUrlArr = [];
            var saveFun = function(){
              if(times < daTiKaLen){
                $http.post(saveDaTiKaUrl, $scope.answerCards[times]).success(function(data){
                  if(data.fileName){
                    daTiKaUrlArr.push(data.fileName);
                    if(times == daTiKaLen - 1){
                      $scope.daTiKaUrlArr = daTiKaUrlArr;
                      $scope.loadingImg = false; //loading图片的显示和隐藏
                      alert('答题卡生产成功！');
                      $scope.txTpl = 'views/partials/daTiKaDownLoad.html';
                    }
                    times ++;
                    saveFun();
                  }
                });
              }
            };
            saveFun();
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

        } // 002

      ] //controller 里面的结束 ]
    ); //controller的结束 )
  }); // 001