import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result';
import { readUsersList, readTopicsList, readThreadList } from '@server';
import { Toast } from '@discuzq/design';
import Page from '@components/page';
import { getCurrentInstance } from '@tarojs/taro';

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
    serverSearch && serverSearch.searchTopics && search.setSearchTopics(serverSearch.searchTopics);
    serverSearch && serverSearch.searchUsers && search.setSearchUsers(serverSearch.searchUsers);
    serverSearch && serverSearch.searchThreads && search.setSearchThreads(serverSearch.searchThreads);
  }

  async componentDidMount() {
    const { search, router } = this.props;
    // const { keyword = '' } = router?.query;
    const { keyword = '' } = getCurrentInstance().router.params;

    // 当服务器无法获取数据时，触发浏览器渲染
    const hasSearchTopics = !!search.searchTopics;
    const hasSearchUsers = !!search.searchUsers;
    const hasSearchThreads = !!search.searchThreads;

    this.toastInstance = Toast.loading({
      content: '加载中...',
      duration: 0,
    });

    await search.getSearchData({
      hasTopics: hasSearchTopics,
      hasUsers: hasSearchUsers,
      hasThreads: hasSearchThreads,
      search: keyword,
      type: 1,
    });

    this.toastInstance?.destroy();
  }

  dispatch = async (type, data = '') => {
    const { search } = this.props;

    search.getSearchData({ search: data, type: 1 });
  }

  render() {
    return (
      <Page>
        <IndexH5Page dispatch={this.dispatch} />
      </Page>
    )
  }
}

// eslint-disable-next-line new-cap
export default Index;
