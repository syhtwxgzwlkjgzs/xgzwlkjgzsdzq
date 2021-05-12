import React from 'react';
import BindNicknameH5Page from '@layout/user/h5/bind-nickname';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';

@inject('site')
class BindNickname extends React.Component {
  render() {
    return <BindNicknameH5Page />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(BindNickname);
