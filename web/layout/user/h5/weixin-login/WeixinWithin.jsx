import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Input, Button } from '@discuzq/design';
import '@discuzq/design/styles/index.scss';
import HeaderLogin from '@common/module/h5/HeaderLogin';


@inject('site')
@inject('user')
@inject('thread')
@observer
class WeixinWithin extends React.Component {
  render() {
    return (
        <div className={layout.container}>
            <HeaderLogin/>
            <div className={layout.content}>
                <div className={layout.title}>用户名登录，并绑定微信账号</div>
                <div className={layout.tips}>
                  hi， 微信用户
                  <img src="/user.png" alt=""/>
                  小虫<br/>
                  请您登录，即可完成微信号和用户名的绑定
                </div>
                {/* 输入框 start */}
                <Input className={layout.input} value='' placeholder="输入您的用户名" onChange={(e) => {
                  console.log(e.target.value);
                }} />
                <Input clearable={false} className={layout.input} mode="password" value='' placeholder="输入您的登录密码" onChange={(e) => {
                  console.log(e.target.value);
                }}/>
                {/* 输入框 end */}
                {/* 登录按钮 start */}
                <Button className={layout.button} type="primary" onClick={() => {
                  console.log('登录并绑定');
                }}>
                  登录并绑定
                </Button>
                {/* 登录按钮 end */}
                <div className={layout.functionalRegion}>
                    <span> 没有账号? </span>
                    <span className={layout.clickBtn} onClick={() => {
                      this.props.router.push('login');
                    }} >创建新账号</span>
                </div>
                <div className={layout['otherLogin-within__tips']}>注册登录即表示您同意《注册协议》《隐私协议》</div>
            </div>
        </div>
    );
  }
}

export default withRouter(WeixinWithin);
