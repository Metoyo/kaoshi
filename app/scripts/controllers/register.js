define([
  'jquery',
  'underscore',
  'angular',
  'config',
  'services/urlredirect',
  'directives/passwordverify'
], function ($, _, angular, config, UrlredirectService, passwordVerify) {
  'use strict';

  angular.module('kaoshiApp.controllers.RegisterCtrl', [])
    .controller('RegisterCtrl', ['$rootScope', '$scope', '$location', '$http', '$q', 'urlRedirect',
      function ($rootScope, $scope,$location, $http, $q, urlRedirect) {
        var apiUrlLy = config.apiurl_rz + 'lingYu?token=' + config.token + '&leibieid=1', //lingYu 学科领域的api
            apiLyKm = config.apiurl_rz + 'lingYu?token=' + config.token + '&parentid=', //由lingYu id 的具体的学科
            apiUrlJglb = config.apiurl_rz + 'jiGou_LeiBie?token=' + config.token, //jiGouLeiBie 机构类别的api
            apiUrlJueSe = config.apiurl_rz + 'jueSe?token=' + config.token, //jueSe 查询科目权限的数据的api
            jiGou_LeiBieUrl = config.apiurl_rz + 'jiGou?token=' + config.token + '&leibieid=', //由机构类别查询机构的url
            select_juese = [], //得到已选择的角色[{jigou: id, lingyu: id, juese: id}, {jigou: id, lingyu: id, juese: id}]
            registerDate = {}, // 注册时用到的数据
            jigouId, //所选的机构ID
            registerUrl = config.apiurl_rz + 'zhuce'; //提交注册信息的url

        $rootScope.pageName = "新用户注册";//页面名称
        $rootScope.styles = [
          'styles/renzheng.css'
        ];
        $rootScope.dashboard_shown = false;
        $scope.phoneRegexp = /^[1][3458][0-9]{9}$/; //验证手机的正则表达式
        $scope.emailRegexp = /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9]\.[a-z\.]{1,}[a-z]$/; //验证邮箱的正则表达式
        $scope.userNameRegexp = /^.{4,30}$/;//用户名的正则表达式
        $scope.passwordRegexp = /^.{6,20}$/;//密码的正则表达式
        $scope.objectWrap = false;

        //$scope.jigoulb_list = [];
        //$scope.lingyu_list = [];

        /**
         * 注册信息的第一步，个人详情信息
         */

        $scope.personalInfo = {
          yonghuming: '',
          mima: '',
          youxiang: '',
          xingming: '',
          shouji: ''
        };
        registerDate = $scope.personalInfo;
        /**
         * 个人详情信息完整后，去第二步
         */
        $scope.validatePersonalInfo = function(){
          $('.tab-pane').removeClass('active').eq(1).addClass('active');
        };

        /**
         * 查询机构类别
         */
        $http.get(apiUrlJglb).success(function(data) {
          $scope.jigoulb_list = data;
        });

        /**
         * 由机构类别查询机构 getJgId
         */
        var select
        $scope.getJglist = function(jglbId){
          $http.get(jiGou_LeiBieUrl + jglbId).success(function(data) {
            $scope.jigou_list = data;
          });
        };

        /**
         * 得到机构id
         */
        $scope.getJgId = function(jgId){
          jigouId = jgId;
        };

        /**
         * 查询父领域的代码
         */
        $http.get(apiUrlLy).success(function(data) {
          $scope.lingyu_list = data;
        });

        /**
         * 有父领域查询子领域领域（即科目）
         */
        //$scope.objectWrap = false;
        $scope.getKemuList = function(lyId){
          $http.get(apiLyKm + lyId).success(function(data) {
            $scope.kemu_list = data;
          });
        };

        /**
         *  查询角色的代码
         */
        $http.get(apiUrlJueSe).success(function(data) {
          $scope.juese_list = data;
        });

        /**
         * 添加科目和权限
         */
        var objAndRightList = [];
        $scope.getObjectAndRight = function(){
          var objAndRightObj = {
            lingyu:'',
            juese:{
              jueseId: '',
              jueseName: ''
            }
          };
          objAndRightObj.lingyu = $scope.kemu_list.splice(selectedLingYuIndex,1);
          objAndRightObj.juese.jueseId = selectJueseIdArr;
          objAndRightObj.juese.jueseName = selectJueseNameArr;
          objAndRightList.push(objAndRightObj);
          $scope.objAndRight = objAndRightList;
          $('input[name=rightName]:checked').prop('checked', false);
          $scope.jueseValue = false;
          $scope.linyuValue = false;
        };

        /**
         * 获得领域lingyu（选择科目）的值
         */
        var selectedLingYuIndex;
        $scope.getLingYuVal = function(idx){
          selectedLingYuIndex = '';
          selectedLingYuIndex = idx;
          $scope.linyuValue = idx >=0 ? true : false;
        };

        /**
         * 获得角色juese（科目权限）的代码
         */
        var selectJueseIdArr = [],
            selectJueseNameArr = [];
        $scope.getJueSeArr = function(){
          selectJueseIdArr = [];
          selectJueseNameArr = [];
          var jueseItem = $('input[name=rightName]:checked');
          _.each(jueseItem,function(js, idx, lst){
            selectJueseIdArr.push(js.value);
            selectJueseNameArr.push(js.nextElementSibling.textContent);
          });
          $scope.jueseValue = selectJueseIdArr.length;
        };

        /**
         *  删除一条已选科目
         */
        $scope.delSelectedObject = function(idx){
          var deleteObjectAndRight = $scope.objAndRight.splice(idx, 1);
          $scope.kemu_list.push(deleteObjectAndRight[0].lingyu[0]);
        };

        /**
         * 回到填写个人信息页面
         */
        $scope.goToPersonInfo = function(){
          $('.tab-pane').removeClass('active').eq(0).addClass('active');
        };

        /**
         * 去提交个人信息页面
         */
        $scope.goToSubmit = function(){
          select_juese = [];
          _.each(objAndRightList, function(oar, indx, lst){
            _.each(oar.juese.jueseId, function(jsid, idx, lst){
              var jueseObg = {
                jigou: jigouId,
                lingyu: '',
                juese: ''
              };
              jueseObg.lingyu = oar.lingyu[0].LINGYU_ID;
              jueseObg.juese = jsid;
              select_juese.push(jueseObg);
            });
          });
          $('.tab-pane').removeClass('active').eq(2).addClass('active');
        };

        /**
         * 去提交个人信息页面 getObjectAndRight
         */
        $scope.goToJueSe = function(){
          $('.tab-pane').removeClass('active').eq(1).addClass('active');
        };

        /**
         * 去提交个人信息页面
         */
        $scope.submitRegisterInfo = function(){
          registerDate.token = config.token;
          registerDate.juese = select_juese;
          $http.post(registerUrl, registerDate).success(function(data){
            console.log(data);
            if(data.result){
              alert('提交成功！');
              urlRedirect.goTo($location.$$path, '/renzheng');
            }
            else{
              alert(data.error);
            }
          })
          .error(function(err){
            alert(err);
          });
        };

    }]);
});
