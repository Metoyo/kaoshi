define([
    'jquery',
    'angular'
  ], function ($, angular) {
    'use strict';

    angular.module('kaoshiApp.controllers.MainCtrl', []).
      controller('MainCtrl', function ($rootScope, $scope, $http) {
//        _.each(tiXingTiMu, function(value, key, list){
//          for(var i = 0; i < mbdtdLength; i++){
//            if(mubanData.shuju.MUBANDATI[i].MUBANDATI_ID == key){
//              //将本题加入试卷
//              _.each(value, function(tmId, idx, list){
//                var sjtm = {
//                  TIMU_ID: '',
//                  MUBANDATI_ID: key,
//                  WEIZHIXUHAO: idx,
//                  FENZHI: ''
//                };
//                sjtm.TIMU_ID = tmId;
//                shijuanData.shuju.SHIJUAN_TIMU.push(sjtm);
//              });
//
//              //操作模板
//              (function(index, tiMuIds){
//                var qrytimuxiangqing = qrytimuxiangqingBase + '&timu_id=' + tiMuIds.toString(); //查询详情url
//                $http.get(qrytimuxiangqing).success(function(data){
//                  if(data.length){
//                    countnum ++ ;
//                    mubanData.shuju.MUBANDATI[index].TIMUARR = data;
//                    _.each(data, function(tm, idx, lst){
//                      //难度统计  nanduTempData NANDU_ID
//                      for(var j = 0; j < nanduLength; j++){
//                        if(nanduTempData[j].nanduId == tm.NANDU_ID){
//                          nanduTempData[j].nanduCount.push(tm.TIMU_ID);
//                        }
//                      }
//                    });
//                    //统计每种题型的数量和百分比
//                    tixingStatistics(index, kmtxListLength);
//                    nanduPercent(); //难度统计
//
//                    //判读是否执行完成
//                    if(countnum == tiXingLen){
//                      $scope.fangqibencizujuanBtn = true; //放弃本次组卷的按钮
//                      $scope.baocunshijuanBtn = true; //保存试卷的按钮
//                      $scope.shijuanPreview();
//                    }
//                  }
//                  else{
//                    $scope.timudetails = null;
//                  }
//                }).error(function(err){
//                  console.log(err);
//                });
//              })(i, value);
//
//              addOrRemoveItemToPaper(shijuanData.shuju.SHIJUAN_TIMU); //添加和删除按钮
//
//              //二级控制面板上的分数统计
//              restoreKmtxDtscore();
//              _.each(mubanData.shuju.MUBANDATI, function(mbdt, indx, lst){ //再给kmtx.datiScore赋值
//                _.each($scope.kmtxList, function(kmtx, idx, lst){
//                  if(kmtx.TIXING_ID == mbdt.MUBANDATI_ID){
//                    kmtx.datiScore = mbdt.datiScore;
//                  }
//                });
//              });
//            }
//          }
//        });


//        $scope.submitDistAutoPaperData = function(){
//          var tiXingLen = $scope.ampKmtx.length,
//            countnum = 0,
//            tiXingLenCount = 0, //定义一个变量用了判断当所有题型长度为空是给出提示
//            distAutoMakePaperData = {
//              token: token,
//              caozuoyuan: caozuoyuan,
//              jigouid: jigouid,
//              lingyuid: lingyuid,
//              shuju:{}
//            },
//            times = 0,
//            haveTmNumLen = 0,
//            tiXingTiMu = {}, //定义一个空对象，用来临时存放返回的题型题目
//            mbdtdLength = mubanData.shuju.MUBANDATI.length;//模板大题的长度
//          _.each($scope.ampKmtx, function(aktm, idx, lst){
//            if(aktm.tmNum){
//              haveTmNumLen ++;
//            }
//          });
//          for(var i = 0; i < tiXingLen; i++){
//            var subShuJu = {
//              NANDU: $scope.ampKmtx[i].tmNanDu,
//              ZHISHIDIAN: [],
//              TIXING: [{TIXING_ID: '', COUNT: ''}]
//            };
//            if($scope.ampKmtx[i].tmNum){
//              tiXingLenCount ++;
//              subShuJu.ZHISHIDIAN = $scope.ampKmtx[i].dagangArr ? $scope.ampKmtx[i].dagangArr : selectZsd;
//              if(subShuJu.ZHISHIDIAN){
//                subShuJu.TIXING[0].TIXING_ID = $scope.ampKmtx[i].TIXING_ID;
//                subShuJu.TIXING[0].COUNT = $scope.ampKmtx[i].tmNum;
//                distAutoMakePaperData.shuju = subShuJu;
//                (function(idx){
//                  $http.post(zidongzujuan, distAutoMakePaperData).success(function(sjData){
//                    if(sjData.error){
//                      alert(sjData.error);
//                    }
//                    else{
//                      _.each(sjData.TIXING_TIMU, function(value, key, list){
//                        tiXingTiMu[key] = value;
//                      });
//                      times ++;
//                      if(times == haveTmNumLen){
//                        console.log(tiXingTiMu);
//                        //每一个tiXingTiMu中的数据
////                          _.each(tiXingTiMu, function(txtm, idx, lst){
////                            _.each(txtm.tiXingTiMu, function(value, key, list){
////                              for(var k = 0; k < mbdtdLength; k++){
////                                if(mubanData.shuju.MUBANDATI[k].MUBANDATI_ID == key){
////                                  //将本题加入试卷
////                                  _.each(value, function(tmId, idx, list){
////                                    var sjtm = {
////                                      TIMU_ID: '',
////                                      MUBANDATI_ID: key,
////                                      WEIZHIXUHAO: idx,
////                                      FENZHI: ''
////                                    };
////                                    sjtm.TIMU_ID = tmId;
////                                    shijuanData.shuju.SHIJUAN_TIMU.push(sjtm);
////                                  });
////
////                                  //操作模板
////                                  (function(index, tiMuIds){
////                                    var qrytimuxiangqing = qrytimuxiangqingBase + '&timu_id=' + tiMuIds.toString(); //查询详情url
////                                    $http.get(qrytimuxiangqing).success(function(data){
////                                      if(data.length){
////                                        countnum ++ ;
////                                        mubanData.shuju.MUBANDATI[index].TIMUARR = data;
////                                        _.each(data, function(tm, idx, lst){
////                                          //难度统计  nanduTempData NANDU_ID
////                                          for(var j = 0; j < nanduLength; j++){
////                                            if(nanduTempData[j].nanduId == tm.NANDU_ID){
////                                              nanduTempData[j].nanduCount.push(tm.TIMU_ID);
////                                            }
////                                          }
////                                        });
////                                        //统计每种题型的数量和百分比
////                                        tixingStatistics(index, kmtxListLength);
////                                        nanduPercent(); //难度统计
////
////                                        //判读是否执行完成
////                                        if(countnum == tiXingLen){
////                                          $scope.fangqibencizujuanBtn = true; //放弃本次组卷的按钮
////                                          $scope.baocunshijuanBtn = true; //保存试卷的按钮
////                                          $scope.shijuanPreview();
////                                        }
////                                      }
////                                      else{
////                                        $scope.timudetails = null;
////                                      }
////                                    }).error(function(err){
////                                      console.log(err);
////                                    });
////                                  })(k, value);
////
////                                  addOrRemoveItemToPaper(shijuanData.shuju.SHIJUAN_TIMU); //添加和删除按钮
////
////                                  //二级控制面板上的分数统计
////                                  restoreKmtxDtscore();
////                                  _.each(mubanData.shuju.MUBANDATI, function(mbdt, indx, lst){ //再给kmtx.datiScore赋值
////                                    _.each($scope.kmtxList, function(kmtx, idx, lst){
////                                      if(kmtx.TIXING_ID == mbdt.MUBANDATI_ID){
////                                        kmtx.datiScore = mbdt.datiScore;
////                                      }
////                                    });
////                                  });
////                                }
////                              }
////                            });
////                          });
//                      }
//                    }
//                  });
//                })(i);
//              }
//              else{
//                alert('请选择知识点！');
//                break;
//              }
//            }
//          }
//          if(!tiXingLenCount){
//            alert('请至少选择一种题型！');
//          }
//        };
    });
  }
);
