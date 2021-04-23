import { observable, computed, action } from 'mobx';
import { get } from '../../utils/get';
import { createOrders } from '@server';

class PayBoxStore {
    // 订单 options
    @observable options = {};

    // 窗口是否可见
    @observable visible = false;

    // 订单编号信息
    @observable orderSn = null;

    // 轮询 timer
    @observable timer = null;

    /**
     * 创建订单
     */
    @action
    createOrder = async () => {
      try {
        await createOrders({
          timeout: 3000,
          data: this.options,
        });
      } catch (error) {
        console.log(error);
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

    @action
    getOrderDetail = async () => {
      try {

      } catch (error) {
        console.log(error);
      }
    }
}

export default PayBoxStore;
