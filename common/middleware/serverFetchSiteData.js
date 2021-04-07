import {readForum, readUser} from '@server';
import getPlatform from '@common/utils/get-platform';

export default async function initSiteData(ctx) {
    try {
        let platform = 'pc';
        let siteConfig;
        let userInfo;
        let server_site;
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
        return {
            server_site,
            server_user: {
                userInfo: (userInfo && userInfo.code === 0) ? userInfo.data : null
            }
        }
    } catch (err) {
      console.log(err);
        return {};
    }
    
}