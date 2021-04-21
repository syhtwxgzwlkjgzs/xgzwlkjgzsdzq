const browser={
    env: (t) => {
        const u = navigator.userAgent;
        switch(t) {
            case 'ie' : return u.indexOf('Trident') > -1;//IE内核
            case 'opera' : return u.indexOf('Presto') > -1;//opera内核
            case 'webKit' : return u.indexOf('AppleWebKit') > -1;//苹果、谷歌内核
            case 'gecko' : return u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1;//火狐内核
            case 'mobile' : return !!u.match(/AppleWebKit.*Mobile.*/);//是否为移动终端
            case 'ios' : return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            case 'android' : return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            case 'iPhone' : return u.indexOf('iPhone') > -1; //是否为iPhone或者QQHD浏览器
            case 'iPad' : return u.indexOf('iPad') > -1; //是否iPad
            case 'webApp' : return u.indexOf('Safari') == -1; //是否web应该程序，没有头部与底部
            case 'weixin' : return u.indexOf('MicroMessenger') > -1; //是否微信
            case 'qq' : return u.match(/\sQQ/i) == " qq"; //是否QQ
            default: return false;
        }
    },
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
}

export default browser;