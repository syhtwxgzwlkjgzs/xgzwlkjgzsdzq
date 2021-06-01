import React from 'react';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';
import { readThreadDetail, readCommentList } from '@server';
import ThreadH5Page from '@layout/thread/h5';
import ThreadPCPage from '@layout/thread/pc';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import Router from '@discuzq/sdk/dist/router';
import ErrorPCPage from '@layout/error/pc';
import ErrorH5Page from '@layout/error/h5';

@inject('site')
@inject('thread')
@inject('user')
class Detail extends React.Component {
  static async getInitialProps(ctx) {
    const id = ctx?.query?.id;
    const serverThread = {
      threadData: null,
      commentList: null,
      totalCount: 0,
      authorInfo: null,
    };

    if (id) {
      // 获取帖子详情
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
          sort: 'createdAt',
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

    this.state = {
      isServerError: false,
    };

    const { thread, serverThread } = this.props;

    // 初始化数据到store中
    serverThread?.threadData && thread.setThreadData(serverThread.threadData);
    // serverThread?.commentList && thread.setCommentList(serverThread.commentList);
    serverThread?.totalCount && thread.setTotalCount(serverThread.totalCount);
  }

  componentDidUpdate(prevProps) {
    if (this.props.router?.query?.id && this.props.router.query.id !== prevProps.router.query.id) {
      this.props.thread.reset();
      this.getPageDate(this.props.router.query.id);
    }
  }

  async componentDidMount() {
    const { id } = this.props.router.query;
    // 判断缓存
    const oldId = this.props?.thread?.threadData?.threadId;
    if (Number(id) === oldId && id && oldId) {
      return;
    }
    this.props.thread.reset();

    if (id) {
      this.getPageDate(id);
    }
  }

  async getPageDate(id) {
    if (!this.props?.thread?.threadData) {
      const res = await this.props.thread.fetchThreadDetail(id);

      if (res.code !== 0) {
        this.setState({
          isServerError: true,
        });
        return;
      }

      // 判断是否审核通过
      const isApproved = (this.props.thread?.threadData?.isApproved || 0) === 1;
      if (!isApproved) {
        const currentUserId = this.props.user?.userInfo?.id; // 当前登录用户
        const userId = this.props.thread?.threadData?.user?.userId; // 帖子作者
        // 不是作者自己。跳回首页
        if (!currentUserId || !userId || currentUserId !== userId) {
          Router.redirect({ url: '/' });
          return;
        }
      }
    }
    if (!this.props?.thread?.commentList) {
      const params = {
        id,
      };
      this.props.thread.loadCommentList(params);
    }
    // 获取作者信息
    if (!this.props?.thread?.authorInfo) {
      const { site } = this.props;
      const { platform } = site;
      const userId = this.props.thread?.threadData?.user?.userId;
      if (platform === 'pc' && userId) {
        this.props.thread.fetchAuthorInfo(userId);
      }
    }
  }

  render() {
    const { site } = this.props;
    const { platform } = site;

    if (this.state.isServerError) {
      return platform === 'h5' ? <ErrorH5Page /> : <ErrorPCPage />;
    }

    return platform === 'h5' ? <ThreadH5Page /> : <ThreadPCPage />;
  }
}

// eslint-disable-next-line new-cap
export default withRouter(HOCFetchSiteData(Detail));
