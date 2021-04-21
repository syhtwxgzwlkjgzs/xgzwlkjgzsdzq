import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import HeaderLogin from '../../../../components/login/h5/header-login';
import PhoneInput from '../../../../components/login/h5/phone-input';

@inject('site')
@inject('user')
@inject('thread')
@inject('wxPhoneBind')
@observer
class WXBindPhoneH5Page extends React.Component {
  handlePhoneNumCallback = (phoneNum) => {
    const { wxPhoneBind } = this.props;
    wxPhoneBind.mobile = phoneNum;
  };

  handlePhoneCodeCallback = (code) => {
    const { wxPhoneBind } = this.props;
    wxPhoneBind.code = code;
  };

  handleSendCodeButtonClick = async () => {
    try {
      await this.props.wxPhoneBind.sendCode();
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  };

  render() {
    const { wxPhoneBind, router } = this.props;
    return (
      <div className={layout.container}>
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.title}>手机号登陆，并绑定微信账号</div>
          <div className={layout.tips}>
            hi， 微信用户
            <img src="/user.png" alt="" />
            小虫
            <br />
            请您登录，即可完成微信号和手机号的绑定
          </div>
          {/* 手机验证码 start */}
          <PhoneInput
            phoneNum={wxPhoneBind.mobile}
            captcha={wxPhoneBind.code}
            phoneNumCallback={this.handlePhoneNumCallback}
            phoneCodeCallback={this.handlePhoneCodeCallback}
            sendCodeCallback={this.handleSendCodeButtonClick}
            codeTimeout={wxPhoneBind.codeTimeout}
          />
          {/* 手机验证码 end */}
          {/* 登录按钮 start */}
          <Button
            className={layout.button}
            type="primary"
            onClick={async () => {
              const { sessionToken } = router.query;
              try {
                await wxPhoneBind.loginAndBind(sessionToken);
                Toast.success({
                  content: '登录成功',
                  duration: 1000,
                });

                setTimeout(() => {
                  this.props.router.push('/index');
                }, 1000);
              } catch (error) {
                Toast.error({
                  content: error.Message,
                });
              }
            }}
          >
            登录并绑定
          </Button>
          <div className={layout['otherLogin-within__tips']}>注册登录即表示您同意《注册协议》《隐私协议》</div>
        </div>
      </div>
    );
  }
}

export default withRouter(WXBindPhoneH5Page);
