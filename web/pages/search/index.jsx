import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/h5';
import IndexPCPage from '@layout/search/pc';
import { readUsersList, readTopicsList, readThreadList } from '@server';
import { Toast } from '@discuzq/design';

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

    const topics = await readTopicsList({ params: { filter: topicFilter, perPage: 10 } }, ctx);
    const users = await readUsersList({ params: { filter: { nickname: search }, perPage: 10 } }, ctx);
    const threads = await readThreadList({ params: { filter: { sort: '3', search }, perPage: 10 } }, ctx);

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
    const { platform } = this.props.site || {};

    if (platform === 'pc') {
      search.setIndexTopics(null);
      search.setIndexUsers(null);
      search.setIndexThreads(null);
    } else {
      serverSearch && serverSearch.indexTopics && search.setIndexTopics(serverSearch.indexTopics);
      serverSearch && serverSearch.indexUsers && search.setIndexUsers(serverSearch.indexUsers);
      serverSearch && serverSearch.indexThreads && search.setIndexThreads(serverSearch.indexThreads);
    }
  }

  async componentDidMount() {
    const { search, router } = this.props;
    const { keyword = '' } = router?.query;

    // 当服务器无法获取数据时，触发浏览器渲染
    

    // this.toastInstance = Toast.loading({
    //   content: '加载中...',
    //   duration: 0,
    // });

    const { platform } = this.props.site || {};

    if (platform === 'pc') {
      search.getSearchData({ hasTopics: false, hasUsers: false, hasThreads: false, search: keyword });
    } else {
      const hasIndexTopics = !!search.indexTopics;
      const hasIndexUsers = !!search.indexUsers;
      const hasIndexThreads = !!search.indexThreads;
      search.getSearchData({ hasTopics: hasIndexTopics, hasUsers: hasIndexUsers, hasThreads: hasIndexThreads, search: keyword });
    }
    

    // this.toastInstance?.destroy();
  }

  dispatch = async (type, data = '') => {
    const { search } = this.props;

    if (type === 'refresh') {
      search.getSearchData({ hasTopics: false, hasUsers: false, hasThreads: false });
    } else {
      search.getSearchData({ search: data });
    }
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
