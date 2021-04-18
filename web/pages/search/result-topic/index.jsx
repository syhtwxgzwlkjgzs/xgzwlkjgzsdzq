import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result-topic/h5';
import IndexPCPage from '@layout/search/result-topic/pc';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
    const { search } = this.props;
    search.setTopics({
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
  }

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
