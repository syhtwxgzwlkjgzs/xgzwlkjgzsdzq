import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/my/collect/h5';
import IndexPCPage from '@layout/my/collect/pc';
import { readThreadList } from '@server';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import isServer from '@common/utils/is-server';

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
    this.state = {
      firstLoading: true, // 首次加载状态判断
    }
    if (serverIndex && serverIndex.threads) {
      index.setThreads(serverIndex.threads);
      this.state.firstLoading = false;
    } else {
      index.setThreads(null);
    }
  }

  async componentDidMount() {
    const { index } = this.props;
    const hasThreadsData = !!index.threads;
    if (!hasThreadsData) {
     await this.props.index.getReadThreadList({
        perPage: this.prePage,
        page: this.page,
        filter: {
          complex: 3,
        },
      });
      this.setState({
        firstLoading: false
      })
    }
    this.listenRouterChangeAndClean();
  }

  clearStoreThreads = () => {
    const { index } = this.props;
    index.setThreads(null);
  }

  listenRouterChangeAndClean() {
    // FIXME: 此种写法不好
    if (!isServer()) {
      window.addEventListener('popstate', this.clearStoreThreads, false);
    }
  }

  componentWillUnmount() {
    this.clearStoreThreads();
    if (!isServer()) {
      window.removeEventListener('popstate', this.clearStoreThreads);
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
    const { firstLoading } = this.state;

    if (platform === 'pc') {
      return <IndexPCPage firstLoading={firstLoading} dispatch={this.dispatch} />;
    }

    return <IndexH5Page firstLoading={firstLoading} dispatch={this.dispatch} />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
