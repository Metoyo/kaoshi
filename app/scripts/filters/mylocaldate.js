define(['angular'], function (angular) {
  'use strict';

  angular.module('kaoshiApp.filters.Mylocaldate', [])
  	.filter('myLocalDate', function () {
      return function (input) {
      	return 'myLocalDate filter: ' + input;
      };
  	});
});
