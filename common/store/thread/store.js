import { observable } from 'mobx';

class ThreadStore {
  constructor(props) {
    this.threadData = props?.thread;
  }
  @observable threadData = {}; // 帖子信息
  @observable commentList = []; // 评论列表
}

export default ThreadStore;
