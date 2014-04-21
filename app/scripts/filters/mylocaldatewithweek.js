define(['angular'], function (angular) {
  'use strict';

  angular.module('kaoshiApp.filters.Mylocaldatewithweek', [])
  	.filter('myLocalDateWithWeek', function () {
      return function (dateStr) {
        var mydate = new Date(dateStr),
          year = mydate.getUTCFullYear(), //根据世界时从 Date 对象返回四位数的年份
          month = mydate.getUTCMonth() + 1, //根据世界时从 Date 对象返回月份 (0 ~ 11)
          day = mydate.getUTCDate(), //根据世界时从 Date 对象返回月中的一天 (1 ~ 31)
          week = mydate.getUTCDay(), //根据世界时从 Date 对象返回周中的一天 (0 ~ 6)
          hour = mydate.getUTCHours(), //根据世界时返回 Date 对象的小时 (0 ~ 23)
          minute = mydate.getUTCMinutes(), //根据世界时返回 Date 对象的分钟 (0 ~ 59)
          joinDate, //返回最终时间
          weekday = new Array(7); //定义一个星期的数组
        weekday[0] = "星期日";
        weekday[1] = "星期一";
        weekday[2] = "星期二";
        weekday[3] = "星期三";
        weekday[4] = "星期四";
        weekday[5] = "星期五";
        weekday[6] = "星期六";
        if(month < 10){
          month = '0' + month;
        }
        if(day < 10){
          day = '0' + day;
        }
        if(hour < 10){
          hour = '0' + hour;
        }
        if(minute < 10){
          minute = '0' + minute;
        }
        joinDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ' ' + weekday[week];

      	return joinDate;
      };
  	});
});
