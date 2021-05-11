import { action } from 'mobx';
import MessageStore from './store';
import { readDialogList, readMsgList, createDialog, deleteMsg, deleteDialog } from '@server';

class MessageAction extends MessageStore {
  // 设置消息分页的每页条数
  perPage = {
    perPage: 5,
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
  setMsgList(currentPage, key, ret) {
    const { code, data = {} } = ret;
    if (code === 0) {
      const { pageData: list = [] } = data;
      const listData = (({ totalPage = 0, totalCount = 0 }) => ({ list, totalPage, totalCount, currentPage }))(data);
      if (currentPage === 1) {
        // 刷新
        this[key] = listData;
      } else {
        // 加载下一页
        this[key] = {
          ...listData,
          list: this[key].list.concat(list),
        };
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

  // 创建新的私信对话
  @action.bound
  async createDialog(params) {
    const ret = await createDialog(params);
    console.log('创建新的私信对话', ret);
  }

  // 删除私信对话
  @action.bound
  async deleteDialog(id) {
    const ret = await deleteDialog({ id });
    const { code } = ret;
    if (code === 0) this.deleteListItem('dialogList', id);
  }

  // 删除消息
  @action.bound
  async deleteMsg(id, storeKey) {
    const ret = await deleteMsg({ id });
    const { code } = ret;
    if (code === 0) this.deleteListItem(storeKey, id);
  }

  deleteListItem(key, id) {
    const data = this[key];
    const list = [].concat(data.list)
    try {
      list.forEach((item, index) => {
        if (item.id === id) {
          list.splice(index, 1);
          this[key] = {
            ...data,
            list
          }
          throw 'break';
        }
      });
    } catch (e) {}
  }
}

export default MessageAction;
