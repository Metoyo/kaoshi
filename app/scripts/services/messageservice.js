define(['angular'], function (angular) {
  'use strict';
  angular.module('kaoshiApp.services.Messageservice', [])
	.service('messageService', ['$timeout', function messageService($timeout) {
      //提示信息
      this.alertInfFun = function(megKind, cont){
        $('.messageTd').css('display', 'none').html('');
        if(megKind == 'err'){
          $('.mesError').css('display', 'block').html(cont);
        }
        if(megKind == 'suc'){
          $('.mesSuccess').css('display', 'block').html(cont);
        }
        if(megKind == 'pmt'){
          $('.mesPrompt').css('display', 'block').html(cont);
        }
        $('.popInfoWrap').css('display', 'block');
        var fadeOutFun = function(){
          $('.popInfoWrap').fadeOut(3000);
        };
        $timeout(fadeOutFun, 3000);
      };
      //修改试题，点击编辑器，内容立刻预览 题干
      this.tiMuContPreview = function(tgCont){
        var tgCont = $('.formulaEditTiGan').val() || tgCont;
        if(tgCont){
          tgCont = tgCont.replace(/\n/g, '<br/>');
          $('#prevDoc').html(tgCont);
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, "prevDoc"]);
        }
      };
      //修改试题，点击编辑器，内容立刻预览 题支
      this.tiZhiContPreview = function(){
        var tzCont = $('.formulaEditTiZhi').val();
        if(tzCont){
          tzCont = tzCont.replace(/\n/g, '<br/>');
          $('#prevTiZhiDoc').html(tzCont);
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, "prevTiZhiDoc"]);
        }
      };

	}]);
});
