import React from 'react';
import { inject } from 'mobx-react';
import { readForum, readUser } from '@server';
import getPlatform from '@common/utils/get-platform';
import router from 'next/router';

export default function clientFetchSiteData() {
  @inject('site')
  @inject('user')
  class HOCFetchSiteData extends React.Component {
    constructor(props) {
      super(props);
      const { serverUser, serverSite, user, site } = props;
      console.log(serverSite);
      serverSite && serverSite.platform && site.setPlatform(serverSite.platform);
      serverSite && serverSite.webConfig && site.setSiteConfig(serverSite.webConfig);

      serverUser && serverUser.userInfo && user.setUserInfo(serverUser.userInfo);
      this.state = {
        isNoSiteData: !serverSite,
      };
    }

    async componentDidMount() {
      const { serverUser, serverSite, user, site } = this.props;

      let siteConfig = serverSite && serverSite.webConfig ? serverSite.webConfig : null;
      if (!serverSite || !serverSite.platform) {
        site.setPlatform(getPlatform(window.navigator.userAgent));
      }

      if (!serverSite || !serverSite.webConfig) {
        const result = await readForum({});
        result.data && site.setSiteConfig(result.data);
        siteConfig = result.data || null;
      }

      if (siteConfig && siteConfig.user && (!serverUser || !serverUser.userInfo)) {
        const userInfo = await readUser({ params: { pid: siteConfig.user.userId } });
        userInfo.data && user.setUserInfo(userInfo.data);
      }

      this.isPass();
    }

    // 检查是否满足渲染挑战
    isPass() {
      debugger;
      const { site } = this.props;
      if (site && site.webConfig) {
        this.setState({
          isNoSiteData: false,
        });
      } else {
        // 重定向到错误页面
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

  return HOCFetchSiteData;
}
