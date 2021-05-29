import React from 'react';
import { inject } from 'mobx-react';
import { readCommentDetail } from '@server';
import { getCurrentInstance } from '@tarojs/taro';
import CommentMiniPage from '../../../layout/thread/comment/index';
import ErrorMiniPage from '../../../layout/error/index';

@inject('site')
@inject('comment')
class CommentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isServerError: false,
    };
  }

  async componentWillUnmount() {
    this.props.comment.reset();
  }

  async componentDidShow() {
    const { id, threadId } = getCurrentInstance().router.params;

    if (threadId) {
      this.props.comment.setThreadId(threadId);
    }

    if (id) {
      const res = await readCommentDetail({ params: { pid: Number(id) } });

      if (res.code !== 0) {
        this.setState({
          isServerError: true,
        });
        return;
      }

      this.props.comment.setCommentDetail(res.data);
    }
  }

  render() {
    return this.state.isServerError ? <ErrorMiniPage /> : <CommentMiniPage />;
  }
}

// eslint-disable-next-line new-cap
export default CommentDetail;
