import React from 'react';
import { inject, observer } from 'mobx-react';
import {readForum, readUser} from '@server';
import getPlatform from '@common/utils/get-platform';
import router from 'next/router'
import isServer from '@common/utils/is-server';

export default function clientFetchSiteData(Component, option) {
    
    @inject('site')
    @inject('user')
    class HOCFetchSiteData extends React.Component {
        constructor(props) {
            super(props);
            const { server_user, server_site, user, site } = props;
            console.log(server_site)
            server_site && server_site.platform && site.setPlatform(server_site.platform);
            server_site && server_site.webConfig && site.setSiteConfig(server_site.webConfig);
        
            server_user && server_user.userInfo && user.setUserInfo(server_user.userInfo);
            this.state = {
                isNoSiteData: !server_site
            };
        }

        async componentDidMount() {
            const { server_user, server_site, user, site } = this.props;

            let siteConfig = server_site && server_site.webConfig ? server_site.webConfig : null;
            if ( !server_site || !server_site.platform ) {
                site.setPlatform(getPlatform(window.navigator.userAgent));
            }

            if ( !server_site || !server_site.webConfig ) {
                const result = await readForum({});
                result.data && site.setSiteConfig(result.data);
                siteConfig = result.data || null;
            }

            if ( siteConfig && siteConfig.user && (!server_user || !server_user.userInfo) ) {
                const userInfo = await readUser({params:{pid: siteConfig.user.userId}});
                userInfo.data && user.setUserInfo(userInfo.data);
            }

            this.isPass();
        }

        // 检查是否满足渲染挑战
        isPass() {
            debugger
            const { site } = this.props;
            if ( site && site.webConfig ) {
                this.setState({
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

    return HOCFetchSiteData;
}