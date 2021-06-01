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

// web端站点加入路由白名单
export const WEB_SITE_JOIN_WHITE_LIST = [
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