import { observable } from 'mobx';

class CommentStore {
  constructor(props) {
    this.commentDetail = props?.comment;
  }
  @observable commentDetail = {}; // 评论信息
  @observable replyList = []; // 回复列表
}

export default CommentStore;
