import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result-post';
import { readThreadList } from '@server';
import { Toast } from '@discuzq/design';
import Page from '@components/page';
import { getCurrentInstance } from '@tarojs/taro';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  static async getInitialProps(ctx) {
    const search = ctx?.query?.keyword || '';
    const result = await readThreadList({ params: { filter: { sequence: '0', filter: { sort: '3', search } } } }, ctx);

    return {
      serverSearch: {
        threads: result?.data,
      },
    };
  }

  page = 1;
  perPage = 10;

  constructor(props) {
    super(props);
    const { serverSearch, search } = this.props;
    // 初始化数据到store中
    serverSearch && serverSearch.threads && search.setThreads(serverSearch.threads);
  }

  async componentDidMount() {
    const { search, router } = this.props;
    const { keyword = '' } = getCurrentInstance().router.params;

      this.page = 1;
      await search.getThreadList({ search: keyword });
  }

  dispatch = async (type, data) => {
    const { search } = this.props;

    if (type === 'refresh') {
      this.page = 1;
    } else if (type === 'moreData') {
      this.page += 1;
    }

    await search.getThreadList({ search: data, perPage: this.perPage, page: this.page });
    return;
  }

  render() {
    return (
      <Page>
        <IndexH5Page dispatch={this.dispatch} />
      </Page>
    );
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
