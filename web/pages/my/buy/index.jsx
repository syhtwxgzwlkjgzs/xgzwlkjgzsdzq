import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/my/buy/h5';
import IndexPCPage from '@layout/my/buy/pc';
import { readThreadList } from '@server';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
  page = 1;
  prePage = 10;
  static async getInitialProps(ctx) {
    const threads = await readThreadList({ params: { filter: {}, sequence: 0, perPage: 10, page: 1 } }, ctx);
    return {
      serverIndex: {
        threads: threads && threads.code === 0 ? threads.data : null,
      },
    };
  }

  constructor(props) {
    super(props);
    const { serverIndex, index } = this.props;
    serverIndex && serverIndex.threads && index.setThreads(serverIndex.threads);
  }

  componentDidMount() {
    const { index } = this.props;
    const hasThreadsData = !!index.threads;
    if (!hasThreadsData) {
      this.props.index.getReadThreadList();
    }
  }
  dispatch = async (type, data = {}) => {
    await index.getReadThreadList({
      perPage: this.prePage,
      page: this.page,
    });
  }

  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <IndexPCPage dispatch={this.dispatch}/>;
    }

    return <IndexH5Page dispatch={this.dispatch}/>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
