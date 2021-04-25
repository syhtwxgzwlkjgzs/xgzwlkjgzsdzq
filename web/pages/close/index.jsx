import React from 'react';
import { inject, observer } from 'mobx-react';
import isServer from '@common/utils/is-server';
import Router from '@discuzq/sdk/dist/router';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@observer
class CloseSite extends React.Component {
  render() {
    const { site } = this.props;
    const { closeSiteConfig } = site;

    if (!isServer() && !closeSiteConfig) {
      Router.redirect({url: '/'});
    }

    return (
      <div className='index'>
        <h1>关闭站点</h1>
        {closeSiteConfig && <p>{closeSiteConfig.detail}</p>}
      </div>
    );
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(CloseSite);
