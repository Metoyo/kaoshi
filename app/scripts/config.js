define( "config", [], function () {
  return {
    token: '12345',
    apiurl_rz: "http://192.168.1.111:3000/api/",//认证的url
    apiurl_mt: "http://192.168.1.110:4000/api/",//命题的url
//    apiurl_rz: "http://www.taianting.com:3000/api/",//认证的url
//    apiurl_mt: "http://www.taianting.com:4000/api/",//命题的url
    secret: '076ee61d63aa10a125ea872411e433b9',
    hostname: 'localhost:3000',
    letterArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
      'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], //英文字母序号数组
    cnNumArr: ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九',
      '二十'], //中文数字序号数组
    routes: {
      '/mingti': {
        templateUrl: 'views/mingti.html',
        controller: 'MingtiCtrl',
        requireLogin: true
      },
      '/dagang': {
        templateUrl: 'views/dagang.html',
        controller: 'DagangCtrl',
        requireLogin: true
      },
      '/renzheng': {
        templateUrl: 'views/renzheng.html',
        controller: 'RenzhengCtrl',
        requireLogin: false
      },
      '/user/:name': {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl',
        requireLogin: true
      },
      '/logout': {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        requireLogin: true
      },
      '/register': {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        requireLogin: false
      },
      '/zujuan': {
        templateUrl: 'views/zujuan.html',
        controller: 'ZujuanCtrl',
        requireLogin: true
      }
    }
  };
});