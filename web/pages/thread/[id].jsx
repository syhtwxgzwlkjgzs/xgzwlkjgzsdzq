import React from 'react';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';
import { readThreadDetail } from '@server';
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
        },
      };
    }
    // 获取分类数据
    const res = await readThreadDetail({ params: { pid: id } });
    return {
      props: {
        serverThread: res.data,
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
    if (!this.props.serverThread && id) {
      const res = await readThreadDetail({ params: { pid: Number(id) } });
      this.props.thread.setThreadData(res.data);
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
