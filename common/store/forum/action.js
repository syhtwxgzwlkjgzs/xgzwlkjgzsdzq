import { action } from 'mobx';
import * as server from '@server';
import ForumStore from './store';
import { get } from '../../utils/get';

class ForumAction extends ForumStore {
  constructor(props) {
    super(props);
  }

  /**
   * 使用请求（简单处理报错）
   * @param {*} type 请求方法名
   * @param {*} params 参数
   */
  @action
  async useRequest (type = '', params = {}) {
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

  @action
  setIsPopup(is) {
    this.isPopup = is;
  }

  @action
  setIsLoading(is) {
    this.isLoading = is;
  }

  @action
  setUsersPageData(res) {
    const data = get(res, 'pageData', []);
    const total = get(res, 'totalCount', 0);
    this.usersPageData = data;
    this.userTotal = total;
  }

  @action
  setThreadsPageData(res) {
    const data = get(res, 'pageData', []);
    const time = get(data[0], 'createdAt', null);
    const total = get(res, 'totalCount', 0);
    this.threadsPageData = data;
    this.threadTotal = total;
    this.updataTime = time;
  }
}

export default ForumAction;
