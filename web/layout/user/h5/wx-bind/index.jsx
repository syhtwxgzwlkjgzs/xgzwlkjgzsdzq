import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import HeaderLogin from '../../../../components/login/h5/header-login';
import { Button, Toast } from '../../../../../../discuz-core/packages/discuz-design';
import { h5WechatCodeBind } from '@server';

@inject('site')
@inject('user')
@inject('h5QrCode')
@observer
class WeixinBindH5Page extends React.Component {
  render() {
    const { sessionToken, loginType, code, sessionId }  = this.props.router.query;
    return (
      <div className={layout.container}>
        <HeaderLogin/>
        <div className={layout.content}>
          <div className={layout.title}>绑定微信号</div>
          <div className={layout.tips}>
            <img src="/user.png" alt=""/>
            {/* todo 小虫替换为用户名*/}
            小虫，请绑定您的微信
          </div>
          <Button
            className={layout.button}
            type="primary"
            onClick={() => this.bind({
              params: { sessionToken, code, sessionId },
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
      console.log(opts.params.sessionToken);
      const res = await h5WechatCodeBind({
        timeout: 3000,
        ...opts,
      });
      if (res.code === 0) {
        Toast.success({
          content: '绑定成功',
        });
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
