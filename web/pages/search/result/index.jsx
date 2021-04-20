import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result/h5';
import IndexPCPage from '@layout/search/result/pc';
import { getSearchData } from '@common/service/search';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  // static async getInitialProps(ctx) {
  //   const { res } = await getSearchData({}, ctx);

  //   return {
  //     serverSearch: {
  //       indexTopics: res[0],
  //       indexUsers: res[1],
  //       indexThreads: res[2],
  //     },
  //   };
  // }

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
    const isBool1 = !search.searchTopics && (!serverSearch || !serverSearch.searchTopics);
    const isBool2 = !search.searchUsers && (!serverSearch || !serverSearch.searchUsers);
    const isBool3 = !search.searchThreads && (!serverSearch || !serverSearch.searchThreads);

    if (!isBool1 && !isBool2 && !isBool3) {
      const { res } = await getSearchData({ search: keyword });

      search.setSearchTopics(res[0]);
      search.setSearchUsers(res[1]);
      search.setSearchThreads(res[2]);
    }
  }

  dispatch = async (type, data = '') => {
    const { search } = this.props;

    const { res } = await getSearchData({ search: data });

    search.setSearchTopics(res[0]);
    search.setSearchUsers(res[1]);
    search.setSearchThreads(res[2]);
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
