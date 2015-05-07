define(['angular', 'jquery'], function (angular, JQ) {
  'use strict';

  angular.module('kaoshiApp.directives.Hoverslide', [])
  	.directive('hoverSlide', function ($timeout) {
      return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
          var slideTarget = '.' + attrs.hoverSlideTarget,
            slideGetval = '.' + attrs.hoverSlideGetval,
            slideSetval = '.' + attrs.hoverSlideSetval,
            timeOut;
          element.hover(
            function () {
              var  cont = element.find(slideGetval).val();
              timeOut = $timeout(function(){
                JQ(slideSetval).html(cont);
                JQ(slideTarget).show();
              }, 500);
            },
            function () {
              $timeout.cancel(timeOut);
              JQ(slideTarget).hide();
              JQ(slideSetval).html('');
            }
          );
        }
      };
  	});
});
