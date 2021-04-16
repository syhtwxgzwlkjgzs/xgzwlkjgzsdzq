import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Input } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HeaderLogin from '@common/module/h5/HeaderLogin';


@inject('site')
@inject('user')
@inject('thread')
@inject('userRegister')
@observer
class ResetPasswordH5Page extends React.Component {
  render() {
    return (
      <div className={layout.container}>
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.title}>设置新密码</div>
          <div className={layout.tips}>
            手机号验证通过，请设置您的新密码
          </div>
          <Input
            clearable={false}
            className={layout.input}
            mode="password"
            value=''
            placeholder="新密码"
            onChange={() => {}}
          />
          <Input
            clearable={false}
            className={layout.input}
            mode="password"
            value=''
            placeholder="重复新密码"
            onChange={() => {}}
          />
          <Button className={layout.button} type="primary" onClick={() => {
            console.log('下一步');
          }}>
            下一步
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(ResetPasswordH5Page);
