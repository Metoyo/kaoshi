/**
 * Created by songtao on 15/12/9.
 */
var zuodaApp = angular.module('zuodaApp', []);

zuodaApp.filter('html', ['$sce', function ($sce) {
  return function (text) {
    return $sce.trustAsHtml(text);
  };
}]);

zuodaApp.directive('repeatDone', function () {
  return function(scope, element, attrs) {
    if (scope.$last){
      setTimeout(function(){
        scope.$emit('onRepeatLast', element, attrs);
      }, 1);
    }
  };
});

zuodaApp.controller('ZuoDaDownloadCtrl', ['$scope', '$http', '$sce',
  function ($scope, $http, $sce) {
    $scope.cnNumArr = ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五',
      '十六','十七','十八','十九','二十'];
    $scope.letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
      'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var formatDaAn = function(tm){
      var letterArr = $scope.letterArr;
      var newCont;
      var daAnFormatReg = new RegExp('<\%{.*?}\%>', 'g');
      if(tm.TIXING_ID <= 3){
        var daanArr = tm.DAAN.split(','),
          daanLen = daanArr.length,
          daan = [];
        for(var i = 0; i < daanLen; i++){
          daan.push(letterArr[daanArr[i]]);
        }
        tm.DAAN = daan.join(',');
      }
      else if(tm.TIXING_ID == 4){
        if(tm.DAAN == 1){
          tm.DAAN = '对';
        }
        else{
          tm.DAAN = '错';
        }
      }
      else if(tm.TIXING_ID == 6){ //填空题
        //修改填空题的答案
        var tkDaAnArr = [],
          tkDaAn = JSON.parse(tm.DAAN),
          tkDaAnStr;
        Lazy(tkDaAn).each(function(da, idx, lst){
          tkDaAnArr.push('第' + (idx + 1) + '个空：' + da.answer);
        });
        tkDaAnStr = tkDaAnArr.join(';');
        tm.DAAN = tkDaAnStr;
        //修改填空题的题干
        if(tm.KAOSHENGDAAN){
          var tkKsDa = tm.KAOSHENGDAAN,
            finalDaAn = [],
            _len = '',
            count = 0;
          if(typeof(tkKsDa) == 'string'){
            tkKsDa = JSON.parse(tkKsDa);
          }
          for(var key in tkKsDa){
            finalDaAn.push(tkKsDa[key]);
          }
          _len = finalDaAn.length;
          newCont = tm.TIGAN.tiGan.replace(daAnFormatReg, function(arg) {
            var xhStr = '';
            xhStr = '<span class="ar-tk-da">' + finalDaAn[count] + '</span>';
            count ++;
            return xhStr;
          });
        }
        else{
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
        }
        tm.TIGAN.tiGan = newCont;
      }
      else{

      }
      //作答重现的答案处理
      if(tm.KAOSHENGDAAN){
        if(tm.TIXING_ID <= 3){
          var ksDaanArr = tm.KAOSHENGDAAN.split(','),
            ksDaanLen = ksDaanArr.length,
            ksDaan = [];
          for(var j = 0; j < ksDaanLen; j++){
            ksDaan.push(letterArr[ksDaanArr[j]]);
            //ksDaan.push('D');
          }
          tm.KAOSHENGDAAN = ksDaan.join(',');
        }
        else if(tm.TIXING_ID == 4){
          if(tm.KAOSHENGDAAN == 1){
            tm.KAOSHENGDAAN = '对';
          }
          else{
            tm.KAOSHENGDAAN = '错';
          }
        }
        //else if(tm.TIXING_ID == 6) { //填空题
        //  var tkKsDa = tm.KAOSHENGDAAN, cont = 1,
        //    finalDaAn = [];
        //  if(typeof(tkKsDa) == 'string'){
        //    tkKsDa = JSON.parse(tkKsDa);
        //  }
        //  for(var key in tkKsDa){
        //    finalDaAn.push('第' + cont + '个空：' + tkKsDa[key]);
        //    cont ++;
        //  }
        //  tm.KAOSHENGDAAN = finalDaAn.join(';');
        //}
        else if(tm.TIXING_ID >= 9) {
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
        else{

        }
      }
    };
    $scope.zuoDaReappear = function(ksd){
      var answerReappearUrl =  'http://www.zhifz.com:4300/api/answer_reappear?token=12345';
      var  dataDis, tmVal,
        finaData = {
          sj_name: '',
          sj_tm: []
        };
      if(ksd.UID){
        answerReappearUrl += '&kaoshengid=' + ksd.UID;
      }
      else{
        DataService.alertInfFun('pmt', '缺少考生UID');
        return;
      }
      if(ksd.KAOSHI_ID){
        answerReappearUrl += '&kaoshiid=' + ksd.KAOSHI_ID;
      }
      else{
        DataService.alertInfFun('pmt', '缺少考试ID');
        return;
      }
      $http.get(answerReappearUrl).success(function(data) {
        if(data && data.length > 0){
          finaData.sj_name = data[0].SHIJUAN_MINGCHENG;
          dataDis = Lazy(data).groupBy('DATI_XUHAO').toObject();
          Lazy(dataDis).each(function(val, key, list){
            var dObj = {
              tx_id: key,
              tx_name: val[0].DATIMINGCHENG,
              tm: ''
            };
            Lazy(val).each(function(tm, idx, lst){
              //var findVal = Lazy(itemDeFenLv).find(function(item){return item.TIMU_ID == tm.TIMU_ID});
              //if(findVal){
              //  tm.itemDeFenLv = (findVal.DEFENLV * 100).toFixed(1);
              //}
              if(typeof(tm.TIGAN) == 'string'){
                tm.TIGAN = JSON.parse(tm.TIGAN);
              }
              formatDaAn(tm);
            });
            dObj.tm = val;
            finaData.sj_tm.push(dObj);
          });
          $scope.kaoShengShiJuan = finaData;
          setTimeout(function(){
            MathJax.Hub.Config({
              tex2jax: {inlineMath: [["#$", "$#"]], displayMath: [['#$$','$$#']]},
              messageStyle: "none",
              showMathMenu: false,
              processEscapes: true
            });
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, "answerReappearShiJuan"]);
          }, 1000);
        }
      });
    };
    $scope.zuoDaReappear({UID:6526,KAOSHI_ID:1717});
    /**
     * 重新加载mathjax
     */
    $scope.$on('onRepeatLast', function(scope, element, attrs){
      MathJax.Hub.Config({
        tex2jax: {inlineMath: [["#$", "$#"]], displayMath: [['#$$','$$#']]},
        messageStyle: "none",
        showMathMenu: false,
        processEscapes: true
      });
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, "answerReappearShiJuan"]);
    });
  //$scope.phones = [
  //  {
  //    'name': 'Nexus S',
  //    'snippet': 'Fast just got faster with Nexus S.'
  //  },
  //  {
  //    'name': 'Motorola XOOM™ with Wi-Fi',
  //    'snippet': 'The Next, Next Generation tablet.'
  //  },
  //  {
  //    'name': 'MOTOROLA XOOM™',
  //    'snippet': 'The Next, Next Generation tablet.'
  //  }
  //];
}]);
