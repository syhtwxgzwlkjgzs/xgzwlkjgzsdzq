import React from 'react';
import SuppleMentaryH5Page from '@layout/user/h5/supple-mentary';
import { inject } from 'mobx-react';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
class SuppleMentary extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <SuppleMentaryH5Page /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(SuppleMentary);
