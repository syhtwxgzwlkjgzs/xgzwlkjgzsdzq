import { observable } from 'mobx';

class CommentStore {
  constructor(props) {
    this.commentDetail = props?.comment;
  }
  @observable commentDetail = null; // 评论信息
  @observable replyList = null; // 回复列表
}

export default CommentStore;
