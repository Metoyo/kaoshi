define( "config", [], function () {
  return {
    token: '12345',
    apiurl_rz: "http://test.taianting.com:3000/api/",//认证的url
    apiurl_mt: "http://test.taianting.com:4000/api/",//命题的url
    apiurl_kw: "http://test.taianting.com:4100/api/",//考务的url
    apiurl_tj: "http://test.taianting.com:4300/api/",//统计的url
    apiurl_tj_ori: "http://test.taianting.com:4300/",//统计的原始url
    apiurl_bm: "http://test.taianting.com:4400/api/",//报名的url
    apiurl_gg: "http://192.168.1.2:5500/",//公共的url

    //apiurl_rz: "http://www.yunjiaoshou.com:3000/api/",//认证的url
    //apiurl_mt: "http://www.yunjiaoshou.com:4000/api/",//命题的url
    //apiurl_kw: "http://www.yunjiaoshou.com:4100/api/",//考务的url
    //apiurl_tj: "http://www.yunjiaoshou.com:4300/api/",//统计的url
    //apiurl_tj_ori: "http://www.yunjiaoshou.com:4300/",//统计的原始url
    //apiurl_bm: "http://www.yunjiaoshou.com:4400/",//报名的url

    //apiurl_rz: "/renzheng/",//认证的url
    //apiurl_mt: "/mingti/",//命题的url
    //apiurl_kw: "/kaowu/",//考务的url
    //apiurl_tj: "/tongji/",//统计的url
    //apiurl_tj_ori: "/tongji/",//统计的原始url
    //apiurl_bm: "/baoming/",//报名的url
    secret: '076ee61d63aa10a125ea872411e433b9',
    hostname: 'localhost:3000',
    letterArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
      'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'], //英文字母序号数组
    cnNumArr: ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九',
      '二十'], //中文数字序号数组
    routes: {
      '/mingti': {
        templateUrl: '../views/mingti/mingti.html',
        controller: 'MingtiCtrl',
        requireLogin: true
      },
      '/dagang': {
        templateUrl: '../views/dagang/dagang.html',
        controller: 'DagangCtrl',
        requireLogin: true
      },
      '/renzheng': {
        templateUrl: '../views/renzheng/renzheng.html',
        controller: 'RenzhengCtrl',
        requireLogin: false
      },
      '/user/:name': {
        templateUrl: '../views/renzheng/user.html',
        controller: 'UserCtrl',
        requireLogin: true
      },
      '/register/teacher': {
        templateUrl: '../views/partials/register.html',
        controller: 'RegisterCtrl',
        requireLogin: false
      },
      '/register/student': {
        templateUrl: '../views/partials/registerStu.html',
        controller: 'RegisterCtrl',
        requireLogin: false
      },
      '/zujuan': {
        templateUrl: '../views/zujuan/zujuan.html',
        controller: 'ZujuanCtrl',
        requireLogin: true
      },
      '/kaowu': {
        templateUrl: '../views/kaowu/kaowu.html',
        controller: 'KaowuCtrl',
        requireLogin: true
      },
      '/lingyu': {
        templateUrl: '../views/renzheng/selectLingYu.html',
        controller: 'LingyuCtrl',
        requireLogin: true
      },
      '/tongji': {
        templateUrl: '../views/tongji/tongji.html',
        controller: 'TongjiCtrl',
        requireLogin: true
      },
      '/resetPassword/:email': {
        templateUrl: '../views/renzheng/rz_resetPw.html',
        controller: 'RenzhengCtrl',
        requireLogin: false
      },
      '/baoming': {
        templateUrl: '../views/student/baoming.html',
        controller: 'StudentCtrl',
        requireLogin: true
      },
      '/chengji': {
        templateUrl: '../views/student/chengji.html',
        controller: 'StudentCtrl',
        requireLogin: true
      },
      '/guanli': {
        templateUrl: '../views/guanli/guanli.html',
        controller: 'GuanLiCtrl',
        requireLogin: true
      },
      '/weiluke': {
        templateUrl: '../views/student/luke.html',
        controller: 'StudentCtrl',
        requireLogin: true
      }
    },
    quanxianObj: [ //得到角色是数组
      {
        qxArr: ['2006', '2007'],
        targetUrl: '/dagang',
        navName : 'dagang',
        hanName: '大纲'
      },
      {
        qxArr: ['2010', '2011', '2012', '2013', '2031', '2032'],
        targetUrl: '/mingti',
        navName : 'mingti',
        hanName: '命题'
      },
      {
        qxArr: ['2017', '2020', '2021', '2022', '2023', '2030', '2033', '2034'],
        targetUrl: '/zujuan',
        navName : 'zujuan',
        hanName: '组卷'
      },
      {
        qxArr: ['3001'],
        targetUrl: '/kaowu',
        navName : 'kaowu',
        hanName: '考务'
      },
      {
        qxArr: ['4001', '4002'],
        targetUrl: '/tongji',
        navName : 'tongji',
        hanName: '统计'
      },
      {
        qxArr: [],
        targetUrl: '/baoming',
        navName : 'baoming',
        hanName: '报名'
      },
      {
        qxArr: [],
        targetUrl: '/chengji',
        navName : 'chengji',
        hanName: '成绩'
      },
      {
        qxArr: ['3001'],
        targetUrl: '/guanli',
        navName : 'guanli',
        hanName: '管理'
      },
      {
        qxArr: [],
        targetUrl: '/weiluke',
        navName : 'weiluke',
        hanName: '微课'
      }
    ],
    tiXingNameArr: [
      '单选题', '多选题','双选题','判断题','是非题','填空题','单词翻译题','单词解释题','计算题','问答题','简答题','论述题','翻译题',
      '作文题','证明题','作图题','解答题'
    ],
    imgType: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    videoType: ['.ogv', '.mp4', '.avi', '.mkv', '.wmv'],
    audioType: ['.ogg', '.mp3', '.wav'],
    uploadFileSizeLimit: 2097152, //上传文件的大小限制2MB
    videos:[
      {
        "Owner":3205,
        "OwnerName":"尼古拉特斯拉",
        "VideoDesc":"",
        "VideoFile":"20150629132405.wmv",
        "VideoName":"ABCDabcd",
        "Duration":3,
        "CreateTime":"2015-06-29T13:24:09.543",
        "UploadTime":"2015-06-29T13:25:15.050",
        "VID":"e5dbd8de8a20bc1628582336f73b82a3_e",
        "BeginTime":"2015-06-29",
        "EndTime":"1899-12-30",
        "OBType":0,
        "OBParams":"",
        "Detail":{'error':"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_1.mp4","vid":"e5dbd8de8a20bc1628582336f73b82a3_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a20bc1628582336f73b82a3_e.swf","source_filesize":352134,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_1.flv","duration":"00:00:04","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a20bc1628582336f73b82a3_5.jpg"],"playerheight":"","ptime":"2015-06-29 13:25:08"}]},
        "State":0
  },
  {
    "Owner":3205,
    "OwnerName":"尼古拉特斯拉",
    "VideoDesc":"",
    "VideoFile":"wlk_2015-06-27_13-35-47.wmv",
    "VideoName":"wlk_2015-06-27_13-35-47",
    "Duration":12,
    "CreateTime":"2015-06-27T13:36:36.473",
    "UploadTime":"2015-06-27T13:36:36.473",
    "VID":"e5dbd8de8a2643bd619d7928db40b4c4_e",
    "BeginTime":"2015-06-27T13:36:26.563",
    "EndTime":"1899-12-30",
    "OBType":0,
    "OBParams":"",
    "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_1.mp4","vid":"e5dbd8de8a2643bd619d7928db40b4c4_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a2643bd619d7928db40b4c4_e.swf","source_filesize":1055526,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_1.flv","duration":"00:00:12","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_0.jpg","original_definition":"1920x1200","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2643bd619d7928db40b4c4_5.jpg"],"playerheight":"","ptime":"2015-06-27 13:36:38"}]},
    "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150731094726.wmv",
  "VideoName":"65555444",
  "Duration":236,
  "CreateTime":"2015-07-31T01:51:24.000",
  "UploadTime":"2015-07-31T09:55:27.457",
  "VID":"e5dbd8de8a290e2a377fe30e56ac4822_e",
  "BeginTime":"2015-07-31T09:55:19.497",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_5_b.jpg"],"md5checksum":"b4b9dd5af7afb74be51acd4e1c865b8d","tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_1.mp4","vid":"e5dbd8de8a290e2a377fe30e56ac4822_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a290e2a377fe30e56ac4822_e.swf","source_filesize":1879056,"status":"20","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8a290e2a377fe30e56ac4822_e.m3u8","hls1":"http://v.polyv.net/hls/e5dbd8de8a290e2a377fe30e56ac4822_e.m3u8?df=1","default_video":"http://plvod01.videocc.net/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_1.flv","duration":"00:01:27","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_0.jpg","original_definition":"1366x768","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8a290e2a377fe30e56ac4822_5.jpg"],"playerheight":"","ptime":"2015-07-31 09:55:26"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-27_13-47-14.wmv",
  "VideoName":"wlk_2015-06-27_13-47-14",
  "Duration":36,
  "CreateTime":"2015-06-27T13:48:07.167",
  "UploadTime":"2015-06-27T13:48:07.167",
  "VID":"e5dbd8de8a2f31c3ed9b3189fc3ffd84_e",
  "BeginTime":"2015-06-27T13:47:55.003",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_1.mp4","vid":"e5dbd8de8a2f31c3ed9b3189fc3ffd84_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a2f31c3ed9b3189fc3ffd84_e.swf","source_filesize":3070356,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_1.flv","duration":"00:00:36","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_0.jpg","original_definition":"1920x1200","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a2f31c3ed9b3189fc3ffd84_5.jpg"],"playerheight":"","ptime":"2015-06-27 13:48:10"}]},
  "State":0
},
{
  "Owner":3206,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706151137.wmv",
  "VideoName":"20150706151137",
  "Duration":3,
  "CreateTime":"2015-07-06T07:12:06.000",
  "UploadTime":"2015-07-06T15:24:30.753",
  "VID":"e5dbd8de8a3ab9a8d774e2348074013e_e",
  "BeginTime":"2015-07-06T15:24:06.277",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_1.mp4","title":"notitle","df":2,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_1.mp4","vid":"e5dbd8de8a3ab9a8d774e2348074013e_e","mp4_2":"http://mpv.videocc.net/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_2.mp4","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a3ab9a8d774e2348074013e_e.swf","source_filesize":304454,"status":"10","seed":1,"flv2":"http://plvod01.videocc.net/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_2.flv","flv1":"http://plvod01.videocc.net/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e.wmv","playerwidth":"","hls2":"http://v.polyv.net/hls/e5dbd8de8a3ab9a8d774e2348074013e_e.m3u8?df=2","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8a3ab9a8d774e2348074013e_e.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_2.flv","hls1":"http://v.polyv.net/hls/e5dbd8de8a3ab9a8d774e2348074013e_e.m3u8?df=1","duration":"00:00:03","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a3ab9a8d774e2348074013e_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:24:20"}]},
  "State":0
},
{
  "Owner":3206,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150820163752.wmv",
  "VideoName":"张君演示录屏1",
  "Duration":29,
  "CreateTime":"2015-08-20T16:38:23.283",
  "UploadTime":"2015-08-20T16:41:39.000",
  "VID":"e5dbd8de8a4072c518bca88022b12f3d_e",
  "BeginTime":"2015-08-20T16:41:25.250",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_5_b.jpg"],"md5checksum":"88dd4ed4427b600d33df0645eebcf144","tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_1.mp4","vid":"e5dbd8de8a4072c518bca88022b12f3d_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a4072c518bca88022b12f3d_e.swf","source_filesize":686258,"status":"20","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8a4072c518bca88022b12f3d_e.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_1.flv","hls1":"http://v.polyv.net/hls/e5dbd8de8a4072c518bca88022b12f3d_e.m3u8?df=1","duration":"00:00:29","filesize":[0],"first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_0.jpg","original_definition":"1366x768","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/d/e5dbd8de8a4072c518bca88022b12f3d_5.jpg"],"playerheight":"","ptime":"2015-08-20 16:41:38"}]},
  "State":0
},
{
  "Owner":3206,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706143539.wmv",
  "VideoName":"20150706143539",
  "Duration":2,
  "CreateTime":"2015-07-06T06:35:43.000",
  "UploadTime":"2015-07-06T15:25:06.513",
  "VID":"e5dbd8de8a5de06535feb1fb991c3400_e",
  "BeginTime":"2015-07-06T15:24:24.447",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_1.mp4","vid":"e5dbd8de8a5de06535feb1fb991c3400_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a5de06535feb1fb991c3400_e.swf","source_filesize":221000,"status":"10","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8a5de06535feb1fb991c3400_e.m3u8","hls1":"http://v.polyv.net/hls/e5dbd8de8a5de06535feb1fb991c3400_e.m3u8?df=1","default_video":"http://plvod01.videocc.net/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_1.flv","duration":"00:00:02","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8a5de06535feb1fb991c3400_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:24:57"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150629132400.wmv",
  "VideoName":"123456",
  "Duration":2,
  "CreateTime":"2015-06-29T13:24:03.277",
  "UploadTime":"2015-07-03T15:12:35.890",
  "VID":"e5dbd8de8a64449ca2cfb4a75b65565e_e",
  "BeginTime":"2015-06-29",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_1.mp4","vid":"e5dbd8de8a64449ca2cfb4a75b65565e_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a64449ca2cfb4a75b65565e_e.swf","source_filesize":232920,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_1.flv","duration":"00:00:03","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8a64449ca2cfb4a75b65565e_5.jpg"],"playerheight":"","ptime":"2015-06-29 13:25:14"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706152013.wmv",
  "VideoName":"20150706152013",
  "Duration":43,
  "CreateTime":"2015-07-06T07:20:56.000",
  "UploadTime":"2015-07-06T15:24:13.423",
  "VID":"e5dbd8de8a6b8fe3d4d3654808920f95_e",
  "BeginTime":"2015-07-06T15:23:54.937",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_1.mp4","vid":"e5dbd8de8a6b8fe3d4d3654808920f95_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a6b8fe3d4d3654808920f95_e.swf","source_filesize":1711294,"status":"10","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8a6b8fe3d4d3654808920f95_e.m3u8","hls1":"http://v.polyv.net/hls/e5dbd8de8a6b8fe3d4d3654808920f95_e.m3u8?df=1","default_video":"http://plvod01.videocc.net/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_1.flv","duration":"00:00:23","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/5/e5dbd8de8a6b8fe3d4d3654808920f95_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:24:05"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-27_13-36-06.wmv",
  "VideoName":"wlk_2015-06-27_13-36-06",
  "Duration":15,
  "CreateTime":"2015-06-27T13:36:46.237",
  "UploadTime":"2015-06-27T13:36:46.237",
  "VID":"e5dbd8de8a6d423ef5ee2197eef2d8d1_e",
  "BeginTime":"2015-06-27T13:36:27.873",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_1.mp4","vid":"e5dbd8de8a6d423ef5ee2197eef2d8d1_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a6d423ef5ee2197eef2d8d1_e.swf","source_filesize":1258222,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_1.flv","duration":"00:00:15","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_0.jpg","original_definition":"1920x1200","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/1/e5dbd8de8a6d423ef5ee2197eef2d8d1_5.jpg"],"playerheight":"","ptime":"2015-06-27 13:36:49"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-29_10-24-07.wmv",
  "VideoName":"ccc",
  "Duration":67,
  "CreateTime":"2015-06-29T10:26:57.600",
  "UploadTime":"2015-06-29T10:26:57.600",
  "VID":"e5dbd8de8a7059415c1675481b3f265c_e",
  "BeginTime":"2015-06-29",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_1.mp4","vid":"e5dbd8de8a7059415c1675481b3f265c_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a7059415c1675481b3f265c_e.swf","source_filesize":3380710,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_1.flv","duration":"00:01:07","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/c/e5dbd8de8a7059415c1675481b3f265c_5.jpg"],"playerheight":"","ptime":"2015-06-29 10:26:44"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-27_13-45-00.wmv",
  "VideoName":"ABCDEFGH",
  "Duration":31,
  "CreateTime":"2015-06-27T13:48:40.150",
  "UploadTime":"2015-06-27T13:48:40.150",
  "VID":"e5dbd8de8a739bd3564d8494b514061f_e",
  "BeginTime":"2015-06-27",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_1.mp4","vid":"e5dbd8de8a739bd3564d8494b514061f_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a739bd3564d8494b514061f_e.swf","source_filesize":2486192,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_1.flv","duration":"00:00:31","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_0.jpg","original_definition":"1920x1200","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8a739bd3564d8494b514061f_5.jpg"],"playerheight":"","ptime":"2015-06-27 13:48:42"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706151052.wmv",
  "VideoName":"20150706151052",
  "Duration":5,
  "CreateTime":"2015-07-06T07:10:57.000",
  "UploadTime":"2015-07-06T15:24:25.813",
  "VID":"e5dbd8de8a73de87ebd61557f2c002b9_e",
  "BeginTime":"2015-07-06T15:24:04.403",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_1.mp4","vid":"e5dbd8de8a73de87ebd61557f2c002b9_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a73de87ebd61557f2c002b9_e.swf","source_filesize":411748,"status":"10","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8a73de87ebd61557f2c002b9_e.m3u8","hls1":"http://v.polyv.net/hls/e5dbd8de8a73de87ebd61557f2c002b9_e.m3u8?df=1","default_video":"http://plvod01.videocc.net/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_1.flv","duration":"00:00:05","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/9/e5dbd8de8a73de87ebd61557f2c002b9_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:24:18"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-27_13-41-24.wmv",
  "VideoName":"wlk_2015-06-27_13-41-24",
  "Duration":6,
  "CreateTime":"2015-06-27T13:42:16.567",
  "UploadTime":"2015-06-27T13:42:16.567",
  "VID":"e5dbd8de8a821433b88ee9623dd57ac3_e",
  "BeginTime":"2015-06-27T13:41:56.523",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_1.mp4","title":"notitle","df":2,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_1.mp4","vid":"e5dbd8de8a821433b88ee9623dd57ac3_e","mp4_2":"http://mpv.videocc.net/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_2.mp4","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a821433b88ee9623dd57ac3_e.swf","source_filesize":411762,"status":"10","seed":0,"flv2":"http://plvod01.videocc.net/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_2.flv","flv1":"http://plvod01.videocc.net/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3.wmv","playerwidth":"","hls2":"http://seg1.videocc.net/hls/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_2.m3u8","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_2.flv","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_1.m3u8","duration":"00:00:06","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_0.jpg","original_definition":"1920x1200","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/3/e5dbd8de8a821433b88ee9623dd57ac3_5.jpg"],"playerheight":"","ptime":"2015-06-27 13:42:19"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150629143709.wmv",
  "VideoName":"dddd",
  "Duration":1,
  "CreateTime":"2015-06-29T06:37:14.000",
  "UploadTime":"2015-06-29T14:40:20.557",
  "VID":"e5dbd8de8a8392aac53470c6e834e6e6_e",
  "BeginTime":"2015-06-29",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_1.mp4","title":"notitle","df":2,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_1.mp4","vid":"e5dbd8de8a8392aac53470c6e834e6e6_e","mp4_2":"http://mpv.videocc.net/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_2.mp4","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a8392aac53470c6e834e6e6_e.swf","source_filesize":137546,"status":"10","seed":0,"flv2":"http://plvod01.videocc.net/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_2.flv","flv1":"http://plvod01.videocc.net/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6.wmv","playerwidth":"","hls2":"http://seg1.videocc.net/hls/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_2.m3u8","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_2.flv","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_1.m3u8","duration":"00:00:01","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8a8392aac53470c6e834e6e6_5.jpg"],"playerheight":"","ptime":"2015-06-29 14:40:12"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706151226.wmv",
  "VideoName":"20150706151226",
  "Duration":7,
  "CreateTime":"2015-07-06T07:12:45.000",
  "UploadTime":"2015-07-06T15:24:24.760",
  "VID":"e5dbd8de8a8ab60d1b449720bd8448ca_e",
  "BeginTime":"2015-07-06T15:24:01.663",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_1.mp4","vid":"e5dbd8de8a8ab60d1b449720bd8448ca_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a8ab60d1b449720bd8448ca_e.swf","source_filesize":376030,"status":"10","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8a8ab60d1b449720bd8448ca_e.m3u8","hls1":"http://v.polyv.net/hls/e5dbd8de8a8ab60d1b449720bd8448ca_e.m3u8?df=1","default_video":"http://plvod01.videocc.net/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_1.flv","duration":"00:00:07","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a8ab60d1b449720bd8448ca_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:24:15"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706145022.wmv",
  "VideoName":"20150706145022",
  "Duration":6,
  "CreateTime":"2015-07-06T06:50:29.000",
  "UploadTime":"2015-07-06T15:24:53.113",
  "VID":"e5dbd8de8a943fc8508799a7ab9c8328_e",
  "BeginTime":"2015-07-06T15:24:12.497",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_1.mp4","title":"notitle","df":2,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_1.mp4","vid":"e5dbd8de8a943fc8508799a7ab9c8328_e","mp4_2":"http://mpv.videocc.net/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_2.mp4","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a943fc8508799a7ab9c8328_e.swf","source_filesize":614416,"status":"10","seed":1,"flv2":"http://plvod01.videocc.net/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_2.flv","flv1":"http://plvod01.videocc.net/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328.wmv","playerwidth":"","hls2":"http://v.polyv.net/hls/e5dbd8de8a943fc8508799a7ab9c8328_e.m3u8?df=2","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8a943fc8508799a7ab9c8328_e.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_2.flv","hls1":"http://v.polyv.net/hls/e5dbd8de8a943fc8508799a7ab9c8328_e.m3u8?df=1","duration":"00:00:06","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8a943fc8508799a7ab9c8328_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:24:37"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706144720.wmv",
  "VideoName":"20150706144720",
  "Duration":6,
  "CreateTime":"2015-07-06T06:47:27.000",
  "UploadTime":"2015-07-06T15:24:59.370",
  "VID":"e5dbd8de8a976efab5dc259cdebe527a_e",
  "BeginTime":"2015-07-06T15:24:21.277",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_1.mp4","vid":"e5dbd8de8a976efab5dc259cdebe527a_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a976efab5dc259cdebe527a_e.swf","source_filesize":530976,"status":"10","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8a976efab5dc259cdebe527a_e.m3u8","hls1":"http://v.polyv.net/hls/e5dbd8de8a976efab5dc259cdebe527a_e.m3u8?df=1","default_video":"http://plvod01.videocc.net/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_1.flv","duration":"00:00:06","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8a976efab5dc259cdebe527a_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:24:49"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-27_13-44-12.wmv",
  "VideoName":"wlk_2015-06-27_13-44-12",
  "Duration":12,
  "CreateTime":"2015-06-27T13:44:43.510",
  "UploadTime":"2015-06-27T13:44:43.510",
  "VID":"e5dbd8de8a9f57086759ba9eec857864_e",
  "BeginTime":"2015-06-27T13:44:29.023",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_1.mp4","vid":"e5dbd8de8a9f57086759ba9eec857864_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8a9f57086759ba9eec857864_e.swf","source_filesize":1031700,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_1.flv","duration":"00:00:12","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_0.jpg","original_definition":"1920x1200","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/4/e5dbd8de8a9f57086759ba9eec857864_5.jpg"],"playerheight":"","ptime":"2015-06-27 13:44:46"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150820161354.wmv",
  "VideoName":"演示课1",
  "Duration":63,
  "CreateTime":"2015-08-20T16:14:58.887",
  "UploadTime":"2015-08-20T16:16:55.177",
  "VID":"e5dbd8de8aad120ef4b60f03031181fa_e",
  "BeginTime":"2015-08-20T16:16:40.827",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_5_b.jpg"],"md5checksum":"3c35f31a608f3237fd26be3ca4b61542","tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_1.mp4","vid":"e5dbd8de8aad120ef4b60f03031181fa_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8aad120ef4b60f03031181fa_e.swf","source_filesize":1378094,"status":"10","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8aad120ef4b60f03031181fa_e.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_1.flv","hls1":"http://v.polyv.net/hls/e5dbd8de8aad120ef4b60f03031181fa_e.m3u8?df=1","duration":"00:01:03","filesize":[0],"first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_0.jpg","original_definition":"1366x768","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/a/e5dbd8de8aad120ef4b60f03031181fa_5.jpg"],"playerheight":"","ptime":"2015-08-20 16:16:54"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706152209.wmv",
  "VideoName":"20150706152209",
  "Duration":30,
  "CreateTime":"2015-07-06T07:22:40.000",
  "UploadTime":"2015-07-06T15:24:09.507",
  "VID":"e5dbd8de8aae422d98af8dfe7c3e2b60_e",
  "BeginTime":"2015-07-06T15:23:52.883",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_1.mp4","vid":"e5dbd8de8aae422d98af8dfe7c3e2b60_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8aae422d98af8dfe7c3e2b60_e.swf","source_filesize":1448998,"status":"10","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8aae422d98af8dfe7c3e2b60_e.m3u8","hls1":"http://v.polyv.net/hls/e5dbd8de8aae422d98af8dfe7c3e2b60_e.m3u8?df=1","default_video":"http://plvod01.videocc.net/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_1.flv","duration":"00:00:19","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8aae422d98af8dfe7c3e2b60_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:23:56"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-27_13-46-16.wmv",
  "VideoName":"wlk_2015-06-27_13-46-16",
  "Duration":25,
  "CreateTime":"2015-06-27T13:48:21.207",
  "UploadTime":"2015-06-27T13:48:21.207",
  "VID":"e5dbd8de8ab1b783c98b9f9faefb1abb_e",
  "BeginTime":"2015-06-27T13:47:58.090",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_1.mp4","vid":"e5dbd8de8ab1b783c98b9f9faefb1abb_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8ab1b783c98b9f9faefb1abb_e.swf","source_filesize":1675562,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_1.flv","duration":"00:00:25","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_0.jpg","original_definition":"1920x1200","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/b/e5dbd8de8ab1b783c98b9f9faefb1abb_5.jpg"],"playerheight":"","ptime":"2015-06-27 13:48:24"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706151430.wmv",
  "VideoName":"20150706151430",
  "Duration":42,
  "CreateTime":"2015-07-06T07:15:14.000",
  "UploadTime":"2015-07-06T15:24:21.713",
  "VID":"e5dbd8de8ab22fd3a1f54aba4290697e_e",
  "BeginTime":"2015-07-06T15:23:59.767",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_1.mp4","title":"notitle","df":2,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_1.mp4","vid":"e5dbd8de8ab22fd3a1f54aba4290697e_e","mp4_2":"http://mpv.videocc.net/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_2.mp4","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8ab22fd3a1f54aba4290697e_e.swf","source_filesize":375988,"status":"10","seed":1,"flv2":"http://plvod01.videocc.net/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_2.flv","flv1":"http://plvod01.videocc.net/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e.wmv","playerwidth":"","hls2":"http://v.polyv.net/hls/e5dbd8de8ab22fd3a1f54aba4290697e_e.m3u8?df=2","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8ab22fd3a1f54aba4290697e_e.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_2.flv","hls1":"http://v.polyv.net/hls/e5dbd8de8ab22fd3a1f54aba4290697e_e.m3u8?df=1","duration":"00:00:04","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/e/e5dbd8de8ab22fd3a1f54aba4290697e_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:24:10"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-27_13-45-38.wmv",
  "VideoName":"131431243",
  "Duration":25,
  "CreateTime":"2015-06-27T13:48:28.873",
  "UploadTime":"2015-06-27T13:48:28.873",
  "VID":"e5dbd8de8ab33303626a84645e75a352_e",
  "BeginTime":"2015-06-27",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_1.mp4","vid":"e5dbd8de8ab33303626a84645e75a352_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8ab33303626a84645e75a352_e.swf","source_filesize":1866282,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_1.flv","duration":"00:00:25","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_0.jpg","original_definition":"1920x1200","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8ab33303626a84645e75a352_5.jpg"],"playerheight":"","ptime":"2015-06-27 13:48:31"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706151019.wmv",
  "VideoName":"20150706151019",
  "Duration":10,
  "CreateTime":"2015-07-06T07:10:30.000",
  "UploadTime":"2015-07-06T15:24:34.540",
  "VID":"e5dbd8de8ab5964a23594eb7d4a68e57_e",
  "BeginTime":"2015-07-06T15:24:09.127",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_1.mp4","vid":"e5dbd8de8ab5964a23594eb7d4a68e57_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8ab5964a23594eb7d4a68e57_e.swf","source_filesize":840952,"status":"10","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8ab5964a23594eb7d4a68e57_e.m3u8","hls1":"http://v.polyv.net/hls/e5dbd8de8ab5964a23594eb7d4a68e57_e.m3u8?df=1","default_video":"http://plvod01.videocc.net/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_1.flv","duration":"00:00:10","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/7/e5dbd8de8ab5964a23594eb7d4a68e57_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:24:25"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150723111654.wmv",
  "VideoName":"20150723111654",
  "Duration":50,
  "CreateTime":"2015-07-23T03:17:46.000",
  "UploadTime":"2015-07-23T11:27:26.497",
  "VID":"e5dbd8de8ab5f0f19a3e38268682d4a8_e",
  "BeginTime":"2015-07-23T11:25:36.997",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_1.mp4","vid":"e5dbd8de8ab5f0f19a3e38268682d4a8_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8ab5f0f19a3e38268682d4a8_e.swf","source_filesize":1020256,"status":"20","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8ab5f0f19a3e38268682d4a8_e.m3u8","hls1":"http://v.polyv.net/hls/e5dbd8de8ab5f0f19a3e38268682d4a8_e.m3u8?df=1","default_video":"http://plvod01.videocc.net/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_1.flv","duration":"00:00:46","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_0.jpg","original_definition":"1366x768","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/8/e5dbd8de8ab5f0f19a3e38268682d4a8_5.jpg"],"playerheight":"","ptime":"2015-07-23 11:27:26"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-30_08-46-01.wmv",
  "VideoName":"演示视频",
  "Duration":584,
  "CreateTime":"2015-06-30T00:55:47.000",
  "UploadTime":"2015-06-30T09:14:59.467",
  "VID":"e5dbd8de8abda8e1fd9e876f17f1b23f_e",
  "BeginTime":"2015-06-30",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_1.mp4","vid":"e5dbd8de8abda8e1fd9e876f17f1b23f_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8abda8e1fd9e876f17f1b23f_e.swf","source_filesize":12506748,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_1.flv","duration":"00:09:44","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_0.jpg","original_definition":"1366x768","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8abda8e1fd9e876f17f1b23f_5.jpg"],"playerheight":"","ptime":"2015-06-30 09:14:59"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-27_13-41-40.wmv",
  "VideoName":"wlk_2015-06-27_13-41-40",
  "Duration":6,
  "CreateTime":"2015-06-27T13:42:26.027",
  "UploadTime":"2015-06-27T13:42:26.027",
  "VID":"e5dbd8de8ac2dd0546832d48d8ae171f_e",
  "BeginTime":"2015-06-27T13:42:21.037",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_1.mp4","vid":"e5dbd8de8ac2dd0546832d48d8ae171f_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8ac2dd0546832d48d8ae171f_e.swf","source_filesize":352162,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_1.flv","duration":"00:00:06","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_0.jpg","original_definition":"1920x1200","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ac2dd0546832d48d8ae171f_5.jpg"],"playerheight":"","ptime":"2015-06-27 13:42:29"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150629151428.wmv",
  "VideoName":"HelloWorld",
  "Duration":3,
  "CreateTime":"2015-06-29T15:14:36.570",
  "UploadTime":"2015-07-03T16:50:19.400",
  "VID":"e5dbd8de8acbc5f92d42f90ea8687140_e",
  "BeginTime":"2015-06-29",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_1.mp4","title":"notitle","df":2,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_1.mp4","vid":"e5dbd8de8acbc5f92d42f90ea8687140_e","mp4_2":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_2.mp4","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8acbc5f92d42f90ea8687140_e.swf","source_filesize":256760,"status":"10","seed":0,"flv2":"http://plvod01.videocc.net/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_2.flv","flv1":"http://plvod01.videocc.net/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140.wmv","playerwidth":"","hls2":"http://seg1.videocc.net/hls/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_2.m3u8","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_2.flv","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_1.m3u8","duration":"00:00:03","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8acbc5f92d42f90ea8687140_5.jpg"],"playerheight":"","ptime":"2015-06-29 15:14:47"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-27_13-46-51.wmv",
  "VideoName":"wlk_2015-06-27_13-46-51",
  "Duration":19,
  "CreateTime":"2015-06-27T13:48:13.517",
  "UploadTime":"2015-06-27T13:48:13.517",
  "VID":"e5dbd8de8ad4a69bd26841ecb78996df_e",
  "BeginTime":"2015-06-27T13:47:56.473",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_1.mp4","vid":"e5dbd8de8ad4a69bd26841ecb78996df_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8ad4a69bd26841ecb78996df_e.swf","source_filesize":1282118,"status":"10","seed":0,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df.wmv","playerwidth":"","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df.m3u8","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_1.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_1.flv","duration":"00:00:19","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_0.jpg","original_definition":"1920x1200","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/f/e5dbd8de8ad4a69bd26841ecb78996df_5.jpg"],"playerheight":"","ptime":"2015-06-27 13:48:15"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"wlk_2015-06-27_13-43-49.wmv",
  "VideoName":"wlk_2015-06-27_13-43-49",
  "Duration":18,
  "CreateTime":"2015-06-27T13:44:38.220",
  "UploadTime":"2015-06-27T13:44:38.220",
  "VID":"e5dbd8de8aeaec0ebf684f8bf094e9c2_e",
  "BeginTime":"2015-06-27T13:44:27.840",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_1.mp4","title":"notitle","df":2,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_1.mp4","vid":"e5dbd8de8aeaec0ebf684f8bf094e9c2_e","mp4_2":"http://mpv.videocc.net/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_2.mp4","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8aeaec0ebf684f8bf094e9c2_e.swf","source_filesize":1782744,"status":"10","seed":0,"flv2":"http://plvod01.videocc.net/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_2.flv","flv1":"http://plvod01.videocc.net/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2.wmv","playerwidth":"","hls2":"http://seg1.videocc.net/hls/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_2.m3u8","hlsIndex":"http://seg1.videocc.net/hls/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2.m3u8","default_video":"http://plvod01.videocc.net/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_2.flv","hls1":"http://seg1.videocc.net/hls/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_1.m3u8","duration":"00:00:18","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_0.jpg","original_definition":"1920x1200","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/2/e5dbd8de8aeaec0ebf684f8bf094e9c2_5.jpg"],"playerheight":"","ptime":"2015-06-27 13:44:41"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706144901.wmv",
  "VideoName":"20150706144901",
  "Duration":7,
  "CreateTime":"2015-07-06T06:49:09.000",
  "UploadTime":"2015-07-06T15:24:55.360",
  "VID":"e5dbd8de8af5056452c22dfb77a9df46_e",
  "BeginTime":"2015-07-06T15:24:17.540",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_1.mp4","vid":"e5dbd8de8af5056452c22dfb77a9df46_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8af5056452c22dfb77a9df46_e.swf","source_filesize":590590,"status":"10","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8af5056452c22dfb77a9df46_e.m3u8","hls1":"http://v.polyv.net/hls/e5dbd8de8af5056452c22dfb77a9df46_e.m3u8?df=1","default_video":"http://plvod01.videocc.net/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_1.flv","duration":"00:00:07","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/6/e5dbd8de8af5056452c22dfb77a9df46_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:24:47"}]},
  "State":0
},
{
  "Owner":3205,
  "OwnerName":"尼古拉特斯拉",
  "VideoDesc":"",
  "VideoFile":"20150706151842.wmv",
  "VideoName":"20150706151842",
  "Duration":26,
  "CreateTime":"2015-07-06T07:19:09.000",
  "UploadTime":"2015-07-06T15:24:16.060",
  "VID":"e5dbd8de8af7806b83d6c76e9fe1b420_e",
  "BeginTime":"2015-07-06T15:23:57.050",
  "EndTime":"1899-12-30",
  "OBType":0,
  "OBParams":"",
  "Detail":{"error":"0","data":[{"images_b":["http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_0_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_1_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_2_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_3_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_4_b.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_5_b.jpg"],"tag":"","mp4":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_1.mp4","title":"notitle","df":1,"times":"0","mp4_1":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_1.mp4","vid":"e5dbd8de8af7806b83d6c76e9fe1b420_e","cataid":"1","swf_link":"http://player.polyv.net/videos/e5dbd8de8af7806b83d6c76e9fe1b420_e.swf","source_filesize":1568212,"status":"10","seed":1,"flv1":"http://plvod01.videocc.net/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_1.flv","sourcefile":"http://mpv.videocc.net/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420.wmv","playerwidth":"","hlsIndex":"http://v.polyv.net/hlsIndex/e5dbd8de8af7806b83d6c76e9fe1b420_e.m3u8","hls1":"http://v.polyv.net/hls/e5dbd8de8af7806b83d6c76e9fe1b420_e.m3u8?df=1","default_video":"http://plvod01.videocc.net/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_1.flv","duration":"00:00:20","first_image":"http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_0.jpg","original_definition":"1920x1080","context":"","images":["http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_0.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_1.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_2.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_3.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_4.jpg","http://img.videocc.net/uimage/e/e5dbd8de8a/0/e5dbd8de8af7806b83d6c76e9fe1b420_5.jpg"],"playerheight":"","ptime":"2015-07-06 15:24:08"}]},
  "State":0
}
]
  };
});
