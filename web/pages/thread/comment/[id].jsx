import React from 'react';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';
import { readThreadDetail } from '@server';
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
    const res = await readThreadDetail({ params: { pid: id } });
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
    const { id } = this.props.router.query;
    if (!this.props.serverData && id) {
      const res = await readThreadDetail({ params: { pid: Number(id) } });
      this.props.comment.setCommentDetail(res.data);
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
