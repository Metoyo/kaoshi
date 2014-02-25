define([
  'jquery',
  'underscore',
  'angular',
  'config',
  'services/urlredirect'
], function ($, _, angular, config, UrlredirectService) {
  'use strict';

  angular.module('kaoshiApp.controllers.RenzhengCtrl', [])
    .controller('RenzhengCtrl', ['$rootScope', '$scope', '$location', '$http', 'urlRedirect',
      function ($rootScope, $scope, $location, $http, urlRedirect) {
        var loginApiUrl = config.apiurl_rz + 'denglu',
            login = {
              userName: '',
              password: ''
            },
            loginPostParams;
        $rootScope.pageName = "认证";//页面名称
        //$scope.cssPath = "renzheng";//调用dagang.css
        $rootScope.styles = [
          'styles/renzheng.css'
        ];
        $rootScope.dashboard_shown = false;

        $scope.login = login;

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

            $http.post(loginApiUrl, loginPostParams).success(function(result) {
              var profileUrl = '/user/' + login.userName,
                  session = {
                    info: result[0]
                  },
                  currentPath = $location.$$path,
                  permissionApiUrl = config.apiurl_rz + 'yonghu_quanxian?token=' + config.token + '&yonghuid=' +
                                      session.info.UID,//查询用户权限的url

                  yhxxxxApiUrl = config.apiurl_rz + 'yonghu_xiangxi_xinxi?token=' + config.token + '&yonghuid=' +
                                  session.info.UID; //通过UID查询用户详细的url

              /**
               *查询过用户的详细信息，得到jigouid,lingyuid等等
               */
              $http.get(yhxxxxApiUrl).success(function(data){
                session.userInfo = data;
              }).error(function(err){
                alert(err);
              });

              $rootScope.session = session;
              console.log($rootScope.session);

              //console.log('login result: ');
              //console.log(result);
              /**
               * 查询用胡权限的代码，用来导航，如果权限中包含QUANXIAN_ID包含4就导向审核页面，否则去相对应的页面
               */
              $http.get(permissionApiUrl).success(function(permissions) {
                var find_QUANXIAN_ID_4;

                //console.log('permission data: ');
                //console.log(permissions);

                find_QUANXIAN_ID_4 = _.find(permissions, function(permission) {
                  return permission.QUANXIAN_ID == 4;
                });

                if(find_QUANXIAN_ID_4) {
                  urlRedirect.goTo(currentPath, profileUrl);
                } else {
                  urlRedirect.goTo(currentPath, '/dagang');
                }

              });
            });
          }
        };

    }]);
});
