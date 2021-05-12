import React from 'react';
import { withRouter } from 'next/router';
import { inject } from 'mobx-react';
import Frozen from '@layout/wallet/frozen';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

class FrozenPage extends React.Component {
  render() {
    return <Frozen />;
  }
}

// eslint-disable-next-line new-cap
export default withRouter(HOCFetchSiteData(FrozenPage));
