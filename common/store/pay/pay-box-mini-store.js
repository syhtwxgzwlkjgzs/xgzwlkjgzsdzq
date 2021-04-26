import PayBoxStore from './pay-box-store';
import { action } from 'mobx';
import throttle from '../../utils/thottle';
import Taro from '@tarojs/taro';
import { get } from '../../utils/get';
import { createPayOrder } from '@server';
import { PAY_MENT_MAP, PAY_BOX_ERROR_CODE_MAP } from '../../constants/payBoxStoreConstants';

const promiseRequestPayment = ({
  nonceStr,
  package: wxPackage,
  paySign,
  timeStamp,
}) => new Promise((resolve, reject) => {
  Taro.requestPayment({
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

class PayBoxMiniStore extends PayBoxStore {
  constructor(props) {
    super(props);
  }

    @action
    wechatMiniProgramPay = throttle(async () => {
      try {
        const payRes = await createPayOrder({
          data: {
            orderSn: this.orderSn,
            paymentType: PAY_MENT_MAP.WX_MINI_PROGRAM,
          },
        });

        this.resErrorFactory(payRes);

        // 拉起支付需要用到的一些加密数据
        const wechatJs = get(payRes, 'data.wechatPayResult.wechatJs', {});

        await promiseRequestPayment(wechatJs);

        // 拉起成功，开始轮询状态
        this.timer = setInterval(() => {
          this.getOrderDetail();
        }, 1000);
      } catch (error) {
        this.errorHandler(error);
      }
    });
}

export default PayBoxMiniStore;
