import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Input, Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import HeaderLogin from '../../../../components/login/h5/header-login';


@inject('site')
@inject('user')
@inject('userLogin')
@observer
class WXBindUsernameH5page extends React.Component {
  constructor(props) {
    super(props);
    this.props.userLogin.sessionToken = this.props.router.query.sessionToken;
    console.log(this.props.user);
  }

  loginErrorHandler = (e) => {
    // TODO: 完善完这里的所有逻辑
    Toast.error({
      content: e.Message,
      hasMask: false,
      duration: 1000,
    });
  }


  handleLoginButtonClick = async () => {
    try {
      await this.props.userLogin.login();
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
      });
      // FIXME: Toast 暂时不支持回调能力
      setTimeout(() => {
        this.props.router.push('/index');
        return;
      }, 1000);
    } catch (e) {
      this.loginErrorHandler(e);
    }
  }
  render() {
    const { nickname } = this.props.router.query;
    return (
        <div className={layout.container}>
            <HeaderLogin/>
            <div className={layout.content}>
                <div className={layout.title}>用户名登录，并绑定微信账号</div>
                <div className={layout.tips}>
                  hi， 微信用户
                  {nickname}
                  <br/>
                  请您登录，即可完成微信号和用户名的绑定
                </div>
                {/* 输入框 start */}
                <Input className={layout.input} value={this.props.userLogin.username} placeholder="输入您的用户名" onChange={(e) => {
                  this.props.userLogin.username = e.target.value;
                }} />
                <Input clearable={false} className={layout.input} mode="password" value={this.props.userLogin.password} placeholder="输入您的登录密码" onChange={(e) => {
                  this.props.userLogin.password = e.target.value;
                }}/>
                {/* 输入框 end */}
                {/* 登录按钮 start */}
                <Button className={layout.button} type="primary" onClick={this.handleLoginButtonClick}>
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

export default withRouter(WXBindUsernameH5page);
