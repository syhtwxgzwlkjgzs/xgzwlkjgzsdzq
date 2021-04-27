import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result-user/h5';
import IndexPCPage from '@layout/search/result-user/pc';
import { readUsersList } from '@server';
import { Toast } from '@discuzq/design';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  static async getInitialProps(ctx) {
    const search = ctx?.query?.keyword || '';
    const result = await readUsersList({ params: { filter: { username: search } } });

    return {
      serverSearch: {
        users: result?.data,
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
    const { search, router } = this.props;
    const { keyword = '' } = router.query;
    // 当服务器无法获取数据时，触发浏览器渲染
    const hasUsers = !!search.users;

    if (!hasUsers) {
      this.toastInstance = Toast.loading({
        content: '加载中...',
        duration: 0,
      });

      this.page = 1;
      await search.getUsersList({ search: keyword });

      this.toastInstance?.destroy();
    }
  }

  dispatch = async (type, data) => {
    const { search } = this.props;

    if (type === 'refresh') {
      this.page = 1;
    } else if (type === 'moreData') {
      this.page += 1;
    }

    await search.getUsersList({ search: data, perPage: this.perPage, page: this.page });
    return;
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
