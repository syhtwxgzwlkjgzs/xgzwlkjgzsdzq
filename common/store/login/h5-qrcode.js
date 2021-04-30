import { observable, action } from 'mobx';
import { genH5Qrcode, h5QrcodeLogin, genMiniQrcode } from '@server';
import setAccessToken from '../../utils/set-access-token';
import { get } from '../../utils/get';
import { checkUserStatus } from '@common/store/login/util';

export default class H5Qrcode {
  @observable qrCode = '';
  @observable sessionToken = '';

  @action
  async generate(opts) {
    try {
      const { type } = opts.params;
      const req = (type.indexOf('mini') > -1) ? genMiniQrcode : genH5Qrcode;
      const res = await req({
        timeout: 3000,
        ...opts,
      });
      if (res.code === 0) {
        this.qrCode = res.data.base64Img;
        this.sessionToken = res.data.sessionToken;
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
  @action
  async login(opts) {
    try {
      const res = await h5QrcodeLogin({
        timeout: 3000,
        ...opts,
      });
      checkUserStatus(res);
      if (res.code === 0) {
        const accessToken = get(res, 'data.accessToken', '');
        setAccessToken(accessToken);
        return ;
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
