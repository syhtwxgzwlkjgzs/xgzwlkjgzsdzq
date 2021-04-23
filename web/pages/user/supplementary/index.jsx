import React from 'react';
import SupplementaryH5Page from '@layout/user/h5/supplementary';
import { inject } from 'mobx-react';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
class Supplementary extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <SupplementaryH5Page /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Supplementary);
