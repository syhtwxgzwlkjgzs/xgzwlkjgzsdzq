import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/h5';
import IndexPCPage from '@layout/search/pc';
import { readTopicsList } from '@server';
import threadData from './data';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import SearchAction from '../../../common/store/search/action';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  // static async getInitialProps(ctx) {
  //   const topics = await readTopicsList({}, ctx);
  //   return {
  //     serverSearch: {
  //       topics: topics.Data,
  //     },
  //   };
  // }

  constructor(props) {
    super(props);
    const { search } = this.props;
    // 初始化数据到store中
    // serverSearch && serverSearch.topics && search.setTopics(serverSearch.topics);

    search.setIndexTopics({
      pageData: [
        {
          pid: 3,
          userId: 2,
          content: '话题3',
          viewCount: 11,
          threadCount: 1,
          threads: [],
        },
        {
          pid: 4,
          userId: 2,
          content: '话题4',
          viewCount: 11,
          threadCount: 1,
          threads: [],
        },
      ],
      currentPage: 1,
      perPage: 20,
      firstPageUrl: 'https://discuzv3-dev.dnspod.dev/apiv3/topics.list?filter[hot]=1&page=1',
      nextPageUrl: 'https://discuzv3-dev.dnspod.dev/apiv3/topics.list?filter[hot]=1&page=2',
      prePageUrl: 'https://discuzv3-dev.dnspod.dev/apiv3/topics.list?filter[hot]=1&page=1',
      pageLength: 3,
      totalCount: 3,
      totalPage: 1,
    });

    search.setIndexUsers({
      pageData: [
        {
          pid: 1,
          username: 'admin',
          avatar: '',
          groupName: '',
        },
        {
          pid: 2,
          username: 'cjw',
          avatar: '',
          groupName: '普通会员',
        },
        {
          pid: 3,
          username: 'cjw11',
          avatar: '',
          groupName: '普通会员',
        },
        {
          pid: 4,
          username: 'cjw22',
          avatar: '',
          groupName: '普通会员',
        },
      ],
      currentPage: 1,
      perPage: 20,
      firstPageUrl: 'https://discuz.dnspod.dev/apiv3/users.list?filter[username]=&page=1',
      nextPageUrl: 'https://discuz.dnspod.dev/apiv3/users.list?filter[username]=&page=2',
      prePageUrl: 'https://discuz.dnspod.dev/apiv3/users.list?filter[username]=&page=1',
      pageLength: 4,
      totalCount: 4,
      totalPage: 1,
    });

    search.setIndexThreads(threadData);
  }

  // async componentDidMount() {
  //   const { serverSearch, index } = this.props;
  //   // 当服务器无法获取数据时，触发浏览器渲染
  //   if (!index.topics && (!serverSearch || !serverSearch.topics)) {
  //     const topics = await readTopicsList({});

  //     index.setTopics(topics.Data);
  //   }
  // }

  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <IndexPCPage />;
    }

    return <IndexH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
