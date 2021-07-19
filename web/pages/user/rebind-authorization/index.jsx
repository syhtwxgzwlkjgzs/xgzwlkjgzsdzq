import React from 'react';
import RebindAuthorizationPage from '@layout/user/h5/rebind-authorization';
import { inject } from 'mobx-react';
import ViewAdapter from '@components/view-adapter';

import HOCLoginMode from '@middleware/HOCLoginMode';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class Authorization extends React.Component {
  render() {
    return <ViewAdapter
              h5={<RebindAuthorizationPage/>}
              pc={<></>}
              title={`换绑授权 - ${this.props.site?.siteName}`}
            />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCLoginMode('weixin')(Authorization));
