
import React from 'react';
import { inject, observer } from 'mobx-react';
import isServer from '@common/utils/is-server';
import getPlatform from '@common/utils/get-platform';
import { readForum, readUser, readPermissions } from '@server';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
import clearLoginStatus from '@common/utils/clear-login-status';
import { REVIEWING } from '@common/store/login/util';
import { Spin, Icon } from '@discuzq/design';
import typeofFn from '@common/utils/typeof';
import setWxShare from '@common/utils/set-wx-share';
import styles from './HOCFetchSiteData.module.scss';
import initWXSDK from '@common/utils/init-wx-sdk';
import {
  WEB_SITE_JOIN_WHITE_LIST,
  JUMP_TO_404,
  INVALID_TOKEN,
  TOKEN_FAIL,
  JUMP_TO_LOGIN,
  JUMP_TO_REGISTER,
  JUMP_TO_AUDIT,
  JUMP_TO_REFUSE,
  JUMP_TO_DISABLED,
  JUMP_TO_HOME_INDEX,
  SITE_CLOSED,
  JUMP_TO_PAY_SITE,
  JUMP_TO_SUPPLEMENTARY,
  REVIEWING_USER_WHITE_LIST_WEB,
} from '@common/constants/site';
import LoginHelper from '@common/utils/login-helper';

// 获取全站数据
export default function HOCFetchSiteData(Component, _isPass) {
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
      let isNoSiteData;
      const { serverUser, serverSite, user, site } = props;

      serverSite && serverSite.platform && site.setPlatform(serverSite.platform);
      serverSite && serverSite.closeSite && site.setCloseSiteConfig(serverSite.closeSite);
      serverSite && serverSite.webConfig && site.setSiteConfig(serverSite.webConfig);
      serverUser && serverUser.userInfo && user.setUserInfo(serverUser.userInfo);
      serverUser && serverUser.userPermissions && user.setUserPermissions(serverUser.userPermissions);

      if (!isServer()) {
        isNoSiteData = !((site && site.webConfig));
      } else {
        isNoSiteData = !serverSite;
      }
      this.state = {
        isNoSiteData,
        isPass: false,
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
        siteConfig = serverSite?.webConfig || null;
        if (!siteConfig) {
          const result = await readForum({});
          result.data && site.setSiteConfig(result.data);

          // 设置全局状态
          this.setAppCommonStatus(result);
          siteConfig = result.data || null;
        }
      } else {
        siteConfig = site ? site.webConfig : null;
      }
      // 初始化登陆方式
      site.initUserLoginEntryStatus();

      // 判断是否有token
      if (siteConfig && siteConfig.user) {
        if ((!user || !user.userInfo) && (!serverUser || !serverUser.userInfo)) {
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
      let defaultPass = this.isPass();
      // 自定义pass逻辑
      if ( _isPass && defaultPass) {
        defaultPass = _isPass(defaultPass);
      }
      this.setState({ isPass: defaultPass });

      // 初始化分享配置
      // const isInit = await initWXSDK(siteConfig && siteConfig.passport && siteConfig.passport.offiaccountOpen);
      // if ( isInit && siteConfig && siteConfig.setSite ) {
      //   const {setSite} = siteConfig;
      //   const {siteName, siteIntroduction, siteFavicon} = setSite;
      //   setWxShare(siteName, siteIntroduction, window.location.href, siteFavicon);
      // }

    }

    setAppCommonStatus(result) {
      const { site } = this.props;

      const CODE_NEED_SAVE = [JUMP_TO_LOGIN, JUMP_TO_REGISTER, JUMP_TO_AUDIT, JUMP_TO_REFUSE, JUMP_TO_DISABLED, JUMP_TO_SUPPLEMENTARY, JUMP_TO_PAY_SITE];
      if (CODE_NEED_SAVE.includes(result.code)) {
        LoginHelper.saveCurrentUrl();
      }

      switch (result.code) {
        case 0:
          break;
        case SITE_CLOSED: // 关闭站点
          site.setCloseSiteConfig(result.data);
          Router.redirect({ url: '/close' });
          break;
        case INVALID_TOKEN:// 没有权限,只能针对forum接口做此判断
          break;
        case TOKEN_FAIL:// token无效
          clearLoginStatus();
          window.location.reload();
          break;
        case JUMP_TO_404:// 资源不存在
          Router.redirect({ url: '/404' });
          break;
        case JUMP_TO_LOGIN:// 到登录页
          clearLoginStatus();
          LoginHelper.gotoLogin();
          break;
        case JUMP_TO_REGISTER:// 到注册页
          clearLoginStatus();
          LoginHelper.saveAndRedirect('/user/register');
          break;
        case JUMP_TO_AUDIT:// 到审核页
          Router.push({ url: '/user/status?statusCode=2' });
          break;
        case JUMP_TO_REFUSE:// 到审核拒绝页
          Router.push({ url: '/user/status?statusCode=-4007' });
          break;
        case JUMP_TO_DISABLED:// 到审核禁用页
          Router.push({ url: '/user/status?statusCode=-4009' });
          break;
        case JUMP_TO_SUPPLEMENTARY:// 跳转到扩展字段页
          LoginHelper.saveAndRedirect('/user/supplementary');
          break;
        case JUMP_TO_HOME_INDEX:// 到首页
          Router.redirect({ url: '/' });
          break;
        case JUMP_TO_PAY_SITE:// 到付费加入页面
          LoginHelper.saveAndRedirect('/forum/partner-invite');
          break;
        default: Router.redirect({ url: '/500' });
          break;
      }
    }

    // 检查跳转
    checkJump() {
      const { router } = this.props;
      const jumpPage = LoginHelper.getUrl();
      if (jumpPage) {
        const urlObj = new URL(jumpPage);
        if (urlObj.pathname === router.asPath) { // 目标地址已达到，清空即可
          LoginHelper.clear()
        } else if (router.asPath === '/') { // 被重定向到首页，取出跳转地址，跳转
          LoginHelper.restore();
          return false;
        }
      }
      return true;
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
          return false;
        }

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
              LoginHelper.saveAndRedirect( '/user/bind-phone' );
              return false;
            }
          }
          // 绑定昵称：没有昵称
          if (router.asPath !== '/user/bind-nickname' && !user.nickname) {
            LoginHelper.saveAndRedirect( '/user/bind-nickname' );
            return false;
          }
          // 账号审核中的 用户只能访问 首页 + 帖子详情页，以及用户状态提示页
          if (user.userStatus === REVIEWING) {
            if (!REVIEWING_USER_WHITE_LIST_WEB.includes(router.pathname)) {
              Router.replace({ url: `/user/status?statusCode=${user.userStatus}` });
              return false;
            }
          }
        }

        // 以下为付费模式相关判断
        if (site?.webConfig?.setSite?.siteMode === 'pay') {
          // 付费加入: 付费状态下，未登录的用户、登录了但是没有付费的用户，访问不是白名单的页面会跳入到付费加入
          if (WEB_SITE_JOIN_WHITE_LIST.some(path => router.asPath.match(path))) {
            this.checkJump();
            return true;
          }

          const code = router.query.inviteCode;
          const query = code ? `?inviteCode=${code}` : '';
          if (!user?.paid) {
            LoginHelper.saveAndRedirect(`/forum/partner-invite${query}`);
            return false;
          }
        }
      }

      return this.checkJump();
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
      const { isNoSiteData, isPass } = this.state;
      const { site } = this.props;
      // CSR不渲染任何内容
      if (site.platform === 'static') return null;
      if (isNoSiteData || !isPass) {
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
