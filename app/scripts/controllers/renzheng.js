define(['jquery', 'underscore', 'angular', 'config'], function ($, _, angular, config) {
  'use strict';

  angular.module('kaoshiApp.controllers.RenzhengCtrl', [])
    .controller('RenzhengCtrl', function ($rootScope, $scope, $location, $http) {
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
                permissionApiUrl = config.apiurl_rz + 'yonghu_quanxian?token=' + config.token + '&yonghuid=' + session.info.UID;

            $rootScope.session = session;

            console.log('login result: ');
            console.log(result);

            $http.get(permissionApiUrl).success(function(permissions) {
              var find_QUANXIAN_ID_4;

              console.log('permission data: ');
              console.log(permissions);

              find_QUANXIAN_ID_4 = _.find(permissions, function(permission) {
                return permission.QUANXIAN_ID == 4;
              });

              if(find_QUANXIAN_ID_4) {
                //$location.path(profileUrl);
                $location.path('/mingti');
                $rootScope.$apply();
              } else {
                $location.path('/dagang');
                $rootScope.$apply();
              }

            });
          });
        }
      };

    });
});
