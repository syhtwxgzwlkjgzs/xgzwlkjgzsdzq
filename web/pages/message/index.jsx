import React from 'react';
import { inject, observer } from 'mobx-react';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithLogin from '@common/middleware/HOCWithLogin';
import MyH5Page from '@layout/message/h5';
import MyPCPage from '@layout/message/pc';

@inject('site')
@observer
class Index extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <MyPCPage />;
    }
    return <MyH5Page />;
  }
}

export default HOCFetchSiteData(HOCWithLogin(Index));
