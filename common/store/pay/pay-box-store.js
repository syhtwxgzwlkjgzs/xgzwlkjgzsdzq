import { observable, computed, action } from 'mobx';
import { get } from '../../utils/get';
import isWeixin from '../../utils/is-weixin';
import { createOrders, createPayOrder, readOrderDetail, readWalletUser, updateUsersUpdate } from '@server';
import { STEP_MAP, PAY_MENT_MAP, ORDER_STATUS_MAP, PAY_BOX_ERROR_CODE_MAP } from '../../constants/payBoxStoreConstants';

const noop = () => {};

class PayBoxStore {
  // 成功回调
  onSuccess = noop;
  successCallback = () => {
    this.onSuccess(this.orderInfo);
  };

  // 失败回调
  onFailed = noop;
  failedCallback = () => {
    this.onFailed(this.orderInfo);
  };

  // 结束回调
  onCompleted = noop;
  completedCallback = () => {
    this.onCompleted(this.orderInfo);
  };

  qrCodeCheckTimer = null;

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

  // pc使用的付费二维码是否过期
  @observable qrCodeTimeout = false;

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

  errorHandler = async (error) => {
    console.log(error);
    if (error.Code) {
      throw {
        Code: error.Code,
        Message: error.Message,
      };
    }
    throw {
      ...PAY_BOX_ERROR_CODE_MAP.NETWORK_ERROR,
      error,
    };
  }

  /**
   * 二维码过期检查
   */
  @action
  checkQrCodeTimeout = () => {
    clearTimeout(this.qrCodeCheckTimer);
    this.qrCodeCheckTimer = setTimeout(() => {
      clearTimeout(this.timer);
      this.qrCodeTimeout = true;
    }, 1000 * 5 * 60);
  }

  /**
   * 创建订单
   */
  @action
  createOrder = async () => {
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
        this.orderInfo = get(createRes, 'data', {});
        this.step = STEP_MAP.PAYWAY;
        return createRes;
      }
      this.resErrorFactory(createRes);
    } catch (error) {
      if (error.Code) {
        throw error;
      }
      throw {
        ...PAY_BOX_ERROR_CODE_MAP.NETWORK_ERROR,
        error,
      };
    }
  };

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
      if (error.Code) {
        throw error;
      }
      throw {
        ...PAY_BOX_ERROR_CODE_MAP.NETWORK_ERROR,
        error,
      };
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
          payPassword: this.password,
        },
      });

      this.resErrorFactory(payRes);

      // 支付成功
      if (get(payRes, 'data.walletPayResult.result') === 'success') {
        this.successCallback();
        this.completedCallback();
        return payRes;
      }
    } catch (error) {
      if (error.Code) {
        throw error;
      }
      throw {
        ...PAY_BOX_ERROR_CODE_MAP.NETWORK_ERROR,
        error,
      };
    }
  };

  /**
   * 微信支付订单
   * 后端实现分别位于 h5-backend 和 miniprogram-backend
   */
  @action
  wechatPayOrder = async ({
    listenWXJsBridgeAndExecCallback,
    onBridgeReady,
    wxValidator = noop,
    mode,
  }) => {
    try {
      wxValidator();
      const payRes = await createPayOrder({
        data: {
          orderSn: this.orderSn,
          paymentType: mode,
        },
      });

      this.resErrorFactory(payRes);

      if (payRes.code === 0) {
        // 清空之前的定时器
        clearInterval(this.timer);

        if (mode === PAY_MENT_MAP.WX_H5) {
          console.log(payRes);
          return;
        }
        listenWXJsBridgeAndExecCallback(() => {
          onBridgeReady(get(payRes, 'data.wechatPayResult.wechatJs'));
          this.timer = setInterval(() => {
            this.getOrderDetail();
          }, 3000);
        });
      }
    } catch (error) {
      if (error.Code) {
        throw error;
      }
      throw {
        ...PAY_BOX_ERROR_CODE_MAP.NETWORK_ERROR,
        error,
      };
    }
  };

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

      this.resErrorFactory(payRes);

      this.wechatQRCode = get(payRes, 'data.wechatPayResult.wechatQrcode');

      // 每次进来清空上次的 timer
      this.qrCodeTimeout = false;

      // 清空之前的定时器
      clearInterval(this.timer);

      // 二维码有过期时间
      this.checkQrCodeTimeout();

      this.timer = setInterval(async () => {
        await this.getOrderDetail();
      }, 3000);
    } catch (error) {
      if (error.Code) {
        throw error;
      }
      throw {
        ...PAY_BOX_ERROR_CODE_MAP.NETWORK_ERROR,
        error,
      };
    }
  };

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
        clearTimeout(this.qrCodeCheckTimer);
        this.qrCodeTimeout = true;
        // success
        this.successCallback();
        this.completedCallback();
      }

      if (orderStatus === ORDER_STATUS_MAP.OUT_DATE_PAY) {
        clearTimeout(this.qrCodeCheckTimer);
        this.qrCodeTimeout = true;
        // outdate
        this.failedCallback();
        this.completedCallback();
      }

      if (orderStatus === ORDER_STATUS_MAP.FAIL_PAY) {
        clearTimeout(this.qrCodeCheckTimer);
        this.qrCodeTimeout = true;
        // paid failed
        this.failedCallback();
        this.completedCallback();
      }
    } catch (error) {
      if (error.Code) {
        throw error;
      }
      throw {
        ...PAY_BOX_ERROR_CODE_MAP.NETWORK_ERROR,
        error,
      };
    }
  }

  /**
   * 设置支付密码
   */
  @action
  setPayPassword = async (id) => {
    try {
      const setPayPwdRes = await updateUsersUpdate({
        data: {
          id,
          data: {
            payPassword: this.password,
            payPasswordConfirmation: this.password,
          },
        },
      });

      this.resErrorFactory(setPayPwdRes);
    } catch (error) {
      if (error.Code) {
        throw error;
      }
      throw {
        ...PAY_BOX_ERROR_CODE_MAP.NETWORK_ERROR,
        error,
      };
    }
  }

  /**
   * 清空所有状态
   */
  @action
  clear = () => {
    clearInterval(this.timer);
    clearTimeout(this.qrCodeCheckTimer);
    this.options = {};
    this.visible = false;
    this.orderInfo = null;
    this.timer = null;
    this.qrCodeCheckTimer = null;
    this.step = STEP_MAP.SURE;
    this.payWay = null;
    this.payResult = null;
    this.password = null;
    this.walletInfo = null;
    this.wechatQRCode = null;
  }
}

export default PayBoxStore;
