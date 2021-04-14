import React from 'react';
import { withRouter } from 'next/router';
import WeixinWithin from './WeixinWithin';
import WeixinOuter from './WeixinOuter';
import { IS_WEIXIN } from '@common/constants/login';
class LoginWeixinH5Page extends React.Component {
  render() {
    return IS_WEIXIN ? <WeixinWithin /> : <WeixinOuter/>;
  }
}

export default withRouter(LoginWeixinH5Page);
