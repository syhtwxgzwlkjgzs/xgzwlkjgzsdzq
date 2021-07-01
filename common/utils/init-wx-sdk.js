

import { getWXConfig } from '@discuzq/sdk/dist/api/wx/get-wx-config';
import browser from '@common/utils/browser';
const DEFAULT_JSAPULIST = ['closeWindow', 'chooseImage', 'uploadImage', 'updateAppMessageShareData', 'updateTimelineShareData', 'getLocalImgData'];
export default async function initWXSDK(jsApiList = []) {
    if ( !browser.env('weixin') ) return;
    const allPromise = [];
    const res = await getWXConfig({params: {
        url: encodeURIComponent(window.location.href)
    }});
    if (!(window.wx && wx.config)) {
        const scriptPromise = new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
            script.onload = () => resolve();
            document.body.appendChild(script);
        });
        allPromise.push(scriptPromise);
    }
    if ( res.code === 0 && res.data && res.data.appId) {
        await Promise.all(allPromise);
        const params = (({ appId, timestamp, nonceStr, signature }) => ({ appId, timestamp, nonceStr, signature }))(res.data);
        wx && wx.config({
            debug: false,
            ...params,
            jsApiList: [...DEFAULT_JSAPULIST, ...jsApiList],
        });
    } else {
        console.error('初始化微信jssdk失败！', res);
    }
}