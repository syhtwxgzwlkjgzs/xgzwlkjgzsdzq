import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/my/collect/h5';
import IndexPCPage from '@layout/my/collect/pc';
import { readThreadList } from '@server';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
@inject('index')
@observer
class Index extends React.Component {
  page = 1;
  prePage = 10;
  static async getInitialProps(ctx) {
    const threads = await readThreadList(
      {
        params: {
          filter: {
            complex: 3,
          },
          perPage: 10,
        },
      },
      ctx,
    );
    return {
      serverIndex: {
        threads: threads && threads.code === 0 ? threads.data : null,
      },
    };
  }

  constructor(props) {
    super(props);
    const { serverIndex, index } = this.props;
    if (serverIndex && serverIndex.threads) {
      index.setThreads(serverIndex.threads);
    } else {
      index.setThreads(null);
    }
  }

  componentDidMount() {
    const { index } = this.props;
    const hasThreadsData = !!index.threads;
    if (!hasThreadsData) {
      this.props.index.getReadThreadList({
        perPage: this.prePage,
        page: this.page,
        filter: {
          complex: 3,
        },
      });
    }
  }

  dispatch = async () => {
    const { index } = this.props;
    await index.getReadThreadList({
      perPage: this.prePage,
      page: this.page,
      filter: {
        complex: 3,
      },
    });
  };

  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <IndexPCPage dispatch={this.dispatch} />;
    }

    return <IndexH5Page dispatch={this.dispatch} />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
