import React from 'react';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';
import { readCommentDetail } from '@server';
import CommentH5Page from '@layout/thread/comment/h5';
import CommentPCPage from '@layout/thread/comment/pc';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

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
    const { id, threadId } = this.props.router.query;

    // 判断缓存
    const oldId = this.props?.comment?.commentDetail?.id;
    if (Number(id) === oldId && id && oldId) {
      return;
    }
    this.props.comment.reset();

    if (threadId) {
      this.props.comment.setThreadId(threadId);
    }

    if (!this.props.serverData && id) {
      const res = await readCommentDetail({ params: { pid: Number(id) } });
      this.props.comment.setCommentDetail(res.data);

      // 获取作者信息
      const { site } = this.props;
      const { platform } = site;
      const userId = this.props.comment?.commentDetail?.userId;
      if (platform === 'pc' && userId) {
        this.props.comment.fetchAuthorInfo(userId);
      }
    }
  }

  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <CommentH5Page /> : <CommentPCPage />;
  }
}

// eslint-disable-next-line new-cap
export default withRouter(HOCFetchSiteData(CommentDetail));
