/**
 * Created by songtao on 15/12/9.
 */
var zuodaApp = angular.module('zuodaApp', []);

zuodaApp.controller('ZuoDaDownloadCtrl', function ($scope) {
  $scope.phones = [
    {
      'name': 'Nexus S',
      'snippet': 'Fast just got faster with Nexus S.'
    },
    {
      'name': 'Motorola XOOM™ with Wi-Fi',
      'snippet': 'The Next, Next Generation tablet.'
    },
    {
      'name': 'MOTOROLA XOOM™',
      'snippet': 'The Next, Next Generation tablet.'
    }
  ];
});
