import React from 'react';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';
import { readThreadDetail, readCommentList } from '@server';
import ThreadH5Page from '@layout/thread/h5';
import ThreadPCPage from '@layout/thread/pc';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('thread')
class Detail extends React.Component {
  static async getInitialProps(ctx) {
    const id = ctx?.query?.id;
    const serverThread = {
      threadData: null,
      commentList: null,
      totalCount: 0,
    };

    if (id) {
      // 获取分类数据
      const res = await readThreadDetail({ params: { threadId: Number(id) } });
      if (res.code === 0) {
        serverThread.threadData = res.data;
      }

      // 获取评论列表
      const commentRes = await readCommentList({
        params: {
          filter: {
            thread: Number(id),
          },
          sort: '-createdAt',
          page: 1,
          perPage: 5,
        },
      });

      if (commentRes.code === 0) {
        serverThread.commentList = commentRes.data?.pageData || [];
        serverThread.totalCount = commentRes.data?.totalCount || 0;
      }
    }
    return {
      serverThread,
    };
  }

  constructor(props) {
    super(props);

    const { thread, serverThread } = this.props;

    // 初始化数据到store中
    // serverThread?.threadData && thread.setThreadData(serverThread.threadData);
    // serverThread?.commentList && thread.setCommentList(serverThread.commentList);
    // serverThread?.totalCount && thread.setTotalCount(serverThread.totalCount);
  }

  async componentDidMount() {
    const { id } = this.props.router.query;
    // 判断缓存
    const oldId = this.props?.thread?.threadData?.threadId;
    if (Number(id) === oldId && id && oldId) {
      return;
    }
    this.props.thread.reset();

    if (id && !this.props?.thread?.threadData?.threadId) {
      if (!this.props?.thread?.threadData) {
        this.props.thread.fetchThreadDetail(id);
      }
      if (!this.props?.thread?.commentList) {
        const params = {
          id,
        };
        this.props.thread.loadCommentList(params);
      }
    }
  }

  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <ThreadH5Page /> : <ThreadPCPage />;
  }
}

// eslint-disable-next-line new-cap
export default withRouter(HOCFetchSiteData(Detail));
