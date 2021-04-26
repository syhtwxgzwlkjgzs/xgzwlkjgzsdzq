import { PAY_BOX_ERROR_CODE_MAP } from '../../constants/payBoxStoreConstants';

export const onBridgeReady = data => new Promise((resolve, reject) => {
  const { appId, timeStamp, nonceStr, package: wxPackage, paySign } = data;
  // eslint-disable-next-line no-undef
  Taro.requestPayment({
    appId,
    nonceStr,
    package: wxPackage,
    paySign,
    timeStamp,
    signType: 'MD5',
    success: (result) => {
      resolve(result);
    },
    fail: (error) => {
      reject({
        ...PAY_BOX_ERROR_CODE_MAP.WX_MINI_PAY_CREATE_FAILED,
        error,
      });
    },
  });
});

export const listenWXJsBridgeAndExecCallback = (callback) => {
  callback();
};
