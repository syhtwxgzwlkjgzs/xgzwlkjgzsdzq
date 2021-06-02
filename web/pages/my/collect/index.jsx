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
        totalPage: threads && threads.code === 0 ? threads.data.totalPage : null,
        totalCount: threads && threads.code === 0 ? threads.data.totalCount : null,
      },
    };
  }

  constructor(props) {
    super(props);
    const { serverIndex, index } = this.props;
    this.state = {
      firstLoading: true, // 首次加载状态判断
      totalCount: 0,
      page: 1,
    };
    if (serverIndex && serverIndex.threads) {
      index.setThreads(serverIndex.threads);
      this.state.page = 2;
      this.state.totalPage = serverIndex.totalPage;
      this.state.totalCount = serverIndex.totalCount;
      this.state.firstLoading = false;
    } else {
      index.setThreads(null);
    }
  }

  async componentDidMount() {
    const { index } = this.props;
    const hasThreadsData = !!index.threads;
    if (!hasThreadsData) {
      const threadsResp = await this.props.index.getReadThreadList({
        perPage: 10,
        page: this.state.page,
        filter: {
          complex: 3,
        },
      });

      this.setState({
        totalCount: threadsResp.totalCount,
        totalPage: threadsResp.totalPage,
      });

      if (this.state.page <= threadsResp.totalPage) {
        this.setState({
          page: this.state.page + 1,
        });
      }

      this.setState({
        firstLoading: false,
      });
    }
    this.listenRouterChangeAndClean();
  }

  clearStoreThreads = () => {
    const { index } = this.props;
    index.setThreads(null);
  };

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
    const threadsResp = await index.getReadThreadList({
      perPage: 10,
      page: this.state.page,
      filter: {
        complex: 3,
      },
    });

    if (this.state.page <= threadsResp.totalPage) {
      this.setState({
        page: this.state.page + 1,
      });
    }

    return
  };

  render() {
    const { site } = this.props;
    const { platform } = site;
    const { firstLoading } = this.state;

    if (platform === 'pc') {
      return (
        <IndexPCPage
          page={this.state.page}
          totalPage={this.state.totalPage}
          totalCount={this.state.totalCount}
          firstLoading={firstLoading}
          dispatch={this.dispatch}
        />
      );
    }

    return (
      <IndexH5Page
        firstLoading={firstLoading}
        page={this.state.page}
        totalPage={this.state.totalPage}
        totalCount={this.state.totalCount}
        dispatch={this.dispatch}
      />
    );
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
