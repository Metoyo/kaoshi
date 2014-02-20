/**
 * Module dependencies.
 */
var express = require('express'),
	http = require('http'),
	path = require('path'),
	app = express(),
	flash = require('connect-flash'),
	hbs = require('hbs');
	
/**
 * Handlebars register partial
*/
hbs.registerPartials(__dirname + '/views/partials');

//初始化data数据
app.data = {
	title: ''
};

app.conf = require('./config').conf;
// all environments
app.set('port', process.env.PORT || 3003);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({
    secret: app.conf.secret,
    maxAge: new Date(Date.now() + 3600000)
    //store: new app.mongoStore(app.conf.db)
}));
app.use(flash());
app.use(app.router);//注意use的顺序问题
app.use('/mingti', express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, 'public')));
//使用flash信息提示
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.use(function (req, res, next) {
	var err = req.flash('error'),
		success = req.flash('success');
	res.locals.user = req.session.user;
	res.locals.error = err.length ? err : null;
	res.locals.success = success.length ? success : null;
	next();
});

//创建服务
if (!module.parent) {
    app.listen(app.get('port'));
    console.log('Listening on port %d...', app.get('port'));
} else {
    exports = module.exports = app;
}

//添加路由
var router = require('./routes/router.js').router(app);