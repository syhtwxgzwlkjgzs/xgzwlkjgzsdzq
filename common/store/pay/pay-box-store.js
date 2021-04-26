import { observable, computed, action } from 'mobx';
import { get } from '../../utils/get';
import { createOrders, createPayOrder, readOrderDetail, readWalletUser, updateUsersUpdate } from '@server';
import isWeixin from '../../utils/is-weixin';
import browser from '../../utils/browser';
import { STEP_MAP, PAYWAY_MAP, WX_PAY_STATUS, PAY_MENT_MAP, ORDER_STATUS_MAP, PAY_BOX_ERROR_CODE_MAP } from '../../constants/payBoxStoreConstants';
import throttle from '../../utils/thottle';

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

  // 是否匿名
  @observable isAnonymous = false;

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

  resErrorFactory = (res, handlers = {}) => {
    const resCode = get(res, 'code');
    if (handlers[resCode]) {
      handlers(res);
    }
    if (resCode !== 0) {
      throw {
        Code: res.code,
        Message: res.msg,
      };
    }
  }

  errorHandler = (error) => {
    if (error.Code) {
      throw error;
    }
    throw {
      ...PAY_BOX_ERROR_CODE_MAP.NETWORK_ERROR,
      error,
    };
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
        reject(PAY_BOX_ERROR_CODE_MAP.WX_PAY_CANCEL);
      }

      if (payStatus === WX_PAY_STATUS.WX_PAY_FAIL) {
        reject(PAY_BOX_ERROR_CODE_MAP.WX_PAY_FAIL);
      }
    });
  })

  /**
   * 创建订单
   */
  @action
  createOrder = throttle(async () => {
    try {
      const data = {
        ...this.options,
        isAnonymous: this.isAnonymous,
      };
      const createRes = await createOrders({
        timeout: 3000,
        data,
      });
      if (get(createRes, 'code') === 0) {
        this.step = STEP_MAP.PAYWAY;
        this.orderInfo = get(createRes, 'data', {});
        return createRes;
      }
      this.resErrorFactory(createRes);
    } catch (error) {
      this.errorHandler(error);
    }
  }, 2000);

  /**
   * 获取用户钱包信息
   */
  @action
  getWalletInfo = async (uid) => {
    try {
      const getWalletRes = await readWalletUser({
        params: { uid },
      });

      if (get(getWalletRes, 'code') === 0) {
        this.walletInfo = get(getWalletRes, 'data', {});
        return getWalletRes;
      }

      this.resErrorFactory(getWalletRes);
    } catch (error) {
      this.errorHandler(error);
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
  walletPayOrder = throttle(async () => {
    try {
      const payRes = await createPayOrder({
        data: {
          orderSn: this.orderSn,
          paymentType: PAY_MENT_MAP.WALLET,
          password: this.password,
        },
      });

      this.resErrorFactory(payRes);
    } catch (error) {
      this.errorHandler(error);
    }
  }, 1000);

  /**
   * 微信支付订单
   */
  @action
  wechatPayOrder = throttle(async () => {
    try {
      if (!isWeixin()) {
        // is not in weixin, just throw tips error
        throw PAY_BOX_ERROR_CODE_MAP.NOT_IN_WEIXIN_PAY;
      }

      // IOS 暂时政策不允许支付
      if (browser.env('ios')) {
        throw PAY_BOX_ERROR_CODE_MAP.IN_IOS;
      }

      const payRes = await createPayOrder({
        data: {
          orderSn: this.orderSn,
          paymentType: PAY_MENT_MAP.WX_OFFICAL,
        },
      });

      this.resErrorFactory(payRes);

      if (payRes.code === 0) {
        listenWXJsBridgeAndExecCallback(() => {
          this.onBridgeReady(get(payRes, 'data.wechatPayResult.wechatJs'));
          this.timer = setInterval(() => {
            this.getOrderDetail();
          }, 1000);
        });
      }
    } catch (error) {
      this.errorHandler(error);
    }
  }, 1000);

  /**
   * 微信支付订单
   */
  @action
  wechatPayOrderQRCode = throttle(async () => {
    try {
      const payRes = await createPayOrder({
        data: {
          orderSn: this.orderSn,
          paymentType: PAY_MENT_MAP.WX_QRCODE,
        },
      });

      this.resErrorFactory(payRes);

      this.wechatQRCode = get(payRes, 'data.wechatPayResult.wechatQrcode');

      this.timer = setInterval(() => {
        this.getOrderDetail();
      }, 1000);
    } catch (error) {
      this.errorHandler(error);
    }
  }, 1000);

  /**
   * 获取订单详情
   */
  @action
  getOrderDetail = async () => {
    try {
      const orderInfoRes = await readOrderDetail({
        params: {
          orderSn: this.orderSn,
        },
      });

      // if request failed
      this.resErrorFactory(orderInfoRes);

      const orderStatus = get(orderInfoRes, 'data.status');

      if (orderStatus === ORDER_STATUS_MAP.PENDING_PAY) {
        return;
      }

      clearInterval(this.timer);
      this.timer = null;

      if (orderStatus === ORDER_STATUS_MAP.PAID) {
        // success
        if (this.options.success) {
          this.options.success(this.orderInfo);
        }

        if (this.options.complete) {
          this.options.complete(this.orderInfo);
        }
      }

      if (orderStatus === ORDER_STATUS_MAP.OUT_DATE_PAY) {
        // outdate
        if (this.options.failed) {
          this.options.failed(this.orderInfo);
        }

        if (this.options.complete) {
          this.options.complete(this.orderInfo);
        }
      }

      if (orderStatus === ORDER_STATUS_MAP.FAIL_PAY) {
        // paid failed
        if (this.options.failed) {
          this.options.failed(this.orderInfo);
        }

        if (this.options.complete) {
          this.options.complete(this.orderInfo);
        }
      }
    } catch (error) {
      this.errorHandler(error);
    }
  }

  /**
   * 设置支付密码
   */
  @action
  setPayPassword = async () => {
    try {
      const setPayPwdRes = await updateUsersUpdate({
        data: {
          id: 19,
          data: {
            payPassword: this.password,
            payPasswordConfirmation: this.password,
          },
        },
      });

      this.resErrorFactory(setPayPwdRes);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  /**
   * 清空所有状态
   */
  @action
  clear = () => {
    clearInterval(this.timer);
    this.options = {};
    this.visible = false;
    this.orderInfo = null;
    this.timer = null;
    this.step = STEP_MAP.SURE;
    this.payWay = null;
    this.payResult = null;
    this.password = null;
    this.walletInfo = null;
    this.wechatQRCode = null;
  }
}

export default PayBoxStore;
