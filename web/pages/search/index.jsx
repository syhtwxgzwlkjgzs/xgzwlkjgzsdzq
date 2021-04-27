import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/h5';
import IndexPCPage from '@layout/search/pc';
import { readUsersList, readTopicsList, readThreadList } from '@server';
import { Toast } from '@discuzq/design';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  static async getInitialProps(ctx) {
    const topics = await readTopicsList({ params: { filter: { hot: 1 } }, perPage: 10 }, ctx);
    const users = await readUsersList({ params: { perPage: 10 } }, ctx);
    const threads = await readThreadList({ params: { filter: { sort: '3' }, perPage: 10 } }, ctx);

    return {
      serverSearch: {
        indexTopics: topics?.data,
        indexUsers: users?.data,
        indexThreads: threads?.data,
      },
    };
  }

  constructor(props) {
    super(props);
    const { serverSearch, search } = this.props;
    // 初始化数据到store中
    serverSearch && serverSearch.indexTopics && search.setIndexTopics(serverSearch.indexTopics);
    serverSearch && serverSearch.indexUsers && search.setIndexUsers(serverSearch.indexUsers);
    serverSearch && serverSearch.indexThreads && search.setIndexThreads(serverSearch.indexThreads);
  }

  async componentDidMount() {
    const { search } = this.props;
    // 当服务器无法获取数据时，触发浏览器渲染
    const hasIndexTopics = !!search.indexTopics;
    const hasIndexUsers = !!search.indexUsers;
    const hasIndexThreads = !!search.indexThreads;

    this.toastInstance = Toast.loading({
      content: '加载中...',
      duration: 0,
    });
    await search.getSearchData({ hasTopics: hasIndexTopics, hasUsers: hasIndexUsers, hasThreads: hasIndexThreads });
    this.toastInstance?.destroy();
  }

  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <IndexPCPage />;
    }

    return <IndexH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
