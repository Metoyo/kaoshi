define(['angular'], function (angular) {
  'use strict';

  /**
   * @ngdoc service
   * @name tatApp.DataService
   * @description
   * # DataService
   * Service in the tatApp.
   */
  angular.module('kaoshiApp.services.DataService', [])
	.service('DataService', ['$http', '$q', 'messageService',
    function ($http, $q, messageService) {
      //查询数据，GET方法
      this.getData = function(url){
        var deferred = $q.defer();
        $http.get(url).success(function(data){
          if(data && data.length > 0 ){
            deferred.resolve(data);
          }
          else{
            messageService.alertInfFun('err', data.error || '没有符合的数据！');
            deferred.reject(data.error);
          }
        });
        return deferred.promise;
      };
	}]);
});
