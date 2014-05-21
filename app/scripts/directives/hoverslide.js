define(['jquery', 'angular'], function ($, angular) {
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
            },
            function () {
              element.next(slideTarget).slideUp();
            }
          );
        }
      };
  	});
});
