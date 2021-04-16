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
class BindNicknameH5Page extends React.Component {
  render() {
    return (
      <div className={layout.container}>
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.title}>设置昵称</div>
          <Input
            className={layout.input}
            value=''
            placeholder="昵称"
            onChange={() => {}}
          />
          <Button className={layout.button} type="primary" onClick={() => {
            console.log('下一步');
          }}>
            下一步
          </Button>
          <div className={layout.functionalRegion}>
            <span className={layout.clickBtn} onClick={() => {
              this.props.router.push('login');
            }} >退出登录</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(BindNicknameH5Page);
