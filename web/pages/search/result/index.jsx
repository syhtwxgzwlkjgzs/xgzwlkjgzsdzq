import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result/h5';
import IndexPCPage from '@layout/search/result/pc';
import { readUsersList, readTopicsList, readThreadList } from '@server';


import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  static async getInitialProps(ctx) {
    const search = ctx?.query?.keyword || '';

    const topicFilter = {
      hot: search !== '' ? 0 : 1,
      content: search,
    };

    const topics = await readTopicsList({ params: { filter: topicFilter } }, ctx);
    const users = await readUsersList({ params: { filter: { username: search } } }, ctx);
    const threads = await readThreadList({ params: { filter: { sort: '3', search } } }, ctx);

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
    serverSearch && serverSearch.searchTopics && search.setSearchTopics(serverSearch.searchTopics);
    serverSearch && serverSearch.searchUsers && search.setSearchUsers(serverSearch.searchUsers);
    serverSearch && serverSearch.searchThreads && search.setSearchThreads(serverSearch.searchThreads);
  }

  async componentDidMount() {
    const { search, serverSearch, router } = this.props;
    const { keyword = '' } = router.query;

    // 当服务器无法获取数据时，触发浏览器渲染
    // TODO 待调整接口判断请求
    const isBool1 = !search.searchTopics && (!serverSearch || !serverSearch.searchTopics);
    const isBool2 = !search.searchUsers && (!serverSearch || !serverSearch.searchUsers);
    const isBool3 = !search.searchThreads && (!serverSearch || !serverSearch.searchThreads);

    if (!isBool1 && !isBool2 && !isBool3) {
      search.getSearchData({ search: keyword, type: 1 });
    }
  }

  dispatch = async (type, data = '') => {
    const { search } = this.props;

    search.getSearchData({ search: data, type: 1 });
  }

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
