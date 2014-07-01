define(['angular', 'config'], function (angular, config) {
  'use strict';

  angular.module('kaoshiApp.filters.Outputdaan', [])
  	.filter('outputDaAn', function () {
      return function (input, txId) {
          var letterArr = config.letterArr;
        if(txId <= 3){
          var daanArr = input.split(','),
            daanLen = daanArr.length,
            daan = [];
          for(var i = 0; i < daanLen; i++){
            daan.push(letterArr[daanArr[i]]);
          }
          return daan;
        }
        else if(txId == 4){
          if(input == 1){
            return '对';
          }
          else{
            return '错';
          }
        }
        else{
          return input;
        }
      };
  	});
});
