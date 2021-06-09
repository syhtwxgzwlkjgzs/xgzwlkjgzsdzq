import React from 'react';
import FindPasswordH5Page from '@layout/user/h5/find-password';
import { inject } from 'mobx-react';
import ViewAdapter from '@components/view-adapter';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class FindPassword extends React.Component {
  render() {
    return <ViewAdapter
              h5={<FindPasswordH5Page/>}
              pc={<></>}
              title={`找回密码 - ${this.props.site?.siteName}`}
            />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(FindPassword);
