import { observable, action, computed } from 'mobx';
import { smsSend, smsLogin } from '@server';
import { get } from '../../utils/get';
import setAccessToken from '../../utils/set-access-token';

export const MOBILE_LOGIN_STORE_ERRORS = {
  MOBILE_VERIFY_ERROR: {
    Code: 'mbl_0002',
    Message: '请填写正确的手机号',
  },
  VERIFY_TIME_ERROR: {
    Code: 'mbl_0001',
    Message: '请等待倒计时结束后再发送短信',
  },
  NO_MOBILE_ERROR: {
    Code: 'mbl_0000',
    Message: '请填写手机号',
  },
  NETWORK_ERROR: {
    Code: 'mbl_9999',
    Message: '网络错误',
  },
  NO_VERIFY_CODE: {
    Code: 'mbl_0003',
    Message: '验证码缺失',
  },
  NEET_BIND_USERNAME: {
    Code: 'mbl_0004',
    Message: '需要补充昵称',
  },
};

export default class mobileLoginStore {
    codeTimmer = null;

    @observable mobile = '';
    @observable code = '';
    @observable codeTimeout = null;

    // 验证码是否符合格式要求
    @computed get isInvalidCode() {
      return this.code.length === 6;
    }

    // 是否信息填写完毕
    @computed get isInfoComplete() {
      return this.code && this.mobile;
    }

    verifyMobile = () => {
      const MOBILE_REGEXP = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      return MOBILE_REGEXP.test(this.mobile);
    }

    beforeSendVerify = () => {
      // 倒计时未结束前，不能再次发送
      if (this.codeTimeout) {
        throw MOBILE_LOGIN_STORE_ERRORS.VERIFY_TIME_ERROR;
      }

      // 信息需要填写完整
      if (!this.mobile) {
        throw MOBILE_LOGIN_STORE_ERRORS.NO_MOBILE_ERROR;
      }

      // 检验手机号是否合法
      if (!this.verifyMobile()) {
        throw MOBILE_LOGIN_STORE_ERRORS.MOBILE_VERIFY_ERROR;
      }
    }

    // 倒计时
    setCounter = (sec) => {
      this.codeTimeout = sec;
      // 总定时器，到时间清除 counter
      this.codeTimmer = setTimeout(() => {
        this.codeTimeout = null;
        this.codeTimmer = null;
      }, Number(this.codeTimeout) * 1000);
      // 每秒 -1
      const counter = () => {
        if (this.codeTimeout) {
          this.codeTimeout = this.codeTimeout - 1;
          setTimeout(() => {
            counter();
          }, 1000);
        }
      };
      setTimeout(() => counter(), 1000);
    }

    @action
    sendCode = async () => {
      // 发送前校验
      this.beforeSendVerify();

      try {
        const smsResp = await smsSend({
          timeout: 3000,
          data: {
            mobile: this.mobile,
            type: 'login',
          },
        });
        if (smsResp.code === 0) {
          this.setCounter(smsResp.data.interval);
          return smsResp.data;
        }
        throw {
          Code: smsResp.code,
          Message: smsResp.msg,
        };
      } catch (error) {
        if (error.Code) {
          throw error;
        }
        throw {
          ...MOBILE_LOGIN_STORE_ERRORS.NETWORK_ERROR,
          error,
        };
      }
    }

    beforeLoginVerify = () => {
      if (!this.mobile) {
        throw MOBILE_LOGIN_STORE_ERRORS.NO_MOBILE_ERROR;
      }

      if (!this.code) {
        throw MOBILE_LOGIN_STORE_ERRORS.NO_VERIFY_CODE;
      }
    }

    @action
    login = async () => {
      this.beforeLoginVerify();

      try {
        const smsLoginResp = await smsLogin({
          timeout: 3000,
          data: {
            mobile: this.mobile,
            code: this.code,
          },
        });
        if (smsLoginResp.code === 0) {
          const accessToken = get(smsLoginResp, 'data.accessToken', '');
          // 种下 access_token
          setAccessToken({
            accessToken,
          });

          // 如果没有填写昵称，抛出需要填写昵称的状态码
          if (get(smsLoginResp, 'isMissRequireInfo', false)) {
            throw MOBILE_LOGIN_STORE_ERRORS.NEET_BIND_USERNAME;
          }

          return smsLoginResp.data;
        }
        throw {
          Code: smsLoginResp.code,
          Message: smsLoginResp.msg,
        };
      } catch (error) {
        if (error.Code) {
          throw error;
        }
        throw {
          ...MOBILE_LOGIN_STORE_ERRORS.NETWORK_ERROR,
          error,
        };
      }
    }
}
