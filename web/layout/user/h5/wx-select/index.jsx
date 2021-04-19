import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Input, Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import HeaderLogin from '@common/module/h5/HeaderLogin';
import { h5WechatCodeLogin } from '@server';


@inject('site')
@inject('user')
@inject('thread')
@observer
class WXSelectH5Page extends React.Component {
  render() {
    // console.log(this.props);
    const { router } = this.props;
    const { code, sessionId, sessionToken, state } = router.query;
    console.log(code, sessionId, sessionToken);
    return (
      <div className={layout.container}>
        <div>
          {code}
        </div>
        <div>
          {sessionId}
        </div>
        <div>
        {sessionToken}
        </div>
          <HeaderLogin/>
          <div className={layout.content}>
              <div className={layout.title}>绑定微信号</div>
              <div className={layout.tips}>
              微信用户
              <img src="/user.png" alt=""/>
              小虫，请选择您要进行的操作
              </div>
              <Button className={layout.button} type="primary" onClick={async () => {
                try {
                  const res = await h5WechatCodeLogin({
                    timeout: 10000,
                    params: {
                      code,
                      sessionId,
                      sessionToken,
                      state,
                    } });
                  Toast.success({
                    content: res.code + res.msg,
                  });
                  if (res.code === 0) {
                    this.qrCode = res.data.base64Img;
                    return;
                  }
                  throw {
                    Code: res.code,
                    Message: res.msg,
                  };
                } catch (error) {
                  if (error.Code) {
                    throw error;
                  }
                  throw {
                    Code: 'ulg_9999',
                    Message: '网络错误',
                    error,
                  };
                }
              }}>
                微信登录
              </Button>
              <Button className={layout.button} type="primary" onClick={() => {
                console.log('使用用户名密码登录，并绑定微信');
                router.push('wx-bind-username');
              }}>
                使用用户名密码登录，并绑定微信
              </Button>
              <Button className={layout.button} type="primary" onClick={() => {
                router.push('wx-bind-phone');
                console.log('使用手机号登录，并绑定微信');
              }}>
                使用手机号登录，并绑定微信
              </Button>
          </div>
      </div>
    );
  }
}

export default withRouter(WXSelectH5Page);
