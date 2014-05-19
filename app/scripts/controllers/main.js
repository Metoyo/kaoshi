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
    });
  }
);
