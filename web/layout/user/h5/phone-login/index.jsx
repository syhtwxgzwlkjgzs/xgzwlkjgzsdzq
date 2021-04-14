import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Input, Button } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import PhoneInput from '@common/module/h5/PhoneInput/index';
import HeaderLogin from '@common/module/h5/HeaderLogin';


@inject('site')
@inject('user')
@inject('thread')
@observer
class LoginPhoneH5Page extends React.Component {
  render() {
    return (
        <div className={layout.container}>
            <HeaderLogin/>
            <div className={layout.content}>
                <div className={layout.title}>手机号码登录/注册</div>
                <PhoneInput/>
                {/* 登录按钮 start */}
                <Button className={layout.button} type="primary" onClick={() => {
                  console.log('点击');
                }}>
                  登录
                </Button>
                {/* 登录按钮 end */}
                <div className={layout['otherLogin-title']}>其他登录方式</div>
                <div className={layout['otherLogin-button']}>
                  <span onClick={() => {
                    this.props.router.push('weixin-login');
                  }} className={layout['otherLogin-button-weixin']}>
                    <img src="/login-weixin.png" alt=""/>
                  </span>
                  <span onClick={() => {
                    this.props.router.push('login');
                  }} className={layout['otherLogin-button-user']}>
                    <img src='/login-user.png' alt=""/>
                  </span>
                </div>
                <div className={layout['otherLogin-tips']}>注册登录即表示您同意《注册协议》《隐私协议》</div>
            </div>
        </div>
    );
  }
}

export default withRouter(LoginPhoneH5Page);
