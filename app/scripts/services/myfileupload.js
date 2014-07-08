define(['angular'], function (angular) {
  'use strict';

  angular.module('kaoshiApp.services.Myfileupload', [])
	.service('Myfileupload', ['$http', function Myfileupload($http) {
      this.uploadFileAndFieldsToUrl = function(file, fields, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        for(var i = 0; i < fields.length; i++){
          fd.append(fields[i].name, fields[i].data)
        }
        $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
        })
          .success(function(data){
            console.log(data);
          })
          .error(function(error){
            console.log(error);
          });
      }
	}]);
});
