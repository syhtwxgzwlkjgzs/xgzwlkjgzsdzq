import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result-post/h5';
import IndexPCPage from '@layout/search/result-post/pc';
import { getThreadList } from '@common/service/search';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  page = 1;
  perPage = 10;

  constructor(props) {
    super(props);
    const { serverSearch, search } = this.props;
    // 初始化数据到store中
    serverSearch && serverSearch.threads && search.setThreads(serverSearch.threads);
  }

  async componentDidMount() {
    const { search, serverSearch, router } = this.props;
    const { keyword = '' } = router.query;
    // 当服务器无法获取数据时，触发浏览器渲染
    const isBool = !search.threads && (!serverSearch || !serverSearch.threads);

    if (!isBool) {
      const { res } = await getThreadList({ search: keyword });

      this.page += 1;
      search.setThreads(res);
    }
  }

  dispatch = async (type, data) => {
    const { search } = this.props;

    if (type === 'refresh') {
      const { res } = await getThreadList({ search: data, perPage: this.perPage });
      this.page = 2;
      search.setThreads(res);
    } else if (type === 'moreData') {
      const { threads } = search;
      const { pageData } = threads || { pageData: [] };
      const { res } = await getThreadList({ search: data, perPage: this.perPage, page: this.page });
      if (res?.pageData?.length) {
        this.page += 1;
        res.pageData.unshift(...pageData);
        search.setUsers(res);
      }
    }
  }

  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <IndexPCPage />;
    }

    return <IndexH5Page dispatch={this.dispatch} />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
