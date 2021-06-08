import React from 'react';
import ParnerInviteH5Page from '@layout/forum/h5/partner-invite';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class ParnerInvite extends React.Component {
  render() {
    return <ParnerInviteH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(withRouter(ParnerInvite));
