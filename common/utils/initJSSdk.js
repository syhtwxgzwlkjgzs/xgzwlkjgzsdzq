/* eslint-disable max-len */
export default async function initJSSdk(jsApiList = []) {
  const scriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });

  const ajaxPromise = new Promise((resolve) => {
    const ajax = new XMLHttpRequest();
    ajax.open('GET', `https://discuzv3-dev.dnspod.dev/apiv3/offiaccount/jssdk?url=${encodeURIComponent(location.href)}`, true);
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
      debug: true,
      jsApiList,
      ...params,
    });
  }
};
