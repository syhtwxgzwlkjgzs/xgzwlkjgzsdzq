import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result-topic';
import { readTopicsList } from '@server';
import { Toast } from '@discuzq/design';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  // static async getInitialProps(ctx) {
  //   const search = ctx?.query?.keyword || '';
  //   const topicFilter = {
  //     hot: 0,
  //     content: search,
  //   };
  //   const result = await readTopicsList({ params: { filter: topicFilter } });

  //   return {
  //     serverSearch: {
  //       topics: result?.data,
  //     },
  //   };
  // }

  page = 1;
  perPage = 10;

  constructor(props) {
    super(props);
    const { serverSearch, search } = this.props;
    // 初始化数据到store中
    serverSearch && serverSearch.topics && search.setTopics(serverSearch.topics);
  }

  async componentDidMount() {
    const { search, router } = this.props;
    const { keyword = '' } = router.query;
    // 当服务器无法获取数据时，触发浏览器渲染
    const hasTopics = !!search.topics;

    if (!hasTopics) {
      this.toastInstance = Toast.loading({
        content: '加载中...',
        duration: 0,
      });

      this.page = 1;
      await search.getTopicsList({ search: keyword });

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

    await search.getTopicsList({ search: data, perPage: this.perPage, page: this.page });
    return;
  }

  render() {

    return <IndexH5Page dispatch={this.dispatch} />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
