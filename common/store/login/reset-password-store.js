import { observable, action, computed } from 'mobx';
import { smsVerify, smsSend } from '@server';
import { get } from '../../utils/get';

export const RESET_PASSWORD_STORE_ERRORS = {
    NETWORK_ERROR: {
        Code: 'rps_9999',
        Message: '网络错误'
    },
    MOBILE_VERIFY_ERROR: {
        Code: 'rps_0002',
        Message: '请填写正确的手机号'
    },
    VERIFY_TIME_ERROR: {
        Code: 'rps_0001',
        Message: '请等待倒计时结束后再发送短信'
    },
    NO_MOBILE_ERROR: {
        Code: 'rps_0000',
        Message: '请填写手机号',
    },
    NO_VERIFY_CODE: {
        Code: 'rps_0003',
        Message: '验证码缺失'
    }
}

export default class resetPasswordStore {
    codeTimmer = null;

    @observable username = '';
    @observable mobile = '';
    @observable code = '';

    @observable newPassword = '';
    @observable newPasswordRepeat = '';
    @observable codeTimeout = null;
    
    verifyMobile = () => {
        const MOBILE_REGEXP = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
        return MOBILE_REGEXP.test(this.mobile)
    }

    beforeSendVerify = () => {
        // 倒计时未结束前，不能再次发送
        if (this.codeTimeout) {
            throw RESET_PASSWORD_STORE_ERRORS.VERIFY_TIME_ERROR;
        }

        // 信息需要填写完整
        if (!this.mobile) {
            throw RESET_PASSWORD_STORE_ERRORS.NO_MOBILE_ERROR;
        }

        // 检验手机号是否合法
        if (!this.verifyMobile()) {
            throw RESET_PASSWORD_STORE_ERRORS.MOBILE_VERIFY_ERROR;
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
        }
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
                    type: 'reset_pwd',
                },
            });
            if (smsResp.code === 0) {
                this.setCounter(smsResp.data.interval)
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
                ...RESET_PASSWORD_STORE_ERRORS.NETWORK_ERROR,
                error,
            };
        }

    }

    @action
    verifyUser = async () => {
        if (!this.username) {
            throw {

            }
        }
        try {
            const verifyResp = await smsVerify({
                timeout: 3000,
                data: {
                    mobile: this.mobile,
                    code: this.code
                }
            })
            if (verifyResp.code === 0) {
                return get(verifyResp, 'data.username', '') === this.username;
            }
            throw {
                Code: verifyResp.code,
                Message: verifyResp.msg,
            };
        } catch (error) {
            if (error.Code) {
                throw error;
            }
            throw {
                ...RESET_PASSWORD_STORE_ERRORS.NETWORK_ERROR,
                error
            }
        }
    }
}