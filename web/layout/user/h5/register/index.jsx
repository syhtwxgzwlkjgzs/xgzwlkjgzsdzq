import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Input, Button } from '@discuzq/design';
import '@discuzq/design/styles/index.scss';
import layout from './index.module.scss';


@inject('site')
@inject('user')
@inject('thread')
@observer
class LoginH5Page extends React.Component {
  render() {
    return (
        <div className={layout.container}>
            <div className={layout.banner}>
              <img src="https://main.qcloudimg.com/raw/ba94091fa7557eb8bed849ce577ea160.png" alt=""/>
            </div>
            <div className={layout.content}>
                <div className={layout.title}>用户名注册</div>
                <Input className={layout.input} value='' placeholder="输入您的用户名" onChange={(e) => {
                  console.log(e.target.value);
                }} />
                <Input clearable={false} className={layout.input} mode="password" value='' placeholder="输入您的登录密码" onChange={(e) => {
                  console.log(e.target.value);
                }}/>
                <Button className={layout.button} type="primary" onClick={() => {
                  console.log('点击');
                }}>
                  登录
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
