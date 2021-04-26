/**
 * 入口配置文件：https://taro-docs.jd.com/taro/docs/next/tutorial/
 */
export default {
  // TODO: 分包处理
  // 首页和详情页在主包
  pages: [
    'pages/index/index',
    'pages/thread/index',
    'pages/thread/comment/index',
    'pages/threadPost/index',
    'pages/threadPost/selectReward',
    'pages/user/wx-select/index',
    'pages/user/wx-bind-username/index',
    'pages/user/wx-bind-phone/index',
    'pages/user/status/index',
  ],
  // 其它在子包。更新的时候负责人需要注意一下分包之后的打包优化配置
  // subPackages: [],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
};
