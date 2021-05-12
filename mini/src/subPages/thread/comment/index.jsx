import React from 'react';
import { inject } from 'mobx-react';
import { readCommentDetail } from '@server';
import { getCurrentInstance } from '@tarojs/taro';
import CommentMiniPage from '../../../layout/thread/comment/index';

@inject('site')
@inject('comment')
class CommentDetail extends React.Component {
  static async getInitialProps(ctx) {
    const id = ctx?.query?.id;
    if (!id) {
      return {
        props: {
          serverData: null,
        },
      };
    }
    // 获取评论数据
    const res = await readCommentDetail({ params: { pid: id } });
    return {
      props: {
        serverData: res.data,
      },
    };
  }

  constructor(props) {
    super(props);
    const { serverData, comment } = this.props;

    // 初始化数据到store中
    serverData && comment.setCommentDetail(serverData);
  }

  async componentDidMount() {
    // const { id, threadId } = this.props.router.query;
    const { id, threadId } = getCurrentInstance().router.params;

    if (threadId) {
      this.props.comment.setThreadId(threadId);
    }

    if (!this.props.serverData && id) {
      const res = await readCommentDetail({ params: { pid: Number(id) } });
      this.props.comment.setCommentDetail(res.data);
    }
  }

  render() {
    return <CommentMiniPage></CommentMiniPage>
  }
}

// eslint-disable-next-line new-cap
export default CommentDetail;
