import React from 'react';
import ParnerInviteH5Page from '@layout/forum/h5/partner-invite';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';
import ViewAdapter from '@components/view-adapter';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class ParnerInvite extends React.Component {
  render() {
    const { router } = this.props;
    const inviteCode = router?.query?.inviteCode;
    return <ViewAdapter
              h5={<ParnerInviteH5Page />}
              pc={<ParnerInviteH5Page />}
              title={`${inviteCode ? '邀请进站' : '站点加入'} - ${this.props.site?.siteName}`}
            />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(withRouter(ParnerInvite));
