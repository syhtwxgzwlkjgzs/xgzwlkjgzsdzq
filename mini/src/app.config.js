/**
 * 入口配置文件：https://taro-docs.jd.com/taro/docs/next/tutorial/
 */
const config = {
  // TODO: 分包处理
  // 首页和详情页在主包
  pages: [
    'pages/index/index',
  ],
  subPackages: [
    {
      root: 'subPages',
      pages: [
        '404/index',
        '500/index',
        'error/index',
        'close/index',
        'join/index',
        'thread/index',
        'thread/comment/index',
        'thread/post/index',
        'thread/selectAt/index',
        'thread/selectTopic/index',
        'thread/selectProduct/index',
        'thread/selectRedpacket/index',
        'thread/selectReward/index',
        'thread/selectPayment/index',
        'search/index',
        'search/result-topic/index',
        'search/result-post/index',
        'search/result-user/index',
        'search/result/index',
        'topic/index',
        'topic/topic-detail/index',
        'user/wx-bind/index',
        'user/wx-select/index',
        'user/wx-bind-username/index',
        'user/wx-bind-phone/index',
        'user/status/index',
        'user/bind-phone/index',
        'user/wx-auth/index',
        'user/wx-authorization/index',
        'user/supplementary/index',
        'my/draft/index',
        'wallet/index',
        'wallet/frozen/index',
        'wallet/withdrawal/index',
        'message/index',
        'my/index',
        'my/edit/index',
        'my/edit/mobile/index',
        'my/edit/pwd/index',
        'my/edit/paypwd/index',
        'my/edit/reset/paypwd/index',
        'my/edit/find/paypwd/index',
      ]
    }
  ],
  permission: {
    "scope.userLocation": {
      "desc": "小程序将获取您的位置信息"
    }
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  },
  // wx5a3a7366fd07e119 验证码防水墙小程序
  navigateToMiniProgramAppIdList: ["wx5a3a7366fd07e119"]
};

module.exports = config;
