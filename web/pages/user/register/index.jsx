import React from 'react';
import RegisterH5Page from '@layout/user/h5/register';
import { inject } from 'mobx-react';

import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import HOCWithNoLogin from '@common/middleware/HOCWithNoLogin';

@inject('site')
@inject('mobileRegister')
class Register extends React.Component {
  componentDidMount() {
    this.props.mobileRegister.sendCode();
  }
  render() {
    const { site } = this.props;
    const { platform } = site;
    return platform === 'h5' ? <RegisterH5Page /> : <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCWithNoLogin(Register));
