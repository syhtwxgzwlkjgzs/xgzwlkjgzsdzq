import React from 'react';
import FindPasswordH5Page from '@layout/user/h5/find-password';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
class FindPassword extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <FindPasswordH5Page /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(FindPassword);
