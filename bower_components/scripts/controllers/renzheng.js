define([
  '../../jquery/jquery',
  'underscore',
  'angular',
  'config'
], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.RenzhengCtrl', [])
    .controller('RenzhengCtrl', ['$rootScope', '$scope', '$location', '$http', 'urlRedirect',
      function ($rootScope, $scope, $location, $http, urlRedirect) {

        var loginApiUrl = config.apiurl_rz + 'denglu',
            login = {
              userName: '',
              password: ''
            },
            loginPostParams,
            session = {},
          currentPath = $location.$$path;
        $rootScope.session = session;
        $rootScope.pageName = "云教授";//页面名称
        $rootScope.isRenZheng = true; //判读页面是不是认证
        $rootScope.dashboard_shown = false;
        $scope.login = login;

        /**
         * getShiYanData
         */
//        $scope.getShiYanData = function(){
//          $http.get('http://192.168.1.210:3020/bloglist').success(function(data){
//            if(data){
//              console.log(data);
//            }
//          });
//        };

        /**
         * 登录程序
         */
        $scope.signIn = function() {
          if(login.userName && login.password) {
            /**
             * 构建登陆回传参数，token, 用户名， 密码
             * @type {{token: (config.token|*), yonghuming: string, mima: string}}
             */
            loginPostParams = {
              token : config.token,
              yonghuming : login.userName,
              mima : login.password
            };

            //登录信息的验证 //
            $http.post(loginApiUrl, loginPostParams).success(function(result) {
              session.info = result[0];
              console.log(session.info);
              session.userInfo = '';
              if(result.error){
                $scope.dengluInfo = result;
              }
              else{
                var profileUrl = '/user/' + login.userName,
                  permissionApiUrl = config.apiurl_rz + 'yonghu_quanxian?token=' + config.token + '&yonghuid=' +
                    session.info.UID,//查询用户权限的url

                  yhxxxxApiUrl = config.apiurl_rz + 'yonghu_xiangxi_xinxi?token=' + config.token + '&yonghuid=' +
                    session.info.UID; //通过UID查询用户详细的url

                /**
                 *查询过用户的详细信息，得到jigouid,lingyuid等等 JUESE
                 */
                $http.get(yhxxxxApiUrl).success(function(data){
                  if(data.JIGOU.length){
                    if(data.JUESE){
                      session.userInfo = data;
                      console.log(session.userInfo);
                      var jsArr = _.chain(data.JUESE)
                          .sortBy(function(js){ return js.JUESE_ID; })
                          .map(function(js){ return js.JUESE_ID; })
                          .uniq()
                          .without("9", "10")
                          .value(); //得到角色的数组
                      if(jsArr[0] == 1){
                        urlRedirect.goTo(currentPath, profileUrl);
                      }
                      else{
                        /**
                         * 查询用户权限的代码，用来导航，如果权限中包含QUANXIAN_ID包含4就导向审核页面，否则去相对应的页面
                         */
                        $http.get(permissionApiUrl).success(function(permissions) {
                          var find_QUANXIAN_ID_4, find_QUANXIAN_ID_5;

                          find_QUANXIAN_ID_4 = _.find(permissions, function(permission) {
                            return permission.QUANXIAN_ID == 2004;
                          });

                          find_QUANXIAN_ID_5 = _.find(permissions, function(permission) {
                            return permission.QUANXIAN_ID == 2005;
                          });

                          if(find_QUANXIAN_ID_4 || find_QUANXIAN_ID_5) {
                            urlRedirect.goTo(currentPath, profileUrl);
                          }
                          else {
                            if(data.LINGYU.length == 1){
                              session.defaultLyId = data.LINGYU[0].LINGYU_ID;
                              session.defaultLyName = data.LINGYU[0].LINGYUMINGCHENG;
                              //得到数组的第一位，-1的目的是为了转化为索引
                              var jsUrl = config.quanxianObj[parseInt(jsArr[0]) - 1].juese_url;
                              session.jueseStr = _.map(jsArr, function(jsm){return 'juese' + jsm}).join();
                              urlRedirect.goTo(currentPath, jsUrl);
                            }
                            else{
                              urlRedirect.goTo(currentPath, '/lingyu');
                            }
                          }
                        });
                      }
                    }
                    else{
                      alert('您注册的信息正在审核中，新耐心等待……');
                    }
                  }
                  else{
                    alert('您注册的信息正在审核中，新耐心等待……');
                  }
                }).error(function(err){
                  alert(err);
                });
              }

            }).error(function(err){
                console.log(err);
            });
          }
        };

    }]);
});