import Router from '@discuzq/sdk/dist/router';
import typeofFn from '@common/utils/typeof';

export default function csrRouterRedirect() {
    if (process.env.DISCUZ_RUN === 'static') {
        let routerMap = process.env.ROUTER_MAP;
        if ( typeofFn.isString(routerMap) ) {
          routerMap = JSON.parse(routerMap);
        }
  
        // // 当CSR出现末尾是index，会导致不能正确跳转的问题；
        let { pathname } = window.location;
  
        if (pathname !== '' || pathname !== '/') {
          const pathnameArr = pathname.split('/');
          if (pathnameArr[pathnameArr.length - 1] === 'index') {
            pathnameArr.pop();
            pathname = pathnameArr.join('/');
          }
        }

        // 如果是首页不处理
        if ( pathname === '' || pathname === '/' ) {
            return;
        }

        const pathArr = pathname.split('/');
        let curr = routerMap;
        let res = [];
        for ( let i = 0; i < pathArr.length; i++ ) {
            if ( pathArr[i] === '' ) continue;

            if ( curr[pathArr[i]] ) {
                res.push(pathArr[i]);
                curr = curr[pathArr[i]];
            // 没有找到是否存在是动态路由
            } else {
                if ( curr['*'] && i == pathArr.length - 1 ) {
                    res.push(pathArr[i]);
                } else {
                    Router.redirect({ url: `/404` });
                    return;
                }
            }
        }
        Router.redirect({ url: `/${res.join('/')}${window.location.search}` });
    }
}