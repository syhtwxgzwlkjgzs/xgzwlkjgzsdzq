
import React from 'react';
import { inject, observer } from 'mobx-react';
import isServer from '@common/utils/is-server';
import getPlatform from '@common/utils/get-platform';
import { readForum, readUser, readPermissions } from '@server';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
import clearLoginStatus from '@common/utils/clear-login-status';
import { Spin, Icon } from '@discuzq/design';
import typeofFn from '@common/utils/typeof';
import styles from './HOCFetchSiteData.module.scss';
import { WEB_SITE_JOIN_WHITE_LIST } from '@common/constants/site';

// 获取全站数据
export default function HOCFetchSiteData(Component) {
  @inject('site')
  @inject('user')
  @observer
  class FetchSiteData extends React.Component {
    // 应用初始化
    static async getInitialProps(ctx) {
      try {
        let platform = 'static';
        let siteConfig = {};
        let userInfo;
        let serverSite;
        let __props = {};
        let userData;
        let userPermissions;

        // 服务端
        if (isServer()) {
          const { headers } = ctx.req;
          platform = (headers && !typeofFn.isEmptyObject(headers)) ? getPlatform(headers['user-agent']) : 'static';
          // 获取站点信息
          siteConfig = await readForum({}, ctx);
          serverSite = {
            platform,
            closeSite: siteConfig.code === -3005 ? siteConfig.data : null,
            webConfig: siteConfig && siteConfig.data || null,
          };

          // 当站点信息获取成功，进行当前用户信息查询
          if (siteConfig && siteConfig.code === 0 && siteConfig?.data?.user?.userId) {
            userInfo = await readUser({
              params: { pid: siteConfig.data.user.userId },
            }, ctx);
            userPermissions = await readPermissions({}, ctx);

            userData = (userInfo && userInfo.code === 0) ? userInfo.data : null;
            userPermissions = (userPermissions && userPermissions.code === 0) ? userPermissions.data : null;
          }

          console.log(Component.getInitialProps)
          // 传入组件的私有数据
          if (siteConfig && siteConfig.code === 0 && Component.getInitialProps) {
            __props = await Component.getInitialProps(ctx, { user: userData, site: serverSite });
          }
        }

        return {
          ...__props,
          // serverSite: {},
          // serverUser: {},
          serverSite,
          serverUser: {
            userInfo: userData,
            userPermissions,
          },
        };
      } catch (err) {
        console.log('err', err);
        return {
          serverSite: {},
          serverUser: {},
        };
      }
    }

    constructor(props) {
      super(props);
      let isNoSiteData = true;
      const { serverUser, serverSite, user, site } = props;

      serverSite && serverSite.platform && site.setPlatform(serverSite.platform);
      serverSite && serverSite.closeSite && site.setCloseSiteConfig(serverSite.closeSite);
      serverSite && serverSite.webConfig && site.setSiteConfig(serverSite.webConfig);
      serverUser && serverUser.userInfo && user.setUserInfo(serverUser.userInfo);
      serverUser && serverUser.userPermissions && user.setUserPermissions(serverUser.userPermissions);

      // 如果还没有获取用户名登录入口是否展示接口，那么请求来赋予初始值
      if (this.props.site.isUserLoginVisible === null) {
        try {
          this.props.site.getUserLoginEntryStatus();
        } catch (error) {
          console.log(error);
        }
      }

      if (!isServer()) {
        isNoSiteData = !((site && site.webConfig));
      } else {
        isNoSiteData = !serverSite;
      }
      this.state = {
        isNoSiteData,
      };
    }

    async componentDidMount() {
      const { isNoSiteData } = this.state;
      const { serverUser, serverSite, user, site } = this.props;
      let siteConfig;
      let loginStatus = false;

      // 设置平台标识
      site.setPlatform(getPlatform(window.navigator.userAgent));


      if (isNoSiteData) {
        siteConfig = serverSite && serverSite.webConfig ? serverSite.webConfig : null;
        if (!serverSite || !serverSite.webConfig) {
          const result = await readForum({});
          result.data && site.setSiteConfig(result.data);
          // 设置全局状态
          this.setAppCommonStatus(result);
          siteConfig = result.data || null;
        }
      } else {
        siteConfig = site ? site.webConfig : null;
      }
      // 判断是否有token
      if (siteConfig && siteConfig.user) {
        if (
          (!user || !user.userInfo)
                  && (!serverUser || !serverUser.userInfo)
        ) {
          const userInfo = await readUser({ params: { pid: siteConfig.user.userId } });
          const userPermissions = await readPermissions({});

          // 添加用户发帖权限
          userPermissions.code === 0 && userPermissions.data && user.setUserPermissions(userPermissions.data);
          // 当客户端无法获取用户信息，那么将作为没有登录处理
          userInfo.data && user.setUserInfo(userInfo.data);
          loginStatus = !!userInfo.data;
        } else {
          loginStatus = true;
        }
      } else {
        loginStatus = false;
      }
      user.updateLoginStatus(loginStatus);
      this.isPass();
    }

    setAppCommonStatus(result) {
      const { site } = this.props;
      switch (result.code) {
        case 0:
          break;
        case -3005: site.setCloseSiteConfig(result.data);
          break;
        case -4002:
          clearLoginStatus();
          window.location.reload();
          break;
        default: Router.redirect({ url: '/500' });
          break;
      }
    }

    // 检查是否满足渲染条件
    isPass() {
      const { site, router, user } = this.props;
      const { isNoSiteData } = this.state;
      if (site && site.webConfig) {
        isNoSiteData && this.setState({
          isNoSiteData: false,
        });
        // 关闭站点
        if (router.asPath !== '/close' && site.closeSiteConfig) {
          Router.redirect({ url: '/close' });
        }
        // 付费加入: 付费状态下，未登录的用户、登录了但是没有付费的用户，访问不是白名单的页面会跳入到付费加入
        if (
          (router.asPath !== '/forum/partner-invite' && site?.webConfig?.setSite?.siteMode === 'pay')
          && (!user.isLogin() || (user.isLogin() && !user.paid))
          && !WEB_SITE_JOIN_WHITE_LIST.includes(router.asPath)
        ) {
          Router.redirect({ url: '/forum/partner-invite' });
        }
        // TODO: 方案待定
        // 前置: 用户已登录
        if (user.isLogin()) {
          // TODO: 需要在微信绑定页获取设置uid的缓存才能开启强制跳转绑定微信
          // // 绑定微信：开启微信，没有绑定微信
          // if (
          //   router.asPath !== '/user/wx-bind-qrcode'
          //     && (site.isOffiaccountOpen || site.isMiniProgramOpen)
          //     && !user.isBindWechat
          // ) {
          //   Router.redirect({ url: '/user/wx-bind-qrcode' });
          // }
          // 前置：没有开启微信
          if (!site.isOffiaccountOpen && !site.isMiniProgramOpen) {
            // 绑定手机: 开启短信，没有绑定手机号
            if (router.asPath !== '/user/bind-phone' && site.isSmsOpen && !user.mobile) {
              Router.redirect({ url: '/user/bind-phone' });
            }
          }
          // 绑定昵称：没有昵称
          if (
            router.asPath !== '/user/bind-nickname'
            && !user.nickname
          ) {
            Router.redirect({ url: '/user/bind-nickname' });
          }
        }
      }
    }

    // 过滤多余参数
    filterProps(data) {
      const newProps = {
        ...data,
      };
      delete newProps.serverUser;
      delete newProps.serverSite;
      delete newProps.user;
      delete newProps.site;
      return newProps;
    }

    render() {
      const { isNoSiteData } = this.state;
      const { site } = this.props;
      // CSR不渲染任何内容
      if (site.platform === 'static') return null;
      if (isNoSiteData) {
        return (
          <div className={styles.loadingBox}>
            <Icon className={styles.loading} name="LoadingOutlined" size="large" />
          </div>
        );
      }
      return <Component {...this.filterProps(this.props)}/>;
    }
  }

  return withRouter(FetchSiteData);
}
