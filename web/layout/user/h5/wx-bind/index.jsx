import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import HeaderLogin from '../../../../components/login/h5/header-login';
import { get } from '@common/utils/get';
import setAccessToken from '../../../../../common/utils/set-access-token';
import { Button, Toast } from '@discuzq/design';
import { h5WechatCodeBind } from '@server';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, checkUserStatus } from '@common/store/login/util';

@inject('site')
@inject('user')
@inject('h5QrCode')
@inject('commonLogin')
@observer
class WeixinBindH5Page extends React.Component {
  render() {
    const { sessionToken, loginType, code, sessionId, state, nickname }  = this.props.router.query;
    return (
      <div className={layout.container}>
        <HeaderLogin/>
        <div className={layout.content}>
          <div className={layout.title}>绑定微信号</div>
          <div className={layout.tips}>
            {nickname ? `${nickname}，` : ''}请绑定您的微信
          </div>
          <Button
            className={layout.button}
            type="primary"
            onClick={() => this.bind({
              params: { sessionToken, code, sessionId, type: 'h5', state },
            })}
          >
            绑定微信，并继续访问
          </Button>
        </div>
      </div>
    );
  }

  bind = async (opts) => {
    try {
      const res = await h5WechatCodeBind({
        url: '/apiv3/users/wechat/h5.bind',
        method: 'GET',
        timeout: 3000,
        ...opts,
      });
      checkUserStatus(res);
      if (res.code === 0) {
        Toast.success({
          content: '绑定成功',
        });

        const accessToken = get(res, 'data.accessToken', '');
        const uid = get(res, 'data.uid', '');
        // 种下 access_token
        setAccessToken({
          accessToken,
        });
        this.props.user.updateUserInfo(uid);

        await this.props.router.push('/');
        return;
      }
      throw {
        Code: res.code,
        Message: res.msg,
      };
    } catch (error) {
      // 跳转状态页
      if (error.Code === BANNED_USER || error.Code === REVIEWING || error.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(error.Code, error.Message);
        this.props.router.push('/user/status');
        return;
      }
      if (error.Code) {
        Toast.error({
          content: error.Message,
        });
        return;
      }
      throw {
        Code: 'ulg_9999',
        Message: '网络错误',
        error,
      };
    }
  }
}

export default withRouter(WeixinBindH5Page);
