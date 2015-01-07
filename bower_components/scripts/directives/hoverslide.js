define(['../../jquery/jquery', 'angular'], function ($, angular) {
  'use strict';

  angular.module('kaoshiApp.directives.Hoverslide', [])
  	.directive('hoverSlide', function () {
      return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
          var slideTarget = '.' + attrs.hoverSlideTarget;
          element.hover(
            function () {
              element.next(slideTarget).slideDown();
//              setTimeout(function(){
//                element.next(slideTarget).slideDown();
//              }, 500);
            },
            function () {
              element.next(slideTarget).slideUp();
//              setTimeout(function(){
//                element.next(slideTarget).slideUp();
//              }, 500);
            }
          );
        }
      };
  	});
});
