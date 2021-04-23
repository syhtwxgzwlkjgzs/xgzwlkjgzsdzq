import { observable, computed, action } from 'mobx';
import { get } from '../../utils/get';
import { createOrders } from '@server';

const STEP_MAP = {
  SURE: 'sure', // 订单确认阶段
  PAYWAY: 'payway', // 选择支付方式阶段
  PAY: 'pay', // 付费阶段
  RESULT: 'result', // 付费完成后确认付费信息阶段
};

export const PAYWAY_MAP = {
  WX: 'weixin', // 微信支付
  WALLET: 'wallet', // 钱包支付
};

class PayBoxStore {
    // 订单 options
    @observable options = {};

    // 窗口是否可见
    @observable visible = false;

    // 订单编号信息
    @observable orderSn = null;

    // 轮询 timer
    @observable timer = null;

    // 当前所属的阶段
    @observable step = STEP_MAP.SURE;

    // 如果为 null，则代表没有选择支付方式
    @observable payWay = null;

    // 如果为 null，则代表支付还没完成
    @observable payResult = null;

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
          this.step = STEP_MAP.PAY;
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
     * 生成微信支付二维码
     */
    @action
    genWxPayQrCode = async () => {
      try {

      } catch (error) {
        console.error(error);
      }
    }

    /**
     * 钱包支付订单
     */
    @action
    walletPayOrder = async () => {
      try {

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

      } catch (error) {
        console.log(error);
      }
    }
}

export default PayBoxStore;
