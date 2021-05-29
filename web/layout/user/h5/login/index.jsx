import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import isWeiXin from '@common/utils/is-weixin';
import clearLoginStatus from '@common/utils/clear-login-status';
import '@discuzq/design/dist/styles/index.scss';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';

@inject('site')
@inject('invite')
@inject('commonLogin')
@observer
class Login extends React.Component {
  componentDidMount() {
    const { site, invite, router } = this.props;


    clearLoginStatus(); // 清除登录态
    if (site.wechatEnv !== 'none') {
      if (isWeiXin()) {
        let inviteCode = invite.getInviteCode(router);
        if (inviteCode) inviteCode = `?inviteCode=${inviteCode}`;
        const redirectEncodeUrl = encodeURIComponent(`${window.location.origin}/user/wx-auth${inviteCode}`);
        window.location.href = `${window.location.origin}/apiv3/users/wechat/h5.oauth?redirect=${redirectEncodeUrl}`;
        return;
      }
      router.replace('/user/wx-login');
      return;
    }

    if (site.isSmsOpen) {
      router.replace('/user/phone-login');
      return;
    }

    router.replace('/user/username-login');
  }

  render() {
    return null;
  }
}

export default withRouter(Login);
