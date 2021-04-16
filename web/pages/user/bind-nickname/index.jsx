import React from 'react';
import BindNicknameH5Page from '@layout/user/h5/bind-nickname';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
class BindNickname extends React.Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <BindNicknameH5Page /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(BindNickname);
