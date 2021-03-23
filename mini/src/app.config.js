/**
 * 入口配置文件：https://taro-docs.jd.com/taro/docs/next/tutorial/
 */
export default {
  // 首页和详情页在主包
  pages: [
    'pages/index/index',
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
