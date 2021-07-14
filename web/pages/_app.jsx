import React from 'react';
import { Provider } from 'mobx-react';
import { hideInstance } from '@discuzq/design/dist/components/image-previewer/layouts/web';
import App from 'next/app';
import getPlatform from '@common/utils/get-platform';
import initializeStore from '@common/store';
import PayBoxProvider from '../components/payBox/payBoxProvider';
import isServer from '@common/utils/is-server';
import '@discuzq/design/dist/styles/index.scss';
import csrRouterRedirect from '@common/utils/csr-router-redirect';
import Router from '@discuzq/sdk/dist/router';
// import sentry from '@common/utils/sentry';
import '../styles/index.scss';
import CustomHead from '@components/custom-head';
import Head from 'next/head';
import monitor from '@common/utils/monitor';
import setWxShare from '@common/utils/set-wx-share';
import { detectH5Orient } from '@common/utils/detect-orient';
import browser from '@common/utils/browser';
import Toast from '@discuzq/design/dist/components/toast';
import { STORAGE_KEY, STORAGE_TYPE } from '@common/utils/viewcount-in-storage';


// if (!isServer()) {
//   process.env.NODE_ENV === 'production' && sentry();
// }

class DzqApp extends App {
  constructor(props) {
    super(props);
    this.appStore = initializeStore();
    this.updateSize = this.updateSize.bind(this);
    this.setWXShare = this.setWXShare.bind(this);
    this.toastInstance = null;
  }

  // 路由跳转时，需要清理图片预览器
  cleanImgViewer = () => {
    try {
      if (hideInstance) {
        hideInstance();
      }
    } catch (e) {
      console.error(e);
    }
  };

  listenRouterChangeAndClean() {
    // FIXME: 此种写法不好
    if (!isServer()) {
      window.addEventListener('popstate', this.cleanImgViewer, false);
    }
  }

  componentDidMount() {
    console.log(process.env.DISCUZ_BUILDINFO);
    if (window.performance) {
      monitor.call('reportTime', {
        eventName: 'fist-render',
        duration: Date.now() - performance.timing.navigationStart,
      });
    }

    this.initOretation();
    window.addEventListener('resize', this.updateSize);
    csrRouterRedirect();
    this.listenRouterChangeAndClean();

    if (!isServer()) {
      window.addEventListener("beforeunload", () => {
        if(STORAGE_TYPE === "session") sessionStorage.removeItem(STORAGE_KEY);
      });
    }

    // 微信分享全局处理
    // step1: 初始化分享配置，需要监听forum接口及offiaccount/jssdk接口返回并完成wx.config后执行
    this.setWXShare(this.props.router.asPath);
    // step2: 路由守卫，每次路由变更后根据分享规则重新进行分享配置
    this.props.router.events.on('routeChangeComplete', this.setWXShare);
  }

  componentWillUnmount() {
    if (!isServer()) {
      window.removeEventListener('resize', this.updateSize);
      window.removeEventListener('popstate', this.cleanImgViewer);
      window.removeEventListener("beforeunload", () => {
        if(STORAGE_TYPE === "session") sessionStorage.removeItem(STORAGE_KEY);
      });
    }
  }

  // 每次跳转，重新进行微信分享设置：（分享规则：https://docs.qq.com/sheet/DYWpnQkZZZFR3YWN3）
  setWXShare(route) {
    if (!(window.wx && window.wx.hasDoneConfig)) {
      return;
    }

    const { site, user: { userInfo } } = this.appStore;
    const { webConfig: { setSite } } = site;
    const { siteName, siteIntroduction, siteHeaderLogo } = setSite;
    const { nickname, avatarUrl, signature, id } = userInfo;

    // 默认分享标题
    let title = document.title;
    // 默认分享描述内容：站点介绍前35个字符 + ‘...’
    let desc = siteIntroduction ?
     (siteIntroduction.length > 35 ? `${siteIntroduction.substr(0, 35)}...` : siteIntroduction) :
     '在这里，发现更多精彩内容';
    // 默认分享链接
    let link = window.location.href;
    // 默认分享图片
    let img = siteHeaderLogo;

    /**
     * 不适用默认分享，需要特殊处理的页面
     */

    // 详情页分享逻辑较复杂，已在业务单独处理
    if (route.match(/\/thread\/\d+/)) {
      return;
    }

    // 他人主页 - 业务处理
    if (route.match(/\/user\/\d+/)) {
      return;
    }

    // 我的主页
    if (route === '/my') {
      if (nickname) {
        title = `${nickname}的主页`;
        img = avatarUrl;
        desc = signature ?
        (signature.length > 35 ? `${signature.substr(0, 35)}...` : signature) :
        '在这里，发现更多精彩内容';
        link = `${window.location.origin}/user/${id}`;
      }
    }

    // 发现页
    if (route.includes('/search')) {
      title = '在这里，发现更多热门内容';
    }

    // 注册、登录、付费加入页
    if (route.includes('/forum/partner-invite') || route.match(/\/user\/(username|wx|phone)-login/) || route.includes('/user/register')) {
      title = `邀请您加入${siteName}`;
    }

    // 首页、推广邀请
    if (route.includes('/invite') || route === '/') {
      title = `${nickname}邀请您加入${siteName}`;
    }

    // 私聊页面分享出去点击访问消息模块首页
    if (route.includes('/message?page=chat')) {
      title = `我的私信 - ${siteName}`;
      link = `${window.location.origin}/message`;
    }

    // 设置分享
    setWxShare(title, desc, link, img);
  }

  // 出错捕获
  componentDidCatch(error, info) {
    console.error(error);
    console.error(info);
    // Router.replace({ url: '/render-error' });
  }

  // 移动端检测横屏
  initOretation() {
    this.toastInstance?.destroy();

    if (browser.env('mobile') && !browser.env('iPad')) {
      const isVertical = detectH5Orient();
      if (!isVertical) {
        this.toastInstance = Toast.info({
          content: '为了更好的体验，请使用竖屏浏览',
          duration: 5000,
        });
      }
    }
  }

  updateSize() {
    this.appStore.site.setPlatform(getPlatform(window.navigator.userAgent));

    this.initOretation();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <div data-dzq-theme="light">
        <Provider {...this.appStore}>
          <Head>
            <meta
              key="viewport"
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover"
            />
          </Head>
          <CustomHead />
          <PayBoxProvider>
            <Component {...pageProps} />
          </PayBoxProvider>
        </Provider>
      </div>
    );
  }
}

export default DzqApp;
