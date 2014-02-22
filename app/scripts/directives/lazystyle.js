define(['jquery', 'angular'], function ($, angular) {
  'use strict';

  angular.module('kaoshiApp.directives.Lazystyle', [])
  	.directive('lazyStyle', function () {
      var loadedStyles = {},
          links = [];
      return {
        restrict: 'E',
        link: function (scope, element, attrs) {

          attrs.$observe('href', function (value) {

            var stylePath = value;

            if (stylePath in loadedStyles) {
              return;
            }

            if (document.createStyleSheet) {
              document.createStyleSheet(stylePath); //IE
            } else {
              var link = document.createElement("link");
              link.type = "text/css";
              link.rel = "stylesheet";
              link.href = stylePath;
              document.getElementsByTagName("head")[0].appendChild(link);
              links.push(link);
            }

            loadedStyles[stylePath] = true;

            scope.$on('$destroy', function() {
              //alert("In destroy of:" + scope.todo.text);
              angular.forEach(links, function(lnk, indx){
                angular.element(lnk).remove();
              });
            });

          });
        }
      };
    });
});
