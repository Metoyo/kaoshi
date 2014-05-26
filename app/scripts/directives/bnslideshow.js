define(['jquery', 'angular'], function ($, angular) {
  'use strict';

  angular.module('kaoshiApp.directives.Bnslideshow', [])
  	.directive('bnSlideShow', function () {
      return {
//      	template: '<div></div>',
      	restrict: 'A',
      	link: function postLink(scope, element, attrs) {
          var slideTarget = '.' + attrs.slideShowTarget,
            slideText = attrs.slideShowText;
          element.on('click', function(){
            var eltTxt = element.text();
            if(slideText){ //用在考务里面的试卷列表
              element.text(eltTxt == '关闭' ? slideText : '关闭');
              element.closest('div').next(slideTarget).slideToggle();
            }
            else{
              element.next(slideTarget).slideToggle();
            }

          });

//          var expression = attrs.bnSlideShow, // 定义一个字段表示dom上的属性bnSlideShow
//            duration = ( attrs.slideShowDuration || "fast" ), // 设定一个动画时间
//            selectIdx = attrs.slideShowIdx; //需要显示的元素的索引
//          //元素加载是设置为隐藏
//          if (!scope.$eval(expression )) {
//            element.hide();
//          }
//          scope.$watch(expression, function( newValue, oldValue ) {
//              //如果已经设定了元素的默认状态，当第一次加载的时候，忽略设定值
//              if ( newValue === oldValue ) {
//                return;
//              }
//              if ( newValue ) { //元素显示
//                element.stop( true, true ).slideDown( duration );
//              }
//              else { //隐藏元素
//                element.stop( true, true ).slideUp( duration );
//              }
//            }
//          );
      	}
      };
  	});
});
