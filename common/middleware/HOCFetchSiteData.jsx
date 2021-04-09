
import React from 'react';
import { inject } from 'mobx-react';
import isServer from '@common/utils/is-server';
import getPlatform from '@common/utils/get-platform';
import { readForum, readUser } from '@server';

export default function HOCFetchSiteData(Component) {
  @inject('site')
  @inject('user')
  class FetchSiteData extends React.Component {
    // 应用初始化
    static async getInitialProps(ctx) {
      try {
        let platform = 'pc';
        let siteConfig;
        let userInfo;
        let serverSite;
        let __props = {};

        // 服务端
        if (isServer()) {
          const { headers } = ctx.req;
          platform = getPlatform(headers['user-agent']);

          // 获取站点信息
          siteConfig = await readForum({
            headers: {
              'user-agent': headers['user-agent'],
            },
          }, ctx);

          serverSite = {
            platform,
            webConfig: (siteConfig && siteConfig.data) || null,
          };

          // 当站点信息获取成功，进行当前用户信息查询
          if (siteConfig && siteConfig.code === 0 && siteConfig?.data?.user?.userId) {
            userInfo = await readUser({
              params: { pid: siteConfig.data.user.userId },
              headers: {
                'user-agent': headers['user-agent'],
              },
            });
          }


          // 传入组件的私有数据
          if (Component.getInitialProps) {
            __props = await Component.getInitialProps(ctx);
          }
        }

        return {
          ...__props,
          serverSite,
          serverUser: {
            userInfo: (userInfo && userInfo.code === 0) ? userInfo.data : null,
          },
        };
      } catch (err) {
        console.log('err', err);
        return null;
      }
    }

    constructor(props) {
      super(props);
      let isNoSiteData = true;
      const { serverUser, serverSite, user, site } = props;

      serverSite && serverSite.platform && site.setPlatform(serverSite.platform);
      serverSite && serverSite.webConfig && site.setSiteConfig(serverSite.webConfig);
      serverUser && serverUser.userInfo && user.setUserInfo(serverUser.userInfo);
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
      if (isNoSiteData) {
        siteConfig = serverSite && serverSite.webConfig ? serverSite.webConfig : null;
        if (!serverSite || !serverSite.platform) {
          site.setPlatform(getPlatform(window.navigator.userAgent));
        }

        if (!serverSite || !serverSite.webConfig) {
          const result = await readForum({});
          result.data && site.setSiteConfig(result.data);
          siteConfig = result.data || null;
        }
      } else {
        siteConfig = site ? site.webConfig : null;
      }
      if (
        siteConfig && siteConfig.user
          && (!user || !user.userInfo)
          && (!serverUser || !serverUser.userInfo)
      ) {
        const userInfo = await readUser({ params: { pid: siteConfig.user.userId } });
        userInfo.data && user.setUserInfo(userInfo.data);
      }
      this.isPass();
    }

    // 检查是否满足渲染挑战
    isPass() {
      const { site } = this.props;
      const { isNoSiteData } = this.state;
      if (site && site.webConfig) {
        isNoSiteData && this.setState({
          isNoSiteData: false,
        });
      } else {
        // 重定向到错误页面
        // eslint-disable-next-line no-undef
        router.replace('/500');
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
      console.log(newProps);
      return newProps;
    }

    render() {
      const { isNoSiteData } = this.state;
      if (isNoSiteData) {
        return <h1>loading</h1>;
      }
      return <Component {...this.filterProps(this.props)}/>;
    }
  }

  return FetchSiteData;
}
