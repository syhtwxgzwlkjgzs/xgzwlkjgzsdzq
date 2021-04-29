/**
 * 入口配置文件：https://taro-docs.jd.com/taro/docs/next/tutorial/
 */
export default {
  // TODO: 分包处理
  // 首页和详情页在主包
  pages: [
    'pages/index/index',
    'pages/thread/index',
  ],
  subPackages: [
    {
      root: 'subPages',
      pages: [
        '404/index',
        'close/index',
        'user/login/index',
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
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
};
