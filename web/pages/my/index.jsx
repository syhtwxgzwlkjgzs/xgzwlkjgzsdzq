import React from 'react';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCWithLogin from '@middleware/HOCWithLogin';
import { inject, observer } from 'mobx-react';
import MyH5Page from '@layout/my/h5';
import MyPCPage from '@layout/my/pc';

@inject('site')
@observer
class MyCenter extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <MyPCPage />;
    }
    return <MyH5Page />;
  }
}

// export default HOCFetchSiteData(HOCWithLogin(MyCenter));

export default HOCFetchSiteData(MyCenter);
