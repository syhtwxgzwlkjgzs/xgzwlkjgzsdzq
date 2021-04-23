import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result-user/h5';
import IndexPCPage from '@layout/search/result-user/pc';
import { getUsersList } from '@common/service/search';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  static async getInitialProps(ctx) {
    const { res } = await getUsersList({}, ctx);

    return {
      serverSearch: {
        users: res,
      },
    };
  }

  page = 1;
  perPage = 10;

  constructor(props) {
    super(props);
    const { serverSearch, search } = this.props;
    // 初始化数据到store中
    serverSearch && serverSearch.users && search.setUsers(serverSearch.users);
  }

  async componentDidMount() {
    const { search, serverSearch, router } = this.props;
    const { keyword = '' } = router.query;
    // 当服务器无法获取数据时，触发浏览器渲染
    const isBool = !search.users && (!serverSearch || !serverSearch.users);

    if (!isBool) {
      const { res } = await getUsersList({ search: keyword });
      this.page += 1;
      search.setUsers(res);
    }
  }

  dispatch = async (type, data) => {
    const { search } = this.props;

    if (type === 'refresh') {
      const { res } = await getUsersList({ search: data, perPage: this.perPage });
      this.page = 2;
      search.setUsers(res);
    } else if (type === 'moreData') {
      const { users } = search;
      const { pageData } = users || { pageData: [] };
      if (this.page === 1) {
        this.page = 2;
      }
      const { res } = await getUsersList({ search: data, perPage: this.perPage, page: this.page });

      if (res?.pageData?.length) {
        this.page += 1;
        res.pageData.unshift(...pageData);
        search.setUsers(res);
      }

      return;
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
