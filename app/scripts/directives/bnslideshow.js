define(['jquery', 'angular'], function (JQ, angular) {
  'use strict';

  angular.module('kaoshiApp.directives.Bnslideshow', [])
  	.directive('bnSlideShow', function () {
      return {
      	restrict: 'A',
      	link: function postLink(scope, element, attrs) {
          var targetClass,
            slideTap = attrs.slidShowTapon,
            slideTarget = '.' + attrs.slideShowTarget,
            slideText = attrs.slideShowText,
            slideDirection = attrs.slideShowDirt,
            slideIdx = attrs.slideShowIdx,
            targetSlt;
          if(slideTap){
            targetClass = '.' + slideTap;
          }
          else{
            targetClass = '.' + attrs.class;
          }
          targetSlt = JQ(targetClass).eq(slideIdx);
          targetSlt.on('click', function(){
            if(slideDirection == 'left'){ //向左滑动展开
              JQ(this).next(slideTarget).animate({width: 'toggle'});
            }
            else{ //向下滑动展开
              var eltTxt = JQ(this).text();
              if(slideText){ //用在考务里面的试卷列表
                JQ(this).text(eltTxt == '关闭' ? slideText : '关闭');
                JQ(this).closest('div').next(slideTarget).slideToggle();
              }
              else{
                JQ(this).next(slideTarget).slideToggle();
              }
            }
          });
          //targetSlt.on('click', function(){
          //  if(slideDirection == 'left'){ //向左滑动展开
          //    targetSlt.next(slideTarget).animate({width: 'toggle'});
          //  }
          //  else{ //向下滑动展开
          //    var eltTxt = targetSlt.text();
          //    if(slideText){ //用在考务里面的试卷列表
          //      targetSlt.text(eltTxt == '关闭' ? slideText : '关闭');
          //      targetSlt.closest('div').next(slideTarget).slideToggle();
          //    }
          //    else{
          //      targetSlt.next(slideTarget).slideToggle();
          //    }
          //  }
          //});
      	}
      };
  	});
});
