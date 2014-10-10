define([
  'jquery',
  'underscore',
  'angular',
  'config'
], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.RenzhengCtrl', [])
    .controller('RenzhengCtrl', ['$rootScope', '$scope', '$location', '$http', 'urlRedirect', '$cookieStore',
      'messageService',
      function ($rootScope, $scope, $location, $http, urlRedirect, $cookieStore, messageService) {

        var loginApiUrl = config.apiurl_rz + 'denglu',
            login = {
              userName: '',
              password: ''
            },
            loginPostParams,
            session = {},
          currentPath = $location.$$path;
        $rootScope.session = session;
        $rootScope.pageName = "太安厅";//页面名称
        $rootScope.isRenZheng = true; //判读页面是不是认证
        $rootScope.dashboard_shown = false;
        $scope.login = login;
        $rootScope.isPromiseAlterOthersTimu = false;

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

            //登录信息的验证
            $http.post(loginApiUrl, loginPostParams).success(function(result) {
              var jsArr, jsNewArr;
              session.info = result[0];
              session.userInfo = '';
              session.quanxian2032 = false;
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
                      jsArr = _.chain(data.JUESE)
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
                        var permissions = data.QUANXIAN,
                          find_QUANXIAN_ID_4, find_QUANXIAN_ID_5,
                          quanxianArr = [],
                          jsUrl, find_QUANXIAN_ID_2032;

                        find_QUANXIAN_ID_4 = _.find(permissions, function(permission) {
                          return permission.QUANXIAN_ID == 2004;
                        });

                        find_QUANXIAN_ID_5 = _.find(permissions, function(permission) {
                          return permission.QUANXIAN_ID == 2005;
                        });
                        //科目负责人修改他人的题目
                        find_QUANXIAN_ID_2032 = _.find(permissions, function(permission) {
                          return permission.QUANXIAN_ID == 2032;
                        });

                        if(find_QUANXIAN_ID_4 || find_QUANXIAN_ID_5) {
                          urlRedirect.goTo(currentPath, profileUrl);
                        }
                        else {
                          if(data.LINGYU.length == 1){
                            session.defaultLyId = data.LINGYU[0].LINGYU_ID;
                            session.defaultLyName = data.LINGYU[0].LINGYUMINGCHENG;
                            _.each(permissions, function(pms, idx, lst){
                              if(pms.QUANXIAN_ID == 2007 || pms.QUANXIAN_ID == 2010 || pms.QUANXIAN_ID == 2017
                                || pms.QUANXIAN_ID == 3001 || pms.QUANXIAN_ID == 4001){
                                quanxianArr.push(pms.QUANXIAN_ID);
                              }
                            });
                            quanxianArr = _.uniq(quanxianArr);
                            //得到数组的第一位，-1的目的是为了转化为索引
                            _.each(config.quanxianObj, function(qx, idx, lst){
                              if(qx.qx_id == quanxianArr[0]){
                                jsUrl = qx.juese_url;
                              }
                            });

                            session.quanxianStr = _.map(quanxianArr, function(qxm){return 'quanxian' + qxm}).join();
                            urlRedirect.goTo(currentPath, jsUrl);
                          }
                          else{
                            urlRedirect.goTo(currentPath, '/lingyu');
                          }
                        }

                        if(find_QUANXIAN_ID_2032){
                          $rootScope.isPromiseAlterOthersTimu = true;
                        }
                        else{
                          $rootScope.isPromiseAlterOthersTimu = false;
                        }
                      }
                      //cookies代码
                      jsNewArr = _.reject(data.JUESE, function(js){ return js.JUESE_ID == 2007 || js.JUESE_ID == 2017; });
                      var userCookie = {
                        UID: $rootScope.session.info.UID,
                        YONGHUMING: $rootScope.session.info.YONGHUMING,
                        defaultLyId: session.defaultLyId,
                        defaultLyName: session.defaultLyName,
                        quanxianStr: session.quanxianStr,
                        JIGOU: session.userInfo.JIGOU,
                        JUESE: jsNewArr
                      };
                      $cookieStore.put('logged', userCookie);
                    }
                    else{
                      messageService.alertInfFun('pmt', '您注册的信息正在审核中，新耐心等待……');
                    }
                  }
                  else{
                    messageService.alertInfFun('pmt', '您注册的信息正在审核中，新耐心等待……');
                  }
                });
              }
            });
          }
        };

    }]);
});
