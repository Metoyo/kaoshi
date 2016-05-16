exports.api = function (config, logger) {
  return new API(config, logger);
};

function API(config, logger) {
  var artTpl = require('art-template');
  var request = require('request');
  var Lazy = require('lazy.js');
  var cnNumArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五',
    '十六', '十七', '十八', '十九', '二十'];
  var letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  var localUtils = require('local-utils');
  var tools = localUtils.tools;
  var fs = require('fs');
  var path = require('path');
  var Q = require('q');
  var qMap = tools.qMap;
  //生成作答时候的题目格式化
  var formatDaAn = function(tm) {
    var newCont;
    var daAnFormatReg = new RegExp('<\%{.*?}\%>', 'g');
    if (tm.TIXING_ID == 6 || tm.TIXING_ID == 19) { //填空题
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
          var daObj = JSON.parse(tkKsDa[key]);
          finalDaAn.push(daObj['用户答案']);
        }
        _len = finalDaAn.length;
        newCont = tm.TIGAN.tiGan.replace(daAnFormatReg, function (arg) {
          var xhStr = '';
          if(tm.TIXING_ID == 6){
            xhStr = '<span class="ar-tk-da">' + finalDaAn[count] + '</span>';
          }
          else{
            xhStr = '<span class="ar-tk-da">' + '        ' + '</span>';
          }
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
    //作答重现的答案处理
    if (tm.KAOSHENGDAAN) {
      if (tm.TIXING_ID >= 9) {
        var jstKsDa = tm.KAOSHENGDAAN,
          jstKsFinalDaAn = [];
        if (typeof(jstKsDa) == 'string') {
          jstKsDa = JSON.parse(jstKsDa);
        }
        for (var key in jstKsDa) {
          var bdDaObj = JSON.parse(jstKsDa[key]);
          jstKsFinalDaAn.push('<img src="' + bdDaObj['用户答案'] + '"/>');
        }
        tm.KAOSHENGDAAN = jstKsFinalDaAn.join(' ');
      }
    }
  };
  //var formatDaAn = function (tm) {
  //  var newCont;
  //  var daAnFormatReg = new RegExp('<\%{.*?}\%>', 'g');
  //  if (tm.TIXING_ID == 6 || tm.TIXING_ID == 19) { //填空题
  //    //修改填空题的答案
  //    var tkDaAnArr = [],
  //      tkDaAn = JSON.parse(tm.DAAN),
  //      tkDaAnStr;
  //    Lazy(tkDaAn).each(function (da, idx, lst) {
  //      tkDaAnArr.push('第' + (idx + 1) + '个空：' + da.answer);
  //    });
  //    tkDaAnStr = tkDaAnArr.join(';');
  //    tm.DAAN = tkDaAnStr;
  //    //修改填空题的题干
  //    if (tm.KAOSHENGDAAN) {
  //      var tkKsDa = tm.KAOSHENGDAAN,
  //        finalDaAn = [],
  //        _len = '',
  //        count = 0;
  //      if (typeof(tkKsDa) == 'string') {
  //        tkKsDa = JSON.parse(tkKsDa);
  //      }
  //      for (var key in tkKsDa) {
  //        finalDaAn.push(tkKsDa[key]);
  //      }
  //      _len = finalDaAn.length;
  //      newCont = tm.TIGAN.tiGan.replace(daAnFormatReg, function (arg) {
  //        var xhStr = '';
  //        if(tm.TIXING_ID == 6){
  //          xhStr = '<span class="ar-tk-da">' + finalDaAn[count] + '</span>';
  //        }
  //        else{
  //          xhStr = '<span class="ar-tk-da">' + '        ' + '</span>';
  //        }
  //        count++;
  //        return xhStr;
  //      });
  //    }
  //    else {
  //      newCont = tm.TIGAN.tiGan.replace(daAnFormatReg, function (arg) {
  //        var text = arg.slice(2, -2),
  //          textJson = JSON.parse(text),
  //          _len = textJson.size,
  //          i, xhStr = '';
  //        for (i = 0; i < _len; i++) {
  //          xhStr += '_';
  //        }
  //        return xhStr;
  //      });
  //    }
  //    tm.TIGAN.tiGan = newCont;
  //  }
  //  //作答重现的答案处理
  //  if (tm.KAOSHENGDAAN) {
  //    if (tm.TIXING_ID >= 9) {
  //      var jstKsDa = tm.KAOSHENGDAAN,
  //        jstKsFinalDaAn = [];
  //      if (typeof(jstKsDa) == 'string') {
  //        jstKsDa = JSON.parse(jstKsDa);
  //      }
  //      for (var key in jstKsDa) {
  //        jstKsFinalDaAn.push('<img src="' + jstKsDa[key] + '"/>');
  //      }
  //      tm.KAOSHENGDAAN = jstKsFinalDaAn.join(' ');
  //    }
  //  }
  //};

  //生成答案的格式化函数
  var formatDaAnBz = function(tm){
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
    else if(tm.TIXING_ID == 6 || tm.TIXING_ID == 19){ //填空题
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
          if(tm.TIXING_ID == 6){
            xhStr = '<span class="ar-tk-da">' + finalDaAn[count] + '</span>';
          }
          else{
            xhStr = '<span class="ar-tk-da">' + '        ' + '</span>';
          }
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

  var baseTjAPIUrl = 'http://127.0.0.1:4300/api/';
  var htmlToPdf = 'http://127.0.0.1:5500/html2pdf?pdfname=';
  var localUrl = 'http://127.0.0.1';
  var qs = require('querystring');

  /**
   * 得到题目文件
   */
  var conter = 0;
  this.getTiMuPage = function(req, res){
    conter ++;
    var params = tools.paramsFromRequest(req);
    console.log(conter);
    var token = params.token;
    var uid = params.uid;
    var kaoshiid = params.kaoshiid;
    var xingming = params.xingming;
    var yonghuhao = params.yonghuhao;
    var banji = params.banji;
    var defen = params.defen;
    var pdflx = params.pfdtype;
    var dataDis;
    var finaData = {
      sj_name: '',
      cnNumArr: cnNumArr,
      letterArr: letterArr,
      sj_tm: [],
      stu_obj: {
        XINGMING: xingming,
        YONGHUHAO: yonghuhao,
        BANJI: banji,
        ZUIHOU_PINGFEN: defen
      }
    };
    var getTiMuUrl = baseTjAPIUrl + 'answer_reappear?token=' + token + '&kaoshengid=' + uid + '&kaoshiid=' + kaoshiid;
    var optionsTm = {
      url: getTiMuUrl,
      headers: {
        'User-Agent': 'request'
      }
    };
    request(optionsTm, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var tmData = {cont: ''};
        tmData.cont = body;
        var data = JSON.parse(tmData.cont);
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
          var htmlTpl = '';
          if(pdflx == 'zuoda'){
            htmlTpl = '/../app/views/partials/zddownload';
          }
          if(pdflx == 'daan'){
            htmlTpl = '/../app/views/partials/zddownloadda';
          }
          artTpl.config('escape', false);
          var htmlCont = artTpl(__dirname + htmlTpl, finaData);
          res.send(htmlCont);
        }
      }
      else{
        console.log(error);
      }
    });
  };

  /**
   * 生成pdf，批量
   */
  this.createPdf = function(req, res){
    var params = tools.paramsFromRequest(req);
    var token = params.token;
    var kaozhizuid = params.kaozhizuid;
    var pfdtype = params.pfdtype;
    var xuexiaoname = params.xuexiaoname;
    var kaoshizuname = params.kaoshizuname;
    var chaXunKaoShengUrl = baseTjAPIUrl + 'query_kaosheng_of_banji?token=' + token + '&kaoshizuid=' + kaozhizuid;
    var optionsKs = {
      url: chaXunKaoShengUrl,
      headers: {
        'User-Agent': 'request'
      }
    };
    kaoshengObj = '';
    request(optionsKs, function (error, response, students) {
      if (!error && response.statusCode == 200) {
        if(students && students.length > 0){
          var ksData = {student: ''};
          ksData.student = students;
          var stuData = JSON.parse(ksData.student);
          var stuObj = Lazy(stuData).groupBy('KEXUHAO_MINGCHENG').toObject();
          //创建机构的目录的代码
          var daXuePath = 'D:/pdf/' + xuexiaoname;
          if (fs.existsSync(daXuePath)) {
            console.log('已经创建过此更新目录了');
          } else {
            fs.mkdirSync(daXuePath);
            console.log('更新目录已创建成功\n');
          }
          //创建考试组的目录的代码
          var kaoShiZuPath = 'D:/pdf/' + xuexiaoname + '/' + kaoshizuname;
          if (fs.existsSync(kaoShiZuPath)) {
            console.log('已经创建过此更新目录了');
          } else {
            fs.mkdirSync(kaoShiZuPath);
            console.log('更新目录已创建成功\n');
          }
          if(pfdtype == 'zuoda'){
            Lazy(stuObj).each(function(v, k, l){
              //创建课序号目录代码
              var keXuHaoPath = kaoShiZuPath + '/' + k;
              if (fs.existsSync(keXuHaoPath)) {
                console.log('已经创建过此更新目录了');
              } else {
                fs.mkdirSync(keXuHaoPath);
                console.log('更新目录已创建成功\n');
              }
              Lazy(v).each(function(stu){
                if(stu.ZUIHOU_PINGFEN !== null && stu.ZUIHOU_PINGFEN >= 0){
                  //var stuInfo = {
                  //    token: token,
                  //    uid: stu.UID,
                  //    kaoshiid: stu.KAOSHI_ID,
                  //    xingming: stu.XINGMING,
                  //    yonghuhao: stu.YONGHUHAO,
                  //    banji: stu.BANJI,
                  //    defen: stu.ZUIHOU_PINGFEN,
                  //    pdflx: params.pfdtype
                  //};
                  //kaoshengObj = stuInfo;
                  var orgUrl = localUrl + '/zuoda_pdf?token=' + token + '&uid=' + stu.UID + '&kaoshiid=' + stu.KAOSHI_ID +
                    '&xingming=' + encodeURIComponent(stu.XINGMING) + '&yonghuhao=' + stu.YONGHUHAO + '&banji=' + encodeURIComponent(stu.BANJI) +
                    '&defen=' + stu.ZUIHOU_PINGFEN + '&pfdtype=' + pfdtype;
                  var renderPdfUrl = htmlToPdf + stu.YONGHUHAO + '.pdf';
                  var optionsTm = {
                    url: renderPdfUrl,
                    headers: {
                      'User-Agent': 'request'
                    },
                    qs: {
                      url: orgUrl
                    }
                  };
                  console.log(optionsTm);
                  var fileName = keXuHaoPath + '/' + stu.YONGHUHAO + '.pdf';
                  request(optionsTm).pipe(fs.createWriteStream(fileName));
                }
              });
            });
          }
          if(pfdtype == 'daan'){
            var breakable = false;
            //创建课序号目录代码
            var biaoZhunDaAnPath = kaoShiZuPath + '/' + kaoshizuname + '标准答案';
            if (fs.existsSync(biaoZhunDaAnPath)) {
              console.log('已经创建过此更新目录了');
            } else {
              fs.mkdirSync(biaoZhunDaAnPath);
              console.log('更新目录已创建成功\n');
            }
            Lazy(stuObj).each(function(v, k, l){
              Lazy(v).each(function(stu){
                if(stu.ZUIHOU_PINGFEN !== null && stu.ZUIHOU_PINGFEN >= 0){
                  var stuInfo = {
                    token: token,
                    uid: stu.UID,
                    kaoshiid: stu.KAOSHI_ID,
                    xingming: stu.XINGMING,
                    yonghuhao: stu.YONGHUHAO,
                    banji: stu.BANJI,
                    defen: stu.ZUIHOU_PINGFEN,
                    pdflx: params.pfdtype
                  };
                  kaoshengObj = stuInfo;
                  var renderPdfUrl = htmlToPdf + stu.YONGHUHAO + '.pdf' + '&url=' + localUrl + '/zuoda_pdf';
                  var optionsTm = {
                    url: renderPdfUrl,
                    headers: {
                      'User-Agent': 'request'
                    }
                  };
                  var fileName = biaoZhunDaAnPath + '/' + kaoshizuname + '标准答案' + '.pdf';
                  request(optionsTm).pipe(fs.createWriteStream(fileName));
                  breakable = true;
                  return false;
                }
              });
              if (breakable) return false;
            });
          }
        }
      }
      else{
        console.log(error);
      }
    });
  };

  /**
   * 生成pdf，单个
   */
  this.createPdfSingle = function(req, res){
    var params = tools.paramsFromRequest(req);
    var token = params.token;
    var uid = params.uid;
    var kaoshiid = params.kaoshiid;
    var xingming = params.xingming;
    var yonghuhao = params.yonghuhao;
    var banji = params.banji;
    var defen = params.defen;
    var pfdtype = params.pfdtype;
    var savePath = 'D:/pdf';
    if (fs.existsSync(savePath)) {
      console.log('已经创建过此更新目录了');
    } else {
      fs.mkdirSync(savePath);
      console.log('更新目录已创建成功\n');
    }
    var renderPdfUrl = htmlToPdf + yonghuhao + '.pdf' + '&url=' + localUrl + '/zuoda_pdf';
    var optionsTm = {
      url: renderPdfUrl,
      headers: {
        'User-Agent': 'request'
      }
    };
    var fileName = savePath + '/' + yonghuhao + '.pdf';
    request(optionsTm).pipe(fs.createWriteStream(fileName));
  };

  //api结束
}
