/**
 * @title 考试网站路由
 * @overview 建立访问路径与api的映射
 * @copyright (c) 2013 泰安厅教育科技有限公司
 * @author 曾勇
 */
exports.router = function (config, logger) {
  function _bind(app, express) {
    var api = require('./api.js').api(config, logger);
    // 静态路由
    app.use('/', express.static(
      require('path').resolve(__dirname + '/../app')
    ));

    // 依赖库
    var http = require('http');
    var path = require('path');
    //路由转发
    //function routeForward(reqData, callback) {
    //    var urlArr = reqData.url.split('/'), kindUrl, reqUrl, opt, dataStr, dataHeader;
    //    urlArr.shift();
    //    kindUrl = urlArr[0];
    //    urlArr.shift();
    //    reqUrl = '/api/' + urlArr.join('/');
    //    dataHeader = reqData.headers;
    //
    //    opt = {
    //        host: '127.0.0.1',
    //        port: '',
    //        path: reqUrl,
    //        method: reqData.method,
    //        headers: ''
    //    };
    //    switch (kindUrl) {
    //        case 'renzheng' :
    //            opt.port = 3000;
    //            break;
    //        case 'mingti' :
    //            opt.port = 4000;
    //            break;
    //        case 'kaowu' :
    //            opt.port = 4100;
    //            break;
    //        case 'tongji' :
    //            opt.port = 4300;
    //            break;
    //    }
    //    if (reqData.method == 'POST') {
    //        dataStr = JSON.stringify(reqData.body);
    //        dataHeader['Content-Type'] = 'application/json';
    //        dataHeader['Content-Length'] = dataStr.length;
    //        opt.headers = dataHeader;
    //
    //        var reqFun = http.request(opt, function (result) {
    //            result.setEncoding('utf8');
    //            result.on('data', function (chunk) {
    //                console.log('BODY: ' + chunk);
    //                if (callback) {
    //                    callback(chunk);
    //                }
    //            });
    //        });
    //        reqFun.on('error', function (e) {
    //            console.log('problem with request: ' + e.message);
    //        });
    //        //write data to request body
    //        reqFun.write(dataStr);
    //        reqFun.end();
    //    }
    //    else {
    //        var reqFun = http.request(opt, function (result) {
    //            result.on('data', function (d) {
    //                if (callback) {
    //                    callback(d);
    //                }
    //            });
    //        });
    //        reqFun.end();
    //    }
    //}
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
    app.get('/create_pdf', api.createPdf);
    app.get('/zuoda_pdf', api.getTiMuPage);
    app.get('/create_pdf_single', api.createPdfSingle);
  }

  return {bind: _bind}
};
