import React from 'react';
import { Provider } from 'mobx-react';
import App from 'next/app';
import initializeStore from '@common/store';
import '../styles/index.scss';
import getPlatform from '@common/utils/get-platform';
import isServer from '@common/utils/is-server';
import {readForum, readUser} from '@server';
import router from 'next/router'

class DzqApp extends App {
  // 应用初始化
  // static async getInitialProps(appContext) {
  //   try {
  //     let appStore;
  //     let platform = 'pc';
  //     let siteConfig;
  //     let userInfo;
  //     let site;
  //     if (isServer()) {

  //       const { ctx } = appContext;
  //       const { headers } = ctx.req;
  //       platform = getPlatform(headers['user-agent']);
        
  //       // 获取站点信息
  //       siteConfig = await readForum({
  //         headers: {
  //           'user-agent': headers['user-agent']
  //         }
  //       }, ctx);

  //       site = { 
  //         platform,
  //         webConfig: siteConfig && siteConfig.data || null,
  //       };

  //       // 当站点信息获取成功，进行当前用户信息查询
  //       if ( siteConfig && siteConfig.code === 0 && siteConfig?.data?.user?.userId) {
  //         userInfo = await readUser({
  //           params:{pid: siteConfig.data.user.userId},
  //           headers: {
  //             'user-agent': headers['user-agent']
  //           }
  //         });
  //       }

  //     }
  //     appStore = initializeStore({
  //         site,
  //         user: {
  //           userInfo: (userInfo && userInfo.code === 0) ? userInfo.data : null
  //         }
  //     });
  //     appContext.ctx.appStore = appStore;

  //     return {
  //       initialAppStore: appStore
  //     };
  //   } catch(err) {
  //     console.log('err', err);
  //     return null;
  //   }
  // }

  constructor(props) {
    super(props);
    // this.state = {
    //   siteStatus: 'noraml',
    //   csrChance: props.initialAppStore.site.webConfig ? false : true
    // };
    // // 全局数据获取
    // this.appStore = isServer() ? props.initialAppStore : initializeStore(props.initialAppStore);
    this.appStore = initializeStore();
  }

  // async componentDidMount() {
  //   // 检查必须有站点信息，否则不能正常使用站点
  //   if (!this.appStore.site.webConfig) {
  //     const siteConfig = await readForum({});
  //     siteConfig.data && this.appStore.site.setSiteConfig(siteConfig.data);
  //     // 获取用户信息
  //     if ( siteConfig.code === 0 && siteConfig?.data?.user?.userId) {
  //       const userInfo = await readUser({params:{pid: siteConfig.data.user.userId}});
  //       userInfo.data && this.appStore.user.setUserInfo(userInfo.data);
  //     } else {
  //       // 根据特殊状态码处理
  //       switch ( siteConfig.code ) {
  //         // 站点关闭
  //         case -3005 : 
  //           this.setState({siteStatus: 'close'});
  //           this.appStore.site.setCloseSiteConfig(siteConfig.data);
  //           router.replace('/close')
  //         break;
  //       }

  //     }
  //   }
  //   // 有站点信息没有用户信息
  //   else if ( this.appStore.site.webConfig && this.appStore.site.webConfig.user && this.appStore.site.webConfig.user.userId && !this.appStore.user.userInfo) {
  //     const userInfo = await readUser({params:{pid: this.appStore.site.webConfig.user.userId}});
  //     userInfo.data && this.appStore.user.setUserInfo(userInfo.data);
  //   }
  //   this.setState({csrChance: false});
  // }

  // isRenderSite() {
  //   const { Component, pageProps } = this.props;
  //   const { csrChance, siteStatus } = this.state;
  //   // 某些情况下，可以基于没有站点信息
  //   if ( siteStatus === 'close' ) {
  //     return (<Component {...pageProps} />);
  //   }

  //   // 检查必须有站点信息，否则不能正常使用站点
  //   // 浏览器重试机会
  //   if ( csrChance && !this.appStore.site.webConfig) {
  //     return (<div>loading</div>);
  //   }
  //   // 浏览器重试后
  //   if ( !csrChance && !this.appStore.site.webConfig ) {
  //     return (<div>没有站点信息</div>);
  //   }
  //   return (<Component {...pageProps} />);
  // }

  render() {
    // todo 路由鉴权
    const { Component, pageProps } = this.props;
    return (
      <Provider {...this.appStore}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default DzqApp;
