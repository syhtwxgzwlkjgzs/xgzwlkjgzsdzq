import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/my/like/h5';
import IndexPCPage from '@layout/my/like/pc';
import { readThreadList, readTopicsList } from '@server';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
@inject('index')
@inject('search')
@observer
class Index extends React.Component {
  page = 1;
  prePage = 10;
  static async getInitialProps(ctx) {
    const result = await readTopicsList();
    const threads = await readThreadList({ params: { filter: {}, sequence: 0, perPage: 10} }, ctx);
    return {
      serverIndex: {
        threads: threads && threads.code === 0 ? threads.data : null,
      },
      serverSearch: {
        topics: result?.data
      },
    };
  }

  constructor(props) {
    super(props);
    const { serverIndex, index, serverSearch, search } = this.props;
    serverIndex && serverIndex.threads && index.setThreads(serverIndex.threads);
    serverSearch && serverSearch.topics && search.setTopics(serverSearch.topics);
  }

  componentDidMount() {
    const { index, search } = this.props;
    const hasThreadsData = !!index.threads;
    const hasTopics = !!search.topics;
    this.page = 1;
    if (!hasThreadsData) {
      this.props.index.getReadThreadList();
    }
    if(!hasTopics){
      search.getTopicsList();
    }
  }
  dispatch = async (type, data = {}) => {
    const { index } = this.props;
    if (type === 'refresh') {
      this.page = 1;
    } else if (type === 'moreData') {
      this.page += 1;
    }
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
