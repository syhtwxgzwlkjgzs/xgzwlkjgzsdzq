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

    if (!id) {
      return {
        props: {
          serverThread: null,
          commentList: null,
        },
      };
    }
    // 获取分类数据
    const res = await readThreadDetail({ params: { threadId: Number(id) } });

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

    return {
      props: {
        serverThread: res.data,
        commentList: commentRes.data || [],
      },
    };
  }

  constructor(props) {
    super(props);
    const { serverThread, thread } = this.props;

    // 初始化数据到store中
    serverThread && thread.setThreadData(serverThread);
  }

  async componentDidMount() {
    const { id } = this.props.router.query;

    // 判断缓存
    const oldId = `${this.props?.thread?.threadData?.threadId}`;
    if (id === oldId) {
      return;
    }
    this.props.thread.reset();


    if (!this.props.serverThread && id) {
      const res = await readThreadDetail({ params: { threadId: Number(id) } });
      if (res.code === 0) {
        this.props.thread.setThreadData(res.data);
      }

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
        this.props.thread.setCommentList(commentRes.data?.pageData);
        this.props.thread.setTotalCount(commentRes.data?.totalCount);
      }
    }
  }

  render() {
    const { site } = this.props;
    const { platform } = site;
    console.log(platform);
    return platform === 'h5' ? <ThreadH5Page /> : <ThreadPCPage />;
  }
}

// eslint-disable-next-line new-cap
export default withRouter(HOCFetchSiteData(Detail));
