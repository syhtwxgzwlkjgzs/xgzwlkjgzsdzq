import React from 'react';
import AgreementPage from '@layout/user/h5/agreement';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class Agreement extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <></> : <AgreementPage />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Agreement);
