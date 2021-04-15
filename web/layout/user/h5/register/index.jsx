import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Input, Button } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HeaderLogin from '@common/module/h5/HeaderLogin';


@inject('site')
@inject('user')
@inject('thread')
@inject('userRegister')
@observer
class LoginH5Page extends React.Component {
  render() {
    return (
      <div className={layout.container}>
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.title}>用户名注册</div>
          <Input className={layout.input} value={this.props.userRegister.username} placeholder="输入您的用户名" onChange={(e) => {
            this.props.userRegister.username = e.target.value;
          }} />
          <Input clearable={false} className={layout.input} mode="password" value={this.props.userRegister.password} placeholder="输入您的登录密码" onChange={(e) => {
            this.props.userRegister.password = e.target.value;
          }} />
          <Input clearable={false} className={layout.input} mode="password" value={this.props.userRegister.passwordConfirmation} placeholder="确认密码" onChange={(e) => {
            this.props.userRegister.passwordConfirmation = e.target.value;
          }} />
          <Input clearable={false} className={layout.input} value={this.props.userRegister.nickname} placeholder="输入您的昵称" onChange={(e) => {
            this.props.userRegister.nickname = e.target.value;
          }} />
          <Button className={layout.button} type="primary" onClick={() => {
            this.props.userRegister.register();
          }}>
            注册
                </Button>
          <div className={layout.functionalRegion}>
            <span> 已有账号? </span>
            <span className={layout.clickBtn} onClick={() => {
              this.props.router.push('login');
            }} >登录</span>
          </div>
          <div className={layout['otherLogin-tips']}>注册登录即表示您同意《注册协议》《隐私协议》</div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginH5Page);
