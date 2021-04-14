import React from 'react';
import { withRouter } from 'next/router';
import WeixinWithin from './WeixinWithin';
import WeixinOuter from './WeixinOuter';
import { IS_WEIXIN } from '@common/constants/login';
class RegisterWeixinH5Page extends React.Component {
  render() {
    return IS_WEIXIN ? <WeixinWithin /> : <WeixinOuter/>;
  }
}

export default withRouter(RegisterWeixinH5Page);
