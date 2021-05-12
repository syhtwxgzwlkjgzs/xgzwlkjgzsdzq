import React from 'react';
import StatusH5Page from '@layout/user/h5/status';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class Status extends React.Component {
  render() {
    return <StatusH5Page/>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Status);
