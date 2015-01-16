define(['angular', 'config'], function (angular, config) {
  'use strict';
  angular.module('kaoshiApp.services.Messageservice', [])
	.service('messageService', ['$rootScope', '$location', 'urlRedirect', '$cookieStore', '$timeout',
      function messageService($rootScope, $location, urlRedirect, $cookieStore, $timeout) {
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
        //退出登录
        this.logout = function(){
          delete $rootScope.session;
          $cookieStore.remove('logged');
          $cookieStore.remove('lingyuCk');
          $cookieStore.remove('lastUrl');
          $cookieStore.remove('quanXianCk');
          urlRedirect.goTo($location.$$path, '/renzheng');
        };
        //题目题干答案格式化
        var letterArr = config.letterArr,
          newCont,
          daAnFormatReg = new RegExp('<\%{.*?}\%>', 'g');
        this.formatDaAn = function(tm){
          if(tm.TIXING_ID <= 3){
            var daanArr = tm.DAAN.split(','),
              daanLen = daanArr.length,
              daan = [];
            for(var i = 0; i < daanLen; i++){
              daan.push(letterArr[daanArr[i]]);
            }
            tm.DAAN = daan.join(',');
            //考生答案
            if(tm.KAOSHENGDAAN){
              var ksDaanArr = tm.KAOSHENGDAAN.split(','),
                ksDaanLen = ksDaanArr.length,
                ksDaan = [];
              for(var j = 0; j < ksDaanLen; j++){
                ksDaan.push(letterArr[ksDaanArr[j]]);
              }
              tm.KAOSHENGDAAN = ksDaan.join(',');
            }
          }
          else if(tm.TIXING_ID == 4){
            if(tm.DAAN == 1){
              tm.DAAN = '对';
            }
            else{
              tm.DAAN = '错';
            }
            //考生答案
            if(tm.KAOSHENGDAAN){
              if(tm.KAOSHENGDAAN == 1){
                tm.KAOSHENGDAAN = '对';
              }
              else{
                tm.KAOSHENGDAAN = '错';
              }
            }
          }
          else if(tm.TIXING_ID == 6){ //填空题
            //修改填空题的答案
            var tkDaAnArr = [],
              tkDaAn = JSON.parse(tm.DAAN),
              tkDaAnStr;
            _.each(tkDaAn, function(da, idx, lst){
              tkDaAnArr.push('第' + (idx + 1) + '个空：' + da.answer);
            });
            tkDaAnStr = tkDaAnArr.join(';');
            tm.DAAN = tkDaAnStr;
            //修改填空题的题干
            newCont = tm.TIGAN.tiGan.replace(daAnFormatReg, function(arg) {
              var text = arg.slice(2, -2),
                textJson = JSON.parse(text),
                _len = textJson.size,
                i, xhStr = '';
              for(i = 0; i < _len; i ++ ){
                xhStr += '_';
              }
              return xhStr;
            });
            tm.TIGAN.tiGan = newCont;
            //考生答案
            if(tm.KAOSHENGDAAN){
              var tkKsDa = tm.KAOSHENGDAAN, cont = 1,
                finalDaAn = [];
              if(typeof(tkKsDa) == 'string'){
                tkKsDa = JSON.parse(tkKsDa);
              }
              for(var key in tkKsDa){
                finalDaAn.push('第' + cont + '个空：' + tkKsDa[key]);
                cont ++;
              }
              tm.KAOSHENGDAAN = finalDaAn.join(';');
            }
          }
          else if(tm.TIXING_ID == 9){
            if(tm.KAOSHENGDAAN){
              var jstKsDa = tm.KAOSHENGDAAN,
                jstKsFinalDaAn = [];
              if(typeof(jstKsDa) == 'string'){
                jstKsDa = JSON.parse(jstKsDa);
              }
              for(var key in jstKsDa){
                jstKsFinalDaAn.push('<img src="' + jstKsDa[key] + '"/>');
              }
              tm.KAOSHENGDAAN = jstKsFinalDaAn.join(' ');
            }
          }
          else{

          }
        };



	    }
  ]);
});
