define([
  'jquery',
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
            session = {};
        $rootScope.session = session;
        $rootScope.pageName = "认证";//页面名称
        $rootScope.isRenZheng = true; //判读页面是不是认证
//        $rootScope.styles = [
//          'styles/renzheng.css'
//        ];
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
              session.info = result[0];
              if(result.error){
                $scope.dengluInfo = result;
              }
              else{
                var profileUrl = '/user/' + login.userName,
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
                  /**
                   * 查询用户权限的代码，用来导航，如果权限中包含QUANXIAN_ID包含4就导向审核页面，否则去相对应的页面
                   */
                  $http.get(permissionApiUrl).success(function(permissions) {
                    var find_QUANXIAN_ID_4;

                    find_QUANXIAN_ID_4 = _.find(permissions, function(permission) {
                      return permission.QUANXIAN_ID == 4;
                    });

                    if(find_QUANXIAN_ID_4) {
                      urlRedirect.goTo(currentPath, profileUrl);
                    }
                    else {
                      urlRedirect.goTo(currentPath, '/dagang');
                    }
                  });

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
