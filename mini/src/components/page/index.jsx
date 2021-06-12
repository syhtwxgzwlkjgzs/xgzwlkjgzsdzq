import React from 'react';
import { observer, inject } from 'mobx-react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';
import Icon from '@discuzq/design/dist/components/icon/index';
import Router from '@discuzq/sdk/dist/router';
import { getCurrentInstance } from '@tarojs/taro';
import PayBoxProvider from '@components/payBox/payBoxProvider';
import { MINI_SITE_JOIN_WHITE_LIST } from '@common/constants/site';
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
import Taro from '@tarojs/taro'

const INDEX_URL = '/pages/index/index'
const PARTNER_INVITE_URL = '/subPages/forum/partner-invite/index'
const WX_AUTH_URL = '/subPages/user/wx-auth/index'
const BIND_NICKNAME_URL = '/subPages/user/bind-nickname/index'
const CLOSE_URL = '/subPage/close/index'
const PAGE_404_URL = 'subPages/404/index'
const PAGE_500_URL = 'subPages/500/index'

@inject('user')
@inject('site')
@observer
export default class Page extends React.Component {
  static defaultProps = {
    withLogin: false,
    noWithLogin: false,
    disabledToast: false,
  };

  constructor(props) {
    super(props);
    const { noWithLogin, withLogin, user } = this.props;
    // 是否必须登录
    if (withLogin && !user.isLogin()) {
      Router.redirect({ url: WX_AUTH_URL, });
    }

    // 是否必须不登录
    if (noWithLogin && user.isLogin()) {
      Router.redirect({ url: INDEX_URL, });
    }
  }

  // 检查是否满足渲染条件
  isPass(noWait = false) {
    const { site, user } = this.props;
    const path = getCurrentInstance().router.path;
    const siteMode = site?.webConfig?.setSite?.siteMode;

    if (site?.webConfig) {
      // 关闭站点
      if (path !== CLOSE_URL && site.closeSiteConfig) {
        Router.reLaunch({ url: CLOSE_URL });
        return false;
      }

      // 付费模式处理
      if (siteMode === 'pay') {
        // 已付费用户，直接跳转首页
        if (path === PARTNER_INVITE_URL && user.paid) {
          Router.reLaunch({ url: INDEX_URL, });
          return false;
        }

        // 未付费用户访问非白名单页面，强制跳转付费页
        if (path !== PARTNER_INVITE_URL && !MINI_SITE_JOIN_WHITE_LIST.includes(path)) {
          if (!user.userInfo && !noWait) {
            // 此时可能用户信息加载中。延时1000ms再检查一次
            setTimeout(() => {
              this.isPass(true);
            }, 1000)
            return false;
          } else if (!user.paid){
            Router.reLaunch({ url: PARTNER_INVITE_URL });
            return false;
          }
        }
      }
      
      // TODO: 强制绑定方案待定
      if (user.isLogin()) {
        // // 绑定微信：开启微信，没有绑定微信
        // if ((site.isOffiaccountOpen || site.isMiniProgramOpen) && path !== '/subPages/user/wx-bind-qrcode/index' && !user.isBindWechat) {
        //   Router.redirect({url: '/subPages/user/wx-bind-qrcode/index'});
        //   return false;
        // }
        // 前置：没有开启微信
        if (!site.isOffiaccountOpen && !site.isMiniProgramOpen) {
          // 绑定昵称：没有开启短信，也没有绑定昵称
          if (path !== BIND_NICKNAME_URL && !user.nickname) {
            Router.reLaunch({ url: BIND_NICKNAME_URL });
            return false;
          }
        }
      }
    }

    return true;
  }

  createContent() {
    const { children, site } = this.props;
    const routerList = Taro.getCurrentPages();
    const currRouter = routerList[routerList.length - 1];
    if ( currRouter ) {
      const path = currRouter.route;
      if ( path === INDEX_URL || path === PAGE_404_URL || path === PAGE_500_URL ) {
        return children;
      }
    }

    if (!site.webConfig && !site.closeSiteConfig) {
      return (
        <View className={styles.loadingBox}>
          <Icon className={styles.loading} name="LoadingOutlined" size="large" />
        </View>
      );
    }
    return children;
  }

  render() {
    const { site, disabledToast } = this.props;
    const isRender = this.isPass()

    if (!isRender) return null;
    return (
      <View className={`${styles['dzq-page']} dzq-theme-${site.theme}`}>
        <PayBoxProvider>{this.createContent()}</PayBoxProvider>
        {!disabledToast && <ToastProvider></ToastProvider>}
      </View>
    );
  }
}
