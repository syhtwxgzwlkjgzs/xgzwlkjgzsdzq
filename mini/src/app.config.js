/**
 * 入口配置文件：https://taro-docs.jd.com/taro/docs/next/tutorial/
 */
export default {
  // TODO: 分包处理
  // 首页和详情页在主包
  pages: [
    'pages/index/index',
    // 'pages/thread/index',
    // 'pages/thread/comment/index',
    'pages/threadPost/index',
    'pages/threadPost/selectRedpacket',
    'pages/threadPost/selectReward',
    'pages/threadPost/selectProduct',
    'pages/threadPost/selectPaid',
  ],
  subPackages: [
    {
      root: 'subPages',
      pages: [
        '404/index'
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
