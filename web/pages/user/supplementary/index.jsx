import React from 'react';
import SupplementaryPage from '@layout/user/h5/supplementary';
import { inject } from 'mobx-react';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class Supplementary extends React.Component {
  render() {
    return <SupplementaryPage />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Supplementary);
