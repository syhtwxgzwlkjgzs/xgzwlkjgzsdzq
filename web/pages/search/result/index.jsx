import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result/h5';
import { readUsersList, readTopicsList, readThreadList } from '@server';
import { Toast } from '@discuzq/design';
import ViewAdapter from '@components/view-adapter';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  static async getInitialProps(ctx) {
    const search = ctx?.query?.keyword || '';

    const topicFilter = {
      hot: 1,
      content: search,
    };

    const topics = await readTopicsList({ params: { filter: topicFilter, perPage: 3 } }, ctx);
    const users = await readUsersList({ params: { filter: { username: search }, perPage: 3 } }, ctx);
    const threads = await readThreadList({ params: { filter: { sort: '3', search }, perPage: 3 } }, ctx);

    return {
      serverSearch: {
        searchTopics: topics?.data,
        searchUsers: users?.data,
        searchThreads: threads?.data,
      },
    };
  }

  constructor(props) {
    super(props);

    const { serverSearch, search } = this.props;

    // 初始化数据到store中
    search.resetSearchData();
  }

  async componentDidMount() {
    const { search, router } = this.props;
    const { keyword = '' } = router?.query;

    await search.getSearchData({
      hasTopics: false,
      hasUsers: false,
      hasThreads: false,
      search: keyword,
      type: 1,
    });
  }

  dispatch = async (type, data = '') => {
    const { search } = this.props;

    search.resetSearchData();
    search.getSearchData({ search: data, type: 1 });
  }

  render() {
    return (
      <ViewAdapter
        h5={<IndexH5Page dispatch={this.dispatch} />}
        pc={<div></div>}
        title='发现结果'
      />
    );
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
