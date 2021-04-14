import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/search-result-topic/h5';
import IndexPCPage from '@layout/search-result-topic/pc';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@observer
class Index extends React.Component {
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
