import { observable, action } from 'mobx';
import { setNickname } from '@server';

export const NICKNAME_BIND_STORE_ERRORS = {
  NO_NICKNAME_ERROR: {
    Code: 'nnb_0000',
    Message: '请填写昵称',
  },
  NETWORK_ERROR: {
    Code: 'nnb_9999',
    Message: '网络错误',
  },
};

export default class nicknameBindStore {
  @observable nickname = '';

  @action
  bindNickname = async () => {
    if (!this.nickname) {
      throw NICKNAME_BIND_STORE_ERRORS.NO_NICKNAME_ERROR;
    }

    try {
      const setResp = await setNickname({
        timeout: 3000,
        data: {
          nickname: this.nickname,
        },
      });
      // TODO: 中间状态处理? 需要确认返回接口信息，是否包含登录态?
      if (setResp.code === 0) {
        return setResp.data;
      }
      throw {
        Code: setResp.code,
        Message: setResp.msg,
      };
    } catch (error) {
      if (error.Code) {
        throw error;
      }
      throw {
        ...NICKNAME_BIND_STORE_ERRORS.NETWORK_ERROR,
        error,
      };
    }
  }
}
