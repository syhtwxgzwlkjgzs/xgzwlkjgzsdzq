import { readForum, readUser } from '@server';
import getPlatform from '@common/utils/get-platform';

export default async function initSiteData(ctx) {
  try {
    let platform = 'pc';
    let userInfo;
    const { headers } = ctx.req;
    platform = getPlatform(headers['user-agent']);

    // 获取站点信息
    const siteConfig = await readForum({
      headers: {
        'user-agent': headers['user-agent'],
      },
    }, ctx);

    const serverSite = {
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
    return {
      serverSite,
      serverUser: {
        userInfo: (userInfo && userInfo.code === 0) ? userInfo.data : null,
      },
    };
  } catch (err) {
    console.log(err);
    return {};
  }
}
