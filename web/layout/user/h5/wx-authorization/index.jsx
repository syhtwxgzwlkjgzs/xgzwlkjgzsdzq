import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import HomeHeader from '@components/home-header';
import { Button, Toast } from '@discuzq/design';
import { ToastProvider } from '@discuzq/design/dist/components/toast/ToastProvider';
import { h5WechatCodeLogin } from '@server';
import {checkUserStatus } from '@common/store/login/util';

const MemoToastProvider = React.memo(ToastProvider);

@inject('site')
@inject('user')
@inject('h5QrCode')
@inject('commonLogin')
@observer
class WXAuthorizationPage extends React.Component {
  render() {
    return (
      <MemoToastProvider>
        <div className={layout.container}>
          <HomeHeader hideinfo/>
          <div className={layout.content}>
            <div className={layout.title}>{this.props.h5QrCode.loginTitle}</div>
            {
              this.props.h5QrCode.isBtn
              ? <Button
                  className={layout.button}
                  type="primary"
                  onClick={this.authorization}
                >
                  确定
                </Button>
              : <></>
            }
          </div>
        </div>
      </MemoToastProvider>
    );
  }

  authorization = async () => {
    const { router } = this.props;
    const { code, sessionId, sessionToken, state } = router.query;
    try {
      const res = await h5WechatCodeLogin({
        timeout: 10000,
        params: {
          code,
          sessionId,
          sessionToken,
          state,
        },
      });
      if (res.code === 0) {
        this.props.h5QrCode.loginTitle = '已成功登录';
        this.props.h5QrCode.isBtn = false;
        return;
      }
      checkUserStatus(res);
      throw {
        Code: res.code,
        Message: res.msg,
      };
    } catch (error) {
      Toast.error({
        content: error.Message,
      });
      throw {
        Code: 'ulg_9999',
        Message: '网络错误',
        error,
      };
    }
  }
}

export default withRouter(WXAuthorizationPage);
