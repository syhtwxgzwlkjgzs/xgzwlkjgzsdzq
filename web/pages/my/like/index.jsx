import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/my/like/h5';
import IndexPCPage from '@layout/my/like/pc';
import { readThreadList, readTopicsList } from '@server';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import isServer from '@common/utils/is-server';

@inject('site')
@inject('index')
@inject('search')
@observer
class Index extends React.Component {
  page = 1;
  prePage = 10;
  static async getInitialProps(ctx) {
    const result = await readTopicsList();
    const threads = await readThreadList(
      {
        params: {
          filter: {
            complex: 2,
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
      serverSearch: {
        topics: result?.data,
      },
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      firstLoading: true, // 首次加载状态判断
    };
    const { serverIndex, index, serverSearch, search } = this.props;
    if (serverIndex && serverIndex.threads) {
      index.setThreads(serverIndex.threads);
      this.state.firstLoading = false;
    } else {
      index.setThreads(null);
    }
    serverSearch && serverSearch.topics && search.setTopics(serverSearch.topics);
  }

  async componentDidMount() {
    const { index, search } = this.props;
    const hasThreadsData = !!index.threads;
    const hasTopics = !!search.topics;
    this.page = 1;
    if (!hasThreadsData) {
      await this.props.index.getReadThreadList({
        filter: {
          complex: 2,
        },
        perPage: 10,
      });
    }
    this.setState({
      firstLoading: false,
    });
    if (!hasTopics) {
      search.getTopicsList();
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
    this.page += 1;
    await index.getReadThreadList({
      perPage: this.prePage,
      page: this.page,
      filter: {
        complex: 2,
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
