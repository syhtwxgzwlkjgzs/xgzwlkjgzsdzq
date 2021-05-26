import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/my/block/h5';
import IndexPCPage from '@layout/my/block/pc';
import { readTopicsList, readUsersList } from '@server';
import { Toast } from '@discuzq/design';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
@inject('search')
@observer
class Index extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <IndexPCPage dispatch={this.dispatch} />;
    }

    return <IndexH5Page/>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index);
