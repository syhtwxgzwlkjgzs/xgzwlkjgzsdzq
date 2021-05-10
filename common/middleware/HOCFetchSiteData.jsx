
import React from 'react';
import { inject, observer } from 'mobx-react';
import isServer from '@common/utils/is-server';
import getPlatform from '@common/utils/get-platform';
import { readForum, readUser, readPermissions } from '@server';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
import clearLoginStatus from '@common/utils/clear-login-status';
import reload from '@common/utils/reload';
import { Icon } from '@discuzq/design';
import styles from './HOCFetchSiteData.module.scss';
// 获取全站数据
export default function HOCFetchSiteData(Component) {
  @inject('site')
  @inject('user')
  @observer
  class FetchSiteData extends React.Component {
      // 应用初始化
      static async getInitialProps(ctx) {
        try {
          let platform = 'pc';
          let siteConfig = {};
          let userInfo;
          let serverSite;
          let __props = {};
          let userData;
          let userPermissions;

          // 服务端
          if (isServer()) {
            const { headers } = ctx.req;
            platform = getPlatform(headers['user-agent']);
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
              userPermissions
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
            reload();
            break;
          default: Router.redirect({url: '/500'});
            break;
        }
      }

      // 检查是否满足渲染条件
      isPass() {
        const { site, router } = this.props;
        const { isNoSiteData } = this.state;
        if (site && site.webConfig) {
          isNoSiteData && this.setState({
            isNoSiteData: false,
          });
          // 关闭站点
          if (router.asPath !== '/close' && site.closeSiteConfig) {
            Router.redirect({url:'/close'});
          }
          // 付费加入
          if ( router.asPath !== '/join' && site.webConfig.setSite && site.webConfig.setSite.siteMode === 'pay' ) {
            // todo 需要判断登录后是否支付
            Router.redirect({url: '/join'});
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
