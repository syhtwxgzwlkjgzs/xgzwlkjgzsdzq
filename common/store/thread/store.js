import { observable, computed } from 'mobx';

class ThreadStore {
  constructor(props) {
    this.threadData = props?.thread;
  }
  @observable threadData = null; // 帖子信息
  @observable commentList = null; // 评论列表数据
  @observable totalPage = 0; // 评论列表总条数

  // 是否帖子数据准备好
  @computed get isReady() {
    return !!this.threadData?.id;
  }

  // 是否评论数据准备好
  @computed get isCommentReady() {
    return !!this.commentList;
  }

  // 是否收藏
  @computed get isFavorite() {
    return !!this.threadData?.isFavorite;
  }

  // 是否还有更多
  @computed get isNoMore() {
    return this.commentList?.length >= this.totalPage;
  }
}

export default ThreadStore;
