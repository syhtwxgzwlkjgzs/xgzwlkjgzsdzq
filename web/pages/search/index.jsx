import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/h5';
import IndexPCPage from '@layout/search/pc';
import { readUsersList, readTopicsList, readThreadList } from '@server';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import SearchAction from '../../../common/store/search/action';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  static async getInitialProps(ctx) {
    const topics = await readTopicsList({ params: { filter: { hot: 1 } } }, ctx);
    const users = await readUsersList({}, ctx);
    const threads = await readThreadList({ params: { filter: { sort: '3' } } }, ctx);

    return {
      serverSearch: {
        indexTopics: topics && topics.code === 0 ? topics.data : { pageData: [] },
        indexUsers: users && users.code === 0 ? users.data : { pageData: [] },
        indexThreads: threads && threads.code === 0 ? threads.data : { pageData: [] },
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
    const { search, serverSearch } = this.props;
    // 当服务器无法获取数据时，触发浏览器渲染
    const isBool1 = !search.indexTopics && (!serverSearch || !serverSearch.indexTopics);
    const isBool2 = !search.indexUsers && (!serverSearch || !serverSearch.indexUsers);
    const isBool3 = !search.indexThreads && (!serverSearch || !serverSearch.indexThreads);

    if (!isBool1 && !isBool2 && !isBool3) {
      search.getSearchData();
    }
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
