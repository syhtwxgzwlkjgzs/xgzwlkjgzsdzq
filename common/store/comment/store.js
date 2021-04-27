import { observable, computed } from 'mobx';

class CommentStore {
  constructor(props) {
    this.commentDetail = props?.comment;
  }
  @observable commentDetail = null; // 评论信息
  @observable threadId = null; // 评论信息
  @observable authorInfo = null; // 作者信息

  // 回复列表
  @computed get replyList() {
    return this.commentDetail?.commentPosts || [];
  }

  // 是否评论数据准备好
  @computed get isReady() {
    return !!this.commentDetail?.id;
  }
}

export default CommentStore;
