/**
 * @author Songtao
 */
exports.new = function(app) {
	var request = require('request');
	var conf = require('../config').conf;
	var Q = require('q');
	//var User = {user: null};
	
	function qGet(request, url) {
	    var deferred = Q.defer();
	
	    request.get(url, function (error, response, body) {
	        if (!error) {
	            var data = {
	                response: response,
	                body: JSON.parse(body)
	            };
	            deferred.resolve(data);
	        } else {
	            deferred.reject(error);
	        }
	    });
	
	    return deferred.promise;
	};
	
	return renzheng = {
		//render login页面
		loginRender : function(req, res) {
			app.data.title = "欢迎来到太安厅";
			app.data.pathName = "renzheng";
			//app.data.success = req.flash('success').toString();
			//app.data.error = req.flash('error').toString();
			res.render('renzheng/login.hbs', app.data);
		},
		
		//点击登陆按钮后的程序
		signin : function(req, res) {
			var apiUrl = conf.apiurl_rz + '/api/denglu';
			app.data.title = "欢迎登陆太安厅";
			app.data.pathName = "renzheng";
			request.post(apiUrl, {
				form : {
					token : conf.token,
					yonghuming : req.body.yonghuming,
					mima : req.body.mima
				}
			}, function(error, response, body) {
				var user = JSON.parse(body);
				//console.log(user);
				if (!body.error) {
					app.data.user = req.session.user = user;
					var profileUrl = '/user/' + user[0].YONGHUMING;
					var userUID = user[0].UID;
					var apiUrlYhqx = conf.apiurl_rz + '/api/yonghu_quanxian?token=' + conf.token + '&yonghuid=' + userUID; //yonghu_quanxian 查询用户角色数据的api
					
					//查询用户权限 开始
					qGet(request, apiUrlYhqx)
					    .then(function (data) {
					        if (data.body.error) {
					            throw new Error(data.body.error);
					        }
					        var dataBodyLeth = data.body.length;
					        var fourLength = 0; //定义一个快关记录是否有 4
					        for(var i = 0; i < dataBodyLeth; i++){
					        	if(data.body[i].QUANXIAN_ID == 4){
					        		fourLength = 1;
					        		res.redirect(profileUrl);
					        		break;
					        	}
					        }
					        if(!fourLength){
					        	res.redirect('/dagang');
					        }
					    })
					    .fail(function (error) {
					        console.log(error.message);
					        res.redirect('/register');
					    });
					//查询用户权限 结束
				}
				else{
					res.redirect('/');
				}
			});
		},
		
		//个人详情页面 profile
		profile : function(req, res){
			app.data.title = "欢迎来到太安厅教育！";
			app.data.pathName = "renzheng";
			res.render('renzheng/user.hbs', app.data);
		},
		
		//注销按钮
		logout : function(req, res){
			app.data.user = req.session.user = null;
			//req.flash('success','登出成功');
			res.redirect('/');
		},
		
		//注册页面展示
		registerRender : function(req, res){
			var apiUrlLy = conf.apiurl_rz + '/api/lingYu?token=' + conf.token + '&leibieid=1'; //lingYu 学科领域的api
			var apiUrlJglb = conf.apiurl_rz + '/api/jiGou_LeiBie?token=' + conf.token; //jiGouLeiBie 机构类别的api
			var apiUrlJueSe = conf.apiurl_rz + '/api/jueSe?token=' + conf.token; //jueSe 查询科目权限的数据的api
			app.data.title = "欢迎注册！";
			app.data.pathName = "renzheng";
			
			qGet(request, apiUrlLy)
			    .then(function (data) {
			       // console.log('step 1 error: ', data.body.error);
			        //console.log('step 1 body: ', data.body);
			        if (data.body.error) {
			            throw new Error(data.body.error);
			        }
			        app.data.lingyu = data.body;
			        return qGet(request, apiUrlJglb);
			    })
			    .then(function (data) {
			       // console.log('step 2 error: ', data.body.error);
			        //console.log('step 2 body: ', data.body);
			        if (data.body.error) {
			            throw new Error(data.body.error);
			        }
			        app.data.jiGouLeiBie = data.body;
			        return qGet(request, apiUrlJueSe);
			    })
			    .then(function (data) {
			        // console.log('step 3');
			        // console.log('step 3 error: ', data.body.error);
			        //console.log('step 3 body: ', data.body);
			        if (data.body.error) {
			            throw new Error(data.body.error);
			        }
			        app.data.jueSe = data.body;
			    })
			    .then(function(){
			    	res.render('renzheng/register.hbs', app.data);
			    })
			    .fail(function (error) {
			        console.log(error.message);
			        res.redirect('/register');
			    });
		},
		
		//提交注册信息
		register : function(req, res){
			app.data.title = "欢迎注册！";
			app.data.pathName = "renzheng";
			var apiUrlReg = conf.apiurl_rz + '/api/zhuce';
			request.post(apiUrlReg, {
				form: {
			        token : conf.token,
			        yonghuming: req.body.yonghuming,
			        mima: req.body.mima,
			        youxiang: req.body.youxiang,
			        xingming: req.body.xingming,
			        shouji: req.body.shouji,
			        lingyu: [req.body.lingyu],
			        jigou: [req.body.jigou],
			        juese: JSON.parse(req.body.juese)
			    }
		    }, function (error, response, body) {
		    	console.log(body);
		        if (!body.error) {
					res.redirect('/');
				}
				else{
					//res.send(err.error);
					console.log(error);
					//return res.redirect('/');
				}
		    });
		}
	};
};