import React from 'react';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCWithLogin from '@middleware/HOCWithLogin';
import { inject, observer } from 'mobx-react';
import H5Page from '@layout/my/draft/h5';
import PCPage from '@layout/my/draft/pc';

@inject('site')
@observer
class Draft extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <PCPage />;
    }
    return <H5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCWithLogin(Draft));
