import { PAY_BOX_ERROR_CODE_MAP, WX_PAY_STATUS } from '../../constants/payBoxStoreConstants';
import { get } from '../../utils/get';

export const onBridgeReady = data => new Promise((resolve, reject) => {
  const { appId, timeStamp, nonceStr, package: wxPackage, paySign } = data;
  // eslint-disable-next-line no-undef
  WeixinJSBridge.invoke('getBrandWCPayRequest', {
    appId,
    timeStamp,
    nonceStr,
    package: wxPackage,
    signType: 'MD5',
    paySign,
  }, (data) => {
    const payStatus = get(data, 'err_msg', '');
    if (payStatus === WX_PAY_STATUS.WX_PAY_OK) {
      resolve();
    }

    if (payStatus === WX_PAY_STATUS.WX_PAY_CANCEL) {
      reject(PAY_BOX_ERROR_CODE_MAP.WX_PAY_CANCEL);
    }

    if (payStatus === WX_PAY_STATUS.WX_PAY_FAIL) {
      reject(PAY_BOX_ERROR_CODE_MAP.WX_PAY_FAIL);
    }
  });
});

export const listenWXJsBridgeAndExecCallback = (callback) => {
  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', callback, false);
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', callback);
      document.attachEvent('onWeixinJSBridgeReady', callback);
    }
  } else {
    callback();
  }
};
