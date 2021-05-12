import React from 'react';
import ForumPCPage from '@layout/forum/pc';
import ParnerInviteH5Page from '@layout/forum/h5/partner-invite';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
class ParnerInvite extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <ForumPCPage />;
    }
    return <ParnerInviteH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(ParnerInvite);
