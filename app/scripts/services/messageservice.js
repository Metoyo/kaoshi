define(['angular'], function (angular) {
  'use strict';
  angular.module('kaoshiApp.services.Messageservice', [])
	.service('messageService', ['$timeout', function messageService($timeout) {
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
          var fadeOutFun = function(){
            $('.popInfoWrap').fadeOut(3000);
          };
          $timeout(fadeOutFun, 3000);
      };
	}]);
});
