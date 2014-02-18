/**
 * @author Songtao
 */
exports.router = function(app){
	var renzheng = require('./renzheng').new(app),
		dagang = require('./mingti').new(app);
		
/* 认证系统的路由 （renzheng） 开始*/
	//app.get('/', login.checkNotLogin);
	app.get('/', renzheng.loginRender); //展示登录信息
		
	//app.post('/signin', checkNotLogin); 
	app.post('/signin', renzheng.signin); //登录
	
	app.get('/logout', renzheng.logout); //退出登录
	
	app.get('/register', renzheng.registerRender); //展现注册界面
	
	app.post('/register/submit', renzheng.register); //提交注册信息
	
	app.get('/user/:user', renzheng.profile); //展示个人详情页
/* 认证系统的路由 （renzheng） 结束*/

/* 大纲的路由 （dagang） 开始*/
	//登陆的路由  
	//app.get('/', login.checkNotLogin);
	app.get('/dagang', mingti.dagangRender); //展示登录信息
		
	//app.post('/signin', checkNotLogin); 
	//app.post('/signin', login.signin); //登录
	
	//app.get('/logout', login.logout); //退出登录
	
	//app.get('/register', login.registerRender); //展现注册界面
	
	//app.post('/register/submit', login.register); //提交注册信息
	
	//app.get('/user/:user', login.profile); //展示个人详情页
/* 大纲的路由 （dagang） 结束*/
	//检查未登录用户
	function checkLogin (req, res, next) {
		if(!req.session.user){
			req.flash('error','未登录');
			return res.redirect('/');
		}
		else{
			next();
		}
	};
	
	//检查已登录用户
	function checkNotLogin (req, res, next) {
		if(req.session.user){
			var startPositon = req.headers.host.length + 7,//7 is 'http://' length;
				browerUrl = req.headers.referer.substring(startPositon);
				
			req.flash('error','已登录');
			
			return res.redirect(browerUrl);
		}
		else{
			next();
		}
	}
};