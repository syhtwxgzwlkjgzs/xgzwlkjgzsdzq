import React from 'react';
import ForumPCPage from '@layout/forum/pc';
import ForumH5Page from '@layout/forum/h5';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
class Forum extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <ForumPCPage />;
    }
    return <ForumH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Forum);
