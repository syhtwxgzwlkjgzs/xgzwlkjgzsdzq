import React from 'react';
import InvitePCPage from '@layout/invite/pc';
import InviteH5Page from '@layout/invite/h5';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class Invite extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <InvitePCPage/>;
    }
    return <InviteH5Page/>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Invite);
