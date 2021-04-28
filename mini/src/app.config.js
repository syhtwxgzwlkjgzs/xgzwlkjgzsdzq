/**
 * 入口配置文件：https://taro-docs.jd.com/taro/docs/next/tutorial/
 */
export default {
  // TODO: 分包处理
  // 首页和详情页在主包
  pages: [
    'pages/index/index',
    'pages/thread/index',
    'pages/threadPost/index',
    'pages/threadPost/selectRedpacket',
    'pages/threadPost/selectReward',
    'pages/threadPost/selectProduct',
    'pages/threadPost/selectPaid',
    'pages/threadPost/selectAt',
    'pages/threadPost/selectTopic',
  ],
  subPackages: [
    {
      root: 'subPages',
      pages: [
        '404/index',
        'close/index',
        'user/login/index',
        'thread/comment/index',
        'search/index',
        'search/result-topic/index',
        'search/result-post/index',
        'search/result-user/index',
        'search/result/index',
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
