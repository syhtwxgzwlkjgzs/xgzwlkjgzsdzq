
import React from 'react';
import { inject, observer } from 'mobx-react';
import isServer from '@common/utils/is-server';
import getPlatform from '@common/utils/get-platform';
import {readForum, readUser} from '@server';

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
                let server_site;
                let __props = {};

                // 服务端
                if (isServer()) {
                  const { headers } = ctx.req;
                  platform = getPlatform(headers['user-agent']);
                
                  // 获取站点信息
                  siteConfig = await readForum({
                    headers: {
                      'user-agent': headers['user-agent']
                    }
                  }, ctx);
        
                  server_site = { 
                    platform,
                    webConfig: siteConfig && siteConfig.data || null,
                  };
        
                  // 当站点信息获取成功，进行当前用户信息查询
                  if ( siteConfig && siteConfig.code === 0 && siteConfig?.data?.user?.userId) {
                    userInfo = await readUser({
                      params:{pid: siteConfig.data.user.userId},
                      headers: {
                        'user-agent': headers['user-agent']
                      }
                    });
                  }


                    // 传入组件的私有数据
                    if ( Component.getInitialProps ) {
                        __props = await Component.getInitialProps(ctx);
                    }
                }
                
                return {
                    ...__props,
                    server_site,
                    server_user: {
                      userInfo: (userInfo && userInfo.code === 0) ? userInfo.data : null
                    }
                };
              } catch(err) {
                console.log('err', err);
                return null;
              }
        }

        constructor(props) {
            super(props);
            let isNoSiteData = true;
            const { server_user, server_site, user, site } = props;

            server_site && server_site.platform && site.setPlatform(server_site.platform);
            server_site && server_site.webConfig && site.setSiteConfig(server_site.webConfig);
            server_user && server_user.userInfo && user.setUserInfo(server_user.userInfo);
            if (!isServer()) {
                isNoSiteData = (site && site.webConfig) ? false : true;
            } else {
                isNoSiteData = !server_site;
            }
            this.state = {
                isNoSiteData
            };
        }
        async componentDidMount() {
            const { isNoSiteData } = this.state;
            const { server_user, server_site, user, site } = this.props;
            let siteConfig;
            if ( isNoSiteData ) {
                siteConfig = server_site && server_site.webConfig ? server_site.webConfig : null;
                if ( !server_site || !server_site.platform ) {
                    site.setPlatform(getPlatform(window.navigator.userAgent));
                }

                if ( !server_site || !server_site.webConfig ) {
                    const result = await readForum({});
                    result.data && site.setSiteConfig(result.data);
                    siteConfig = result.data || null;
                }   
            } else {
                siteConfig = site ? site.webConfig : null;
            }
            if ( 
                siteConfig && siteConfig.user && 
                (!user || !user.userInfo) &&
                (!server_user || !server_user.userInfo) 
            ) {
                const userInfo = await readUser({params:{pid: siteConfig.user.userId}});
                userInfo.data && user.setUserInfo(userInfo.data);
            }
            this.isPass();
        }

        // 检查是否满足渲染挑战
        isPass() {
            const { site } = this.props;
            const { isNoSiteData } = this.state;
            if ( site && site.webConfig ) {
                isNoSiteData && this.setState({
                    isNoSiteData: false
                });
            } else {
                // 重定向到错误页面
                router.replace('/500');
            }
          
        }

        // 过滤多余参数
        filterProps(data) {
            const newProps = {
                ...data
            };
            delete newProps.server_user;
            delete newProps.server_site;
            delete newProps.user;
            delete newProps.site;
            console.log(newProps);
            return newProps;
        }

        render() {
            const { isNoSiteData } = this.state;
            if ( isNoSiteData ) {
                return <h1>loading</h1>
            } 
            return <Component {...this.filterProps(this.props)}/>
        }

    }

    return FetchSiteData;

}