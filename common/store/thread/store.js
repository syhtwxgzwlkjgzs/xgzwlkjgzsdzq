import { observable, computed } from 'mobx';

class ThreadStore {
  constructor(props) {
    this.threadData = props?.thread;
  }
  @observable threadData = null; // 帖子信息
  @observable commentListData = null; // 评论列表数据

  // 是否帖子数据准备好
  @computed get isReady() {
    return !!this.threadData?.id;
  }

  // 是否评论数据准备好
  @computed get isCommentReady() {
    return !!this.commentListData?.pageData;
  }

  // 是否收藏
  @computed get isFavorite() {
    return !!this.threadData?.isFavorite;
  }

  // 评论列表
  @computed get commentList() {
    return this.commentListData?.pageData || [];
  }

  // 评论总数
  @computed get totalPage() {
    return this.commentListData?.totalPage || 0;
  }
}

export default ThreadStore;
