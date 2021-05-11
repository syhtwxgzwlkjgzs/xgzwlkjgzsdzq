import { action } from 'mobx';
import MessageStore from './store';
import { readDialogList, readMsgList } from '@server';

class MessageAction extends MessageStore {
  // 设置消息分页的每页条数
  perPage = {
    perPage: 20,
  };
  // 组装获取消息列表的入参
  assemblyParams(page, types) {
    return {
      params: {
        ...this.perPage,
        page,
        filter: {
          type: types,
        },
      },
    };
  }
  // 设置消息列表数据
  @action
  setMsgList(page, key, ret) {
    const { code, data = [] } = ret;
    if (code === 0) {
      const list = data.pageData || [];
      if (page === 1) {
        // 刷新
        this[key] = list;
      } else {
        // 加载下一页
        this[key] = this[key].concat(list);
      }
    }
  }
  // 获取账号消息
  @action.bound
  async readAccountMsgList(page = 1) {
    const ret = await readMsgList(this.assemblyParams(page, 'related,replied,liked'));
    this.setMsgList(page, 'accountMsgList', ret);
  }
  // 获取@我的消息
  @action.bound
  async readAtMsgList(page = 1) {
    const ret = await readMsgList(this.assemblyParams(page, 'related'));
    this.setMsgList(page, 'atMsgList', ret);
  }
  // 获取回复我的消息
  @action.bound
  async readReplyMsgList(page = 1) {
    const ret = await readMsgList(this.assemblyParams(page, 'replied'));
    this.setMsgList(page, 'replyMsgList', ret);
  }
  // 获取点赞我的消息
  @action.bound
  async readLikeMsgList(page = 1) {
    const ret = await readMsgList(this.assemblyParams(page, 'liked'));
    this.setMsgList(page, 'likeMsgList', ret);
  }
  // 获取对话列表
  @action.bound
  async readDialogList(page = 1) {
    const ret = await readDialogList({
      params: {
        ...this.perPage,
        page,
      },
    });
    this.setMsgList(page, 'dialogList', ret);
  }
}

export default MessageAction;
