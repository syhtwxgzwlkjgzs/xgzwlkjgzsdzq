import { observable, computed, action } from 'mobx';
import { get } from '../../utils/get';
import { createOrders, createPayOrder, readOrderDetail, readWalletUser, updateUsersUpdate } from '@server';

export const STEP_MAP = {
  SURE: 'sure', // 订单确认阶段
  PAYWAY: 'payway', // 选择支付方式阶段
  PAY: 'pay', // 付费阶段
  WALLET_PASSWORD: 'walletPassword', // 钱包密码输入阶段
  RESULT: 'result', // 付费完成后确认付费信息阶段
};

// 支付模式映射表
export const PAYWAY_MAP = {
  WX: 'weixin', // 微信支付
  WALLET: 'wallet', // 钱包支付
};

// 微信支付状态映射表
export const WX_PAY_STATUS = {
  WX_PAY_OK: 'get_brand_wcpay_request:ok',
  WX_PAY_CANCEL: 'get_brand_wcpay_request:cancel',
  WX_PAY_FAIL: 'get_brand_wcpay_request:fail',
};

// 支付方式映射表
export const PAY_MENT_MAP = {
  WX_QRCODE: 10,
  WX_H5: 11,
  WX_OFFICAL: 12,
  WX_MINI_PROGRAM: 13,
  WALLET: 20,
};

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

class PayBoxStore {
  // 订单 options
  @observable options = {};

  // 窗口是否可见
  @observable visible = false;

  // 订单信息
  @observable orderInfo = null;

  // 轮询 timer
  @observable timer = null;

  // 当前所属的阶段
  @observable step = STEP_MAP.SURE;

  // 如果为 null，则代表没有选择支付方式
  @observable payWay = null;

  // 如果为 null，则代表支付还没完成
  @observable payResult = null;

  // 如果钱包支付，钱包的密码存储在这里
  @observable password = null;

  // 用户钱包信息
  @observable walletInfo = null;

  // PC下使用的付费二维码
  @observable wechatQRCode = null;

  // 用户钱包状态
  @computed get walletStatus() {
    return null;
  }

  // 用户钱包可用余额
  @computed get walletAvaAmount() {
    return get(this.walletInfo, 'availableAmount');
  }

  // 订单编号信息
  @computed get orderSn() {
    return get(this.orderInfo, 'orderSn');
  }

  @action
  onBridgeReady = data => new Promise((resolve, reject) => {
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
        reject({
          Code: '',
          Message: '',
        });
      }

      if (payStatus === WX_PAY_STATUS.WX_PAY_FAIL) {
        reject({
          Code: '',
          Message: '',
        });
      }
    });
  })

  /**
   * 创建订单
   */
  @action
  createOrder = async () => {
    try {
      const createRes = await createOrders({
        timeout: 3000,
        data: this.options,
      });
      if (get(createRes, 'code') === 0) {
        this.step = STEP_MAP.PAYWAY;
        this.orderInfo = get(createRes, 'data', {});
        return createRes;
      }
      throw {
        Code: createRes.code,
        Message: createRes.msg,
      };
    } catch (error) {
      console.error(error);
      if (error.Code) {
        throw error;
      }
      throw {
        Code: 'ulg_9999',
        Message: '网络错误',
        error,
      };
    }
  }

  /**
   * 获取用户钱包信息
   */
  @action
  getWalletInfo = async (uid = 19) => {
    try {
      const getWalletRes = await readWalletUser({
        params: { uid },
      });

      if (get(getWalletRes, 'code') === 0) {
        this.walletInfo = get(getWalletRes, 'data', {});
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 进入钱包输入密码环节
   */
  @action
  walletPayEnsure = async () => {
    this.step = STEP_MAP.WALLET_PASSWORD;
  }

  /**
   * 钱包支付订单
   */
  @action
  walletPayOrder = async () => {
    try {
      const payRes = await createPayOrder({
        data: {
          orderSn: this.orderSn,
          paymentType: PAY_MENT_MAP.WALLET,
          password: this.password,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 微信支付订单
   */
  @action
  wechatPayOrder = async () => {
    try {
      const payRes = await createPayOrder({
        data: {
          orderSn: this.orderSn,
          paymentType: PAY_MENT_MAP.WX_OFFICAL,
        },
      });
      if (payRes.code === 0) {
        listenWXJsBridgeAndExecCallback(() => {
          this.onBridgeReady(get(payRes, 'data.wechat_js'));
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 微信支付订单
   */
  @action
  wechatPayOrderQRCode = async () => {
    try {
      const payRes = await createPayOrder({
        data: {
          orderSn: this.orderSn,
          paymentType: PAY_MENT_MAP.WX_QRCODE,
        },
      });
      this.wechatQRCode = get(payRes, 'data.wechatPayResult.wechatQrcode');
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 获取订单详情
   */
  @action
  getOrderDetail = async () => {
    try {
      const orderInfo = await readOrderDetail({
        data: {
          orderSn: this.orderSn,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 设置支付密码
   */
  @action
  setPayPassword = async () => {
    try {
      await updateUsersUpdate({
        data: {
          id: 19,
          data: {
            payPassword: this.password,
            payPasswordConfirmation: this.password,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default PayBoxStore;
