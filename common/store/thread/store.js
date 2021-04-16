import { observable, computed } from 'mobx';

class ThreadStore {
  constructor(props) {
    this.threadData = props?.thread;
  }
  @observable threadData = null; // 帖子信息
  @observable commentList = []; // 评论列表


  @computed get isFavorite() {
    return !!this.threadData?.isFavorite;
  }

  @computed get isReady() {
    return !!this.threadData?.id;
  }
}

export default ThreadStore;
