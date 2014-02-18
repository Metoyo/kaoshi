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
	
	return mingti = {
		//渲染大纲页面
		dagangRender : function(req, res) {
			//查询知识大纲 开始
			var user = req.session.user,
			 	userUID = user[0].UID,
			 	userDetails;
			console.log(userUID);
			var apiUrlUserDetails = conf.apiurl_rz + '/api/yonghu_xiangxi_xinxi?token=' + conf.token + '&yonghuid=' + userUID;//查询用户详情url
			qGet(request, apiUrlUserDetails)//查询用户详情，并得到查询大纲所需要的数据
			    .then(function (data) {
			        if (data.body.error) {
			            throw new Error(data.body.error);
			        }
			        userDetails = data.body;
			        //console.log(userDetails);
			        var apiUrlCxzsdg = conf.apiurl_mt + '/api/chaxun_zhishidagang?token=' + conf.token + '&caozuoyuan=' + userUID
								+ '&jigouid=' + userDetails.JIGOU[0].JIGOU_ID + '&lingyuid=' + userDetails.LINGYU[0].LINGYU_ID
								+ '&chaxunzilingyu=true';//查询大纲所需要的url
					var apiUrlCxzsdgzsd = conf.apiurl_mt + '/api/chaxun_zhishidagang_zhishidian?token=' + conf.token + '&caozuoyuan=' + userUID
                                + '&jigouid=' + userDetails.JIGOU[0].JIGOU_ID + '&lingyuid=' + userDetails.LINGYU[0].LINGYU_ID;//查询大纲知识点所需要的url
                    app.data.cxzsdgzsd = apiUrlCxzsdgzsd;
			        return qGet(request, apiUrlCxzsdg);
			    })
			    .then(function (data) { //查询知识大纲
			        if (data.body.error) {
			            throw new Error(data.body.error);
			        }
			        console.log(data.body);
			        app.data.cxzsdg = data.body;
			        app.data.title = "大纲添加";
                    app.data.pathName = "mingti";
                    app.data.user = user;
                    //app.data.success = req.flash('success').toString();
                    //app.data.error = req.flash('error').toString();
                    res.render('mingti/dagang.hbs', app.data);
			    })
			    .fail(function (error) {
			        console.log(error.message);
			    });
			//查询知识大纲 结束
			
		}
	};
};