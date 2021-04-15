import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Input, Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import PhoneWeixin from '@common/module/h5/PhoneWeixin/index';
import HeaderLogin from '@common/module/h5/HeaderLogin';

@inject('site')
@inject('user')
@inject('thread')
@inject('userLogin')
@observer
class LoginH5Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  setVisible = () => {
    this.setState({
      visible: false,
    });
  };

  handleUsernameChange = (e) => {
    this.props.userLogin.username = e.target.value;
  }

  handlePasswordChange = (e) => {
    this.props.userLogin.password = e.target.value;
  }

  handleLoginButtonClick = async () => {
    try {
      const loginData = await this.props.userLogin.login();
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000
      })
      // FIXME: Toast 暂时不支持回调能力
      setTimeout(() => {
        
      }, 1000);
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000
      }) 
    }
  }

  render() {
    return (
      <div className={layout.container}>
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.title}>用户名登录</div>
          {/* 输入框 start */}
          <Input
            className={layout.input}
            value={this.props.userLogin.username}
            placeholder="输入您的用户名"
            onChange={this.handleUsernameChange}
          />
          <Input
            clearable={false}
            className={layout.input}
            mode="password"
            value={this.props.userLogin.password}
            placeholder="输入您的登录密码"
            onChange={this.handlePasswordChange}
          />
          {/* 输入框 end */}
          {/* 登录按钮 start */}
          <Button
            className={layout.button}
            type="primary"
            onClick={this.handleLoginButtonClick}
          >
            登录
          </Button>
          {/* 登录按钮 end */}
          <div className={layout.functionalRegion}>
            <span
              className={layout.clickBtn}
              onClick={() => {
                this.props.router.push('register');
              }}
            >
              注册用户
            </span>
            <span> 忘记密码? </span>
            <span
              className={layout.clickBtn}
              onClick={() => {
                console.log('找回');
              }}
            >
              找回
            </span>
          </div>
          <div className={layout['otherLogin-title']}>其他登录方式</div>
          <div className={layout['otherLogin-button']}>
            <span
              onClick={() => {
                this.props.router.push('weixin-login');
              }}
              className={layout['otherLogin-button-weixin']}
            >
              <img src="/login-weixin.png" alt="" />
            </span>
            <span
              onClick={() => {
                this.props.router.push('phone-login');
              }}
              className={layout['otherLogin-button-phone']}
            >
              <img src="/login-phone.png" alt="" />
            </span>
          </div>
          <div className={layout['otherLogin-tips']}>注册登录即表示您同意《注册协议》《隐私协议》</div>
        </div>
        <PhoneWeixin visible={this.state.visible} close={this.setVisible} />
      </div>
    );
  }
}

export default withRouter(LoginH5Page);
