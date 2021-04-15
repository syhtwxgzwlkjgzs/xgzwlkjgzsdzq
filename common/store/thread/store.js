import { observable, computed } from 'mobx';

class ThreadStore {
  constructor(props) {
    this.threadData = props?.thread;
  }
  @observable threadData = {}; // 帖子信息
  @observable commentList = []; // 评论列表


  @computed get isFavorite() {
    return !!this.threadData?.isFavorite;
  }
}

export default ThreadStore;
