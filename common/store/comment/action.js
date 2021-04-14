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
  setReplyList(data) {
    this.replyList = data;
  }
}

export default CommentAction;
