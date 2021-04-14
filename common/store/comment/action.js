import { action } from 'mobx';
import CommentStore from './store';

class CommentAction extends CommentStore {
  constructor(props) {
    super(props);
  }

  @action
  setCommentDetail(data) {
    this.commentDetail = data;
  }

  @action
  setReplyList(list = []) {
    this.replyList = list;
  }
}

export default CommentAction;
