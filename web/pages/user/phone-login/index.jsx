import React from 'react';
import LoginPhoneH5Page from '@layout/user/h5/phone-login';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithNoLogin from '@common/middleware/HOCWithNoLogin';

@inject('site')
@inject('mobileLogin')
class LoginPhone extends React.Component {
  async componentDidMount() {
    try {
      await this.props.mobileLogin.login();
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <LoginPhoneH5Page /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCWithNoLogin(LoginPhone));
