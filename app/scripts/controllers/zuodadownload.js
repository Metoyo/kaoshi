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
              if(typeof(tm.TIGAN) == 'string'){
                tm.TIGAN = JSON.parse(tm.TIGAN);
              }
              formatDaAn(tm);
            });
            dObj.tm = val;
            finaData.sj_tm.push(dObj);
          });
          $scope.kaoShengShiJuan = finaData;
        }
      });
    };
    $scope.zuoDaReappear({UID:6526,KAOSHI_ID:1717});
    /**
     * 重新加载mathjax
     */
    $scope.$on('onRepeatLast', function(scope, element, attrs){
      //document.getElementById('mybutton').click();
      //$('#mybutton').click();
      MathJax.Hub.Config({
        tex2jax: {inlineMath: [["#$", "$#"]], displayMath: [['#$$','$$#']]},
        messageStyle: "none",
        showMathMenu: false,
        processEscapes: true
      });
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, "answerReappearShiJuan"]);
    });
}]);

/**
 * @title 考试网站路由
 * @overview 建立访问路径与api的映射
 * @copyright (c) 2013 泰安厅教育科技有限公司
 * @author 曾勇
 */
exports.router = function (config, logger) {
  function _bind(app, express) {
    // 静态路由
    app.use('/', express.static(
      require('path').resolve(__dirname + '/../app')
    ));
    // 静态路由
//        app.use('/data/datika', express.static(
//            require('path').resolve(__dirname + '/../data/datika')
//        ));

    // api路由
    var http = require('http');
    var path = require('path');
    var fs = require('fs');
    //路由转发
    function routeForward(reqData, callback) {
      var urlArr = reqData.url.split('/'), kindUrl, reqUrl, opt, dataStr, dataHeader;
      urlArr.shift();
      kindUrl = urlArr[0];
      urlArr.shift();
      reqUrl = '/api/' + urlArr.join('/');
      dataHeader = reqData.headers;

      opt = {
        host: '127.0.0.1',
        port: '',
        path: reqUrl,
        method: reqData.method,
        headers: ''
      };
      switch (kindUrl) {
        case 'renzheng' :
          opt.port = 3000;
          break;
        case 'mingti' :
          opt.port = 4000;
          break;
        case 'kaowu' :
          opt.port = 4100;
          break;
        case 'tongji' :
          opt.port = 4300;
          break;
      }
      if (reqData.method == 'POST') {
        dataStr = JSON.stringify(reqData.body);
        dataHeader['Content-Type'] = 'application/json';
        dataHeader['Content-Length'] = dataStr.length;
        opt.headers = dataHeader;

        var reqFun = http.request(opt, function (result) {
          result.setEncoding('utf8');
          result.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            if (callback) {
              callback(chunk);
            }
          });
        });
        reqFun.on('error', function (e) {
          console.log('problem with request: ' + e.message);
        });
        // write data to request body
        reqFun.write(dataStr);
        reqFun.end();
      }
      else {
        var reqFun = http.request(opt, function (result) {
          result.on('data', function (d) {
            if (callback) {
              callback(d);
            }
          });
        });
        reqFun.end();
      }
    }

    //app.all('/*', function (req, res) {
    //console.log(req.headers);
    //	routeForward(req, function (data) {
    //		res.send(data);
    //	});
    //});
    //app.all('/mingti/*', function (req, res) {
    //  routeForward(req.url, req.method, function (data) {
    //    res.send(data);
    //  });
    //});
    //app.all('/kaowu/*', function (req, res) {
    //  routeForward(req.url, req.method, function (data) {
    //    res.send(data);
    //  });
    //});
    //app.all('/tongji/*', function (req, res) {
    //  routeForward(req.url, req.method, function (data) {
    //    res.send(data);
    //  });
    //});
    app.get('/show_file/:file', function (req, res) {
      var opt = {
        host: '127.0.0.1',
        port: '4000',
        path: '/api/show_file/' + req.params.file,
        method: 'GET',
        headers: {}
      };
      http.request(opt, function (result) {
        result.pipe(res);
      }).end();
    });

    //生成PDF
    app.engine('.html', require('art-template'));
    var artTpl = require('art-template');
    var request = require('request');
    var Lazy = require('lazy.js');
    var cnNumArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五',
      '十六', '十七', '十八', '十九', '二十'];
    var letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
      'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var formatDaAn = function (tm) {
      var newCont;
      var daAnFormatReg = new RegExp('<\%{.*?}\%>', 'g');
      if (tm.TIXING_ID <= 3) {
        var daanArr = tm.DAAN.split(','),
          daanLen = daanArr.length,
          daan = [];
        for (var i = 0; i < daanLen; i++) {
          daan.push(letterArr[daanArr[i]]);
        }
        tm.DAAN = daan.join(',');
      }
      else if (tm.TIXING_ID == 4) {
        if (tm.DAAN == 1) {
          tm.DAAN = '对';
        }
        else {
          tm.DAAN = '错';
        }
      }
      else if (tm.TIXING_ID == 6) { //填空题
        //修改填空题的答案
        var tkDaAnArr = [],
          tkDaAn = JSON.parse(tm.DAAN),
          tkDaAnStr;
        Lazy(tkDaAn).each(function (da, idx, lst) {
          tkDaAnArr.push('第' + (idx + 1) + '个空：' + da.answer);
        });
        tkDaAnStr = tkDaAnArr.join(';');
        tm.DAAN = tkDaAnStr;
        //修改填空题的题干
        if (tm.KAOSHENGDAAN) {
          var tkKsDa = tm.KAOSHENGDAAN,
            finalDaAn = [],
            _len = '',
            count = 0;
          if (typeof(tkKsDa) == 'string') {
            tkKsDa = JSON.parse(tkKsDa);
          }
          for (var key in tkKsDa) {
            finalDaAn.push(tkKsDa[key]);
          }
          _len = finalDaAn.length;
          newCont = tm.TIGAN.tiGan.replace(daAnFormatReg, function (arg) {
            var xhStr = '';
            xhStr = '<span class="ar-tk-da">' + finalDaAn[count] + '</span>';
            count++;
            return xhStr;
          });
        }
        else {
          newCont = tm.TIGAN.tiGan.replace(daAnFormatReg, function (arg) {
            var text = arg.slice(2, -2),
              textJson = JSON.parse(text),
              _len = textJson.size,
              i, xhStr = '';
            for (i = 0; i < _len; i++) {
              xhStr += '_';
            }
            return xhStr;
          });
        }
        tm.TIGAN.tiGan = newCont;
      }
      else {
      }
      //作答重现的答案处理
      if (tm.KAOSHENGDAAN) {
        if (tm.TIXING_ID <= 3) {
          var ksDaanArr = tm.KAOSHENGDAAN.split(','),
            ksDaanLen = ksDaanArr.length,
            ksDaan = [];
          for (var j = 0; j < ksDaanLen; j++) {
            ksDaan.push(letterArr[ksDaanArr[j]]);
          }
          tm.KAOSHENGDAAN = ksDaan.join(',');
        }
        else if (tm.TIXING_ID == 4) {
          if (tm.KAOSHENGDAAN == 1) {
            tm.KAOSHENGDAAN = '对';
          }
          else {
            tm.KAOSHENGDAAN = '错';
          }
        }
        else if (tm.TIXING_ID >= 9) {
          var jstKsDa = tm.KAOSHENGDAAN,
            jstKsFinalDaAn = [];
          if (typeof(jstKsDa) == 'string') {
            jstKsDa = JSON.parse(jstKsDa);
          }
          for (var key in jstKsDa) {
            jstKsFinalDaAn.push('<img src="' + jstKsDa[key] + '"/>');
          }
          tm.KAOSHENGDAAN = jstKsFinalDaAn.join(' ');
        }
        else {

        }
      }
    };
    var zuoDaReappear = function () {
      //var answerReappearUrl = 'http://www.zhifz.com:4300/api/answer_reappear?token=12345&kaoshengid=4306&kaoshiid=1671';
      var answerReappearUrl = 'http://www.zhifz.com:4300/api/answer_reappear?token=12345&kaoshengid=6526&kaoshiid=1717';
      var dataDis;
      var tmVal;
      var finaData = {
        sj_name: '',
        cnNumArr: cnNumArr,
        letterArr: letterArr,
        sj_tm: []
      };
      var options = {
        url: answerReappearUrl,
        headers: {
          'User-Agent': 'request'
        }
      };
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var myData = {cont: ''};
          myData.cont = body;
          var data = JSON.parse(myData.cont);
          if (data && data.length > 0) {
            finaData.sj_name = data[0].SHIJUAN_MINGCHENG;
            dataDis = Lazy(data).groupBy('DATI_XUHAO').toObject();
            Lazy(dataDis).each(function (val, key, list) {
              var dObj = {
                tx_id: key,
                tx_name: val[0].DATIMINGCHENG,
                tm: ''
              };
              Lazy(val).each(function (tm, idx, lst) {
                if (typeof(tm.TIGAN) == 'string') {
                  tm.TIGAN = JSON.parse(tm.TIGAN);
                }
                formatDaAn(tm);
              });
              dObj.tm = val;
              finaData.sj_tm.push(dObj);
            });
            return finaData;
          }
        }
        else{
          console.log(error);
        }
      });
      //  if (ksd.UID) {
      //    answerReappearUrl += '&kaoshengid=' + ksd.UID;
      //  }
      //  else {
      //    return;
      //  }
      //  if (ksd.KAOSHI_ID) {
      //    answerReappearUrl += '&kaoshiid=' + ksd.KAOSHI_ID;
      //  }
      //  else {
      //    return;
      //  }
      //  $.get(answerReappearUrl, function (data) {
      //    if (data && data.length > 0) {
      //      finaData.sj_name = data[0].SHIJUAN_MINGCHENG;
      //      dataDis = Lazy(data).groupBy('DATI_XUHAO').toObject();
      //      Lazy(dataDis).each(function (val, key, list) {
      //        var dObj = {
      //          tx_id: key,
      //          tx_name: val[0].DATIMINGCHENG,
      //          tm: ''
      //        };
      //        Lazy(val).each(function (tm, idx, lst) {
      //          if (typeof(tm.TIGAN) == 'string') {
      //            tm.TIGAN = JSON.parse(tm.TIGAN);
      //          }
      //          formatDaAn(tm);
      //        });
      //        dObj.tm = val;
      //        finaData.sj_tm.push(dObj);
      //      });
      //      return finaData;
      //    }
      //    else {
      //      console.log(data.error);
      //    }
      //  });
    };
    // var data = {
    // title: '标签',
    // list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '设函数 #$f(x)$# 在 #$[a,+\infty)$# 上可导，#$c$# 为常数.']
    // };
    // var htmlCont = artTpl(__dirname + '/../app/views/partials/zddownload', data);
    app.get('/download/:file', function (req, res) {
      // var zdData = zuoDaReappear({UID:6526, KAOSHI_ID:1717});
      var zdData = zuoDaReappear();
      console.log(1111);
      console.log(zdData);
      if (zdData) {
        console.log(zdData);
        var htmlCont = artTpl(__dirname + '/../app/views/partials/zddownload', data);
        res.send(htmlCont);
      }
      else {
        console.log(res.error);
      }
    });

  }

  return {bind: _bind}
};
