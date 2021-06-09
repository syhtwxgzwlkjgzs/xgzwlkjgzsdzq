/**
 * 站点配置的一些变量
 * 包括 ../config 下面的基础配置
 */
import initEnvConfig from '@common/config';
// 环境配置
export const ENV_CONFIG = initEnvConfig();

// 应用主题
export const APP_THEME = {
  light: 'light',
  dark: 'dark',
};

/**
 * 后端错误码
**/

export const JUMP_TO_LOGIN = -3001; // 到登录页
export const JUMP_TO_REGISTER = -3002; // 到注册页
export const JUMP_TO_AUDIT = -3003; // 到注册审核页
export const JUMP_TO_HOME_INDEX = -3004; // 到首页
export const SITE_CLOSED = -3005; // 站点关闭
export const JUMP_TO_PAY_SITE = -3006; // 到付费加入页面
export const JUMP_TO_SUPPLEMENTARY = -3007; // 跳转到扩展字段页
export const INVALID_TOKEN =  -4002;// token无效
export const JUMP_TO_404 = -4004; // 资源不存在
export const NEED_BIND_WEIXIN_FLAG = -8000; // 需要绑定微信
export const NEED_BIND_PHONE_FLAG = -8001; // 需要绑定手机

// web端站点加入路由白名单
export const WEB_SITE_JOIN_WHITE_LIST = [
  '/user/agreement', // 网站协议
  '/user/login', // 登录中转
  '/user/wx-auth', // 登录中转
  '/user/phone-login', // 手机登录
  '/user/username-login', // 用户名登录
  '/user/wx-login', // 微信登录
  '/user/wx-authorization', // 微信授权
  '/user/wx-bind', // 微信绑定
  '/user/wx-bind-phone', // 微信绑定手机号
  '/user/wx-bind-qrcode', // 扫码绑定微信
  '/user/wx-bind-username', // 微信用户名绑定
  '/user/wx-select', // 微信落地页
  '/user/register', // 注册
  '/user/status', // 状态
  '/user/supplementary', // 补充信息
  '/user/reset-password', // 找回密码
  '/user/agreement', // 协议
  '/user/bind-phone', // 绑定手机号
  '/user/bind-nickname', // 绑定昵称
  '/my', // 个人中心
  '/forum/partner-invite', // 站点加入
];

// mini端站点加入路由白名单
export const MINI_SITE_JOIN_WHITE_LIST = [
  '/subPages/user/wx-auth/index', // 快捷登录
  '/subPages/user/wx-select/index', // 微信落地页
  '/subPages/user/bind-phone/index', // 绑定手机号
  '/subPages/user/status/index', // 状态
  '/subPages/user/wx-bind/index', // 小程序绑定
  '/subPages/user/wx-authorization/index', // 微信授权
  '/subPages/user/wx-bind-username/index', // 用户名绑定
  '/subPages/user/wx-bind-phone/index', // 绑定手机号
  '/subPages/user/supplementary/index', // 补充信息
  '/subPages/my/index', // 个人中心
  '/subPages/forum/partner-invite/index', // 站点加入
];

export const PERMISSION_PLATE = [
  {
    type: 'thread.insertImage',
    value: '插入图片'
  },
  {
    type: 'thread.insertVideo',
    value: '插入视频'
  },
  {
    type: 'thread.insertAudio',
    value: '插入语音'
  },
  {
    type: 'thread.insertAttachment',
    value: '插入附件'
  },
  {
    type: 'thread.insertGoods',
    value: '插入商品'
  },
  {
    type: 'thread.insertPay',
    value: '插入付费'
  },
  {
    type: 'thread.insertReward',
    value: '插入悬赏'
  },
  {
    type: 'thread.insertRedPacket',
    value: '插入红包'
  },
  {
    type: 'thread.insertPosition',
    value: '插入位置'
  },
  {
    type: 'thread.allowAnonymous',
    value: '允许匿名'
  },
  {
    type: 'thread.viewThreads',
    value: '查看主题列表'
  },
  {
    type: 'thread.viewPosts',
    value: '查看主题详情'
  },
  {
    type: 'thread.freeViewPosts',
    value: '免费查看付费内容'
  },
  {
    type: 'thread.reply',
    value: '回复主题'
  },
  {
    type: 'thread.essence',
    value: '加精'
  },
  {
    type: 'thread.edit',
    value: '编辑主题'
  },
  {
    type: 'thread.hide',
    value: '删除主题'
  },
  {
    type: 'thread.hidePosts',
    value: '删除回复'
  },
  {
    type: 'thread.editOwnThread',
    value: '编辑自己的主题'
  },
  {
    type: 'thread.hideOwnThreadOrPost',
    value: '删除自己的主题或回复'
  },
];

export const COMMON_PERMISSION = [
  {
    type: 'thread.sticky',
    value: '置顶'
  },
  {
    type: 'thread.favorite',
    value: '收藏帖子'
  },
  {
    type: 'thread.likePosts',
    value: '点赞帖子'
  },
  {
    type: 'user.view',
    value: '查看用户信息'
  },
  {
    type: 'userFollow.create',
    value: '关注/取关用户'
  },
  {
    type: 'dialog.create',
    value: '发布私信'
  },
  {
    type: 'other.canInviteUserScale',
    value: '裂变推广(邀请加入)'
  },
  {
    type: 'createThreadWithCaptcha',
    value: '发布帖子时需要验证码'
  },
  {
    type: 'publishNeedBindPhone',
    value: '发布帖子时需要绑定手机'
  },
  {
    type: 'cash.create',
    value: '申请提现'
  },
  {
    type: 'order.create',
    value: '创建订单'
  },
  {
    type: 'trade.pay.order',
    value: '支付订单'
  },
];
