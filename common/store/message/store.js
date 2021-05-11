import { observable, computed } from 'mobx';
import { get } from '../../utils/get';

class MessageStore {
  /**
   * 总的未读消息
   */
  @observable totalUnread = 0;

  /**
   * 帖子通知未读消息
   */
  @observable threadUnread = 0;

  /**
   * 财务通知未读消息
   */
  @observable financialUnread = 0;

  /**
   * 账号消息未读消息
   */
  @observable accountUnread = 0;

  /**
   * 私信对话列表
   */
  @observable dialogList = [];

  /**
   * 单个私信对话内的消息列表
   */
  @observable dialogMsgList = [];

  /**
   * 财务通知列表
   */
  @observable financialMsgList = [];

  /**
   * 账号消息列表
   */
  @observable accountMsgList = [];

  /**
   * at我的消息列表
   */
  @observable atMsgList = [];

  /**
   * 回复我的消息列表
   */
  @observable replyMsgList = [];

  /**
   * 点赞我的消息列表
   */
  @observable likeMsgList = [];

  /**
   * 帖子通知列表
   */
  @observable threadMsgList = [];
}

export default MessageStore;
