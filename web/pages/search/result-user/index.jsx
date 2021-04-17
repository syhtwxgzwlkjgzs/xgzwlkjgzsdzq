import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search/result-user/h5';
import IndexPCPage from '@layout/search/result-user/pc';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  constructor(props) {
    super(props);
    const { search } = this.props;
    search.setUsers({
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
