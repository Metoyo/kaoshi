define(['../../angular/angular'], function (angular) {
  'use strict';

  angular.module('kaoshiApp.directives.Saveloading', [])
  	.directive('saveLoading', function () {
      return {
//      	template: '<div></div>',
        templateUrl: '../../../views/partials/saveLoading.html',
      	restrict: 'AE',
      	link: function postLink(scope, element, attrs) {
          element.on('click', function(){

          });
      	}
      };
  	});
});
