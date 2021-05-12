import { action } from 'mobx';
import InviteStore from './store';
import * as server from '@server';

class InviteAction extends InviteStore {
  constructor(props) {
    super(props);
  }

  /**
   * 使用请求（简单处理报错）
   * @param {*} type 请求方法名
   * @param {*} params 参数
   */
  @action
  async useRequest (type, params) {
    console.log(server);
    try {
      const res = await server[type](params);

      if (res.code === 0) {
        return res.data;
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

export default InviteAction;
