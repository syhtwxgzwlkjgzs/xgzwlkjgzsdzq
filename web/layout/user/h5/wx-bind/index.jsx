import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import HeaderLogin from '../../../../components/login/h5/header-login';
import { get } from '../../../../../common/utils/get';
import setAccessToken from '../../../../../common/utils/set-access-token';
import { Button, Toast } from '@discuzq/design';
import { h5WechatCodeBind } from '@server';

@inject('site')
@inject('user')
@inject('h5QrCode')
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
      if (res.code === 0) {
        Toast.success({
          content: '绑定成功',
        });

        const accessToken = get(res, 'data.accessToken', '');
        // 种下 access_token
        setAccessToken({
          accessToken,
        });

        // TODO: 需要对中间状态进行处理

        await this.props.router.push('/');
        return;
      }
      throw {
        Code: res.code,
        Message: res.msg,
      };
    } catch (error) {
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
