import { observable, action } from 'mobx';
import { genH5Qrcode } from '@server';

export default class H5Qrcode {
  @observable qrCode = '';

  @action
  async generate(opts) {
    try {
      const res = await genH5Qrcode({
        timeout: 3000,
        url: 'https://discuzv3-dev.dnspod.dev/apiv3/users/pc/wechat/h5.genqrcode',
        ...opts,
      });
      if (res.code === 0) {
        this.qrCode = res.data.base64Img;
        return;
      }
      throw {
        Code: res.code,
        Message: res.msg,
      };
    } catch (error) {
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
}
