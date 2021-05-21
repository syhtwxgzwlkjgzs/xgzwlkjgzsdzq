import React from 'react';
import { observer, inject } from 'mobx-react';
import { View } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';
import { getCurrentInstance } from '@tarojs/taro';
import PayBoxProvider from '@components/payBox/payBoxProvider';

@inject('user')
@inject('site')
@observer
export default class Page extends React.Component {

  static defaultProps = {
    withLogin: false,
    noWithLogin: false
  }

  constructor(props) {
    super(props);
    const { noWithLogin, withLogin, user } = this.props;

    // 是否必须登录
    if ( withLogin && !user.isLogin()) {
      Router.redirect({
        url: '/subPages/user/login/index'
      });
    }

    // 是否必须不登录
    if (noWithLogin && user.isLogin()) {
      Router.redirect({
        url: '/pages/index/index'
      });
    }
    this.state = {
      isRender: this.isPass()
    }
  }

  // 检查是否满足渲染条件
  isPass() {
    const { site, user } = this.props;
    const path = getCurrentInstance().router.path;

    if (site && site.webConfig) {
      // 关闭站点
      if (path !== '/subPage/close/index' && site.closeSiteConfig) {
        Router.redirect({url:'/subPages/close/index'});
        return false;
      }
      // 付费加入
      if (
        (path !== '/subPages/join/index' && site.webConfig.setSite && site.webConfig.setSite.siteMode === 'pay')
        && (!user.isLogin() || (user.isLogin() && !user.paid))
      ) {
        // todo 需要判断登录后是否支付
        Router.redirect({url: '/subPages/join/index'});
        return false;
      }
      // TODO: 强制绑定方案待定
      if (user.isLogin()) {
        // // 绑定微信：开启微信，没有绑定微信
        // if ((site.isOpenOffiaccountClose || site.isMiniProgramOpen) && path !== '/subPages/user/wx-bind-qrcode/index' && !user.isBindWechat) {
        //   Router.redirect({url: '/subPages/user/wx-bind-qrcode/index'});
        //   return false;
        // }
        // 前置：没有开启微信
        if (!site.isOpenOffiaccountClose && !site.isMiniProgramOpen) {
          // 绑定手机: 开启短信，没有绑定手机号，小程序可以跳过绑定手机，所以不强制绑定手机号
          // if (path !== '/subPages/user/bind-phone/index' && site.isSmsOpen && !user.mobile) {
          //   Router.redirect({url: '/subPages/user/bind-phone/index'});
          //   return false;
          // }
          // 绑定昵称：没有开启短信，也没有绑定昵称
          if (
            path !== '/subPages/user/bind-nickname/index'
            && !site.isSmsOpen
            && !user.nickname
          ) {
            Router.redirect({url: '/subPages/user/bind-nickname/index'});
            return false;
          }
        }
      }
    }

    return true;
  }

  createContent() {
    const { children, site } = this.props;

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
    const { site } = this.props;
    const { isRender } = this.state;
    if(!isRender) return null;
    return (
      <View className={`${styles['dzq-page']} dzq-theme-${site.theme}`}>
        <PayBoxProvider>
          {this.createContent()}
        </PayBoxProvider>
      </View>
    );
  }
}
