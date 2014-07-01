define(['angular'], function (angular) {
  'use strict';

  angular.module('kaoshiApp.filters.Panduantozh', [])
  	.filter('panDuanToZh', function () {
      return function (input) {
        if(input == 1){
          return '对';
        }
        else{
          return '错';
        }
      };
  	});
});
