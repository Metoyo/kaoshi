define(['../../angular/angular'], function (angular) {
  'use strict';

  angular.module('kaoshiApp.filters.Mylocaldate', [])
  	.filter('myLocalDate', function () {
      return function (dateStr) {
        var mydate = new Date(dateStr),
            difMinutes = mydate.getTimezoneOffset(), //与本地相差的分钟数
            difMilliseconds = mydate.valueOf() + difMinutes * 60 * 1000; //与本地相差的毫秒数
      	return difMilliseconds;
      };
  	});
});
