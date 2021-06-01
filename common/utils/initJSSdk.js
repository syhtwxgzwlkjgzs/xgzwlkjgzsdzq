/* eslint-disable max-len */

/**
 * 初始化微信jssdk
 * 参数传入你需要用到的js接口名称，具体参照微信开发文档: https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
 *
 * 目前绑定的是简单待办公众号，本地开发对域名有要求（用whistle把localhost:9527代理成域名访问，域名必须在公众号后台设置了JS接口安全域名），详情可查询文档。
 *
 * 使用示例：
 * initJSSdk(['checkJsApi']);
 * wx.ready({
 *   wx.checkJsApi();
 * });
 *
 *
 */
export default async function initJSSdk(jsApiList = []) {
  const allPromise = [];

  if (!(window.wx && wx.config)) {
    const scriptPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
    allPromise.push(scriptPromise);
  }


  const ajaxPromise = new Promise((resolve) => {
    const ajax = new XMLHttpRequest();
    ajax.open('GET', `${window.location.origin}/apiv3/offiaccount/jssdk?url=${encodeURIComponent(location.href)}`, true);
    ajax.send(null);
    ajax.onreadystatechange = () => {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          resolve(JSON.parse(ajax.responseText));
        } else {}
      }
    };
  });

  const [_ret, ret] = (await Promise.all([scriptPromise, ajaxPromise]));
  if (ret.Code === 0) {
    const params = (({ appId, timestamp, nonceStr, signature }) => ({ appId, timestamp, nonceStr, signature }))(ret.Data);
    wx.config({
      debug: false,
      jsApiList,
      ...params,
    });
  }
};
