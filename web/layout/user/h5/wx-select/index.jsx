import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import HeaderLogin from '../../../../components/login/h5/header-login';
import { get } from '../../../../../common/utils/get';
import setAccessToken from '../../../../../common/utils/set-access-token';
import { usernameAutoBind } from '@server';


@inject('site')
@inject('user')
@observer
class WXSelectH5Page extends React.Component {
  render() {
    const { router } = this.props;
    const { sessionToken, nickname } = router.query;
    return (
      <div className={layout.container}>
          <HeaderLogin/>
          <div className={layout.content}>
              <div className={layout.title}>绑定微信号</div>
              <div className={layout.tips}>
              微信用户 {nickname}，请选择您要进行的操作
              </div>
              <Button className={layout.button} type="primary" onClick={async () => {
                try {
                  const res = await usernameAutoBind({
                    timeout: 10000,
                    params: {
                      sessionToken,
                    },
                  });
                  Toast.success({
                    content: res.code + res.msg,
                  });
                  if (res.code === 0) {
                    const accessToken = get(res, 'data.accessToken', '');
                    // 种下 access_token
                    setAccessToken({
                      accessToken,
                    });

                    this.props.router.push('/index');

                    // TODO: 处理中间状态
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
                router.push({ pathname: 'wx-bind-username', query: { sessionToken, nickname } });
              }}>
                使用用户名密码登录，并绑定微信
              </Button>
              <Button className={layout.button} type="primary" onClick={() => {
                router.push({ pathname: 'wx-bind-phone', query: { sessionToken, nickname } });
              }}>
                使用手机号登录，并绑定微信
              </Button>
          </div>
      </div>
    );
  }
}

export default withRouter(WXSelectH5Page);
