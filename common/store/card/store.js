import { observable } from 'mobx';


class ThreadStore {
  constructor(props) {
    this.threadData = props?.thread;
  }
  @observable threadData = null; // 帖子信息
}

export default ThreadStore;
