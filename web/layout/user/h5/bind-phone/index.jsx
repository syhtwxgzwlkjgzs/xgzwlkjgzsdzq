import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HeaderLogin from '@common/module/h5/HeaderLogin';
import PhoneInput from '@common/module/h5/PhoneInput/index';


@inject('site')
@inject('user')
@inject('thread')
@inject('mobileBind')
@observer
class BindPhoneH5Page extends React.Component {
  handlePhoneNumCallback = (phoneNum) => {
    const { mobileBind } = this.props;
    console.log(phoneNum);
    mobileBind.mobile = phoneNum;
  }

  handlePhoneCodeCallback = (code) => {
    const { mobileBind } = this.props;
    console.log(code);
    mobileBind.code = code;
  }

  handleBindButtonClick = async () => {
    try {
      const bindData = await this.props.mobileBind.bind();
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
      });
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  handleSendCodeButtonClick = async () => {
    try {
      const sendCodeData = await this.props.mobileBind.sendCode();
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  render() {
    const { mobileBind } = this.props;
    return (
      <div className={layout.container}>
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.title}>绑定手机号</div>
          <div className={layout.tips}>
            请绑定您的手机号
          </div>
          <PhoneInput
            phoneNumCallback={this.handlePhoneNumCallback}
            phoneCodeCallback={this.handlePhoneCodeCallback}
            sendCodeCallback={this.handleSendCodeButtonClick}
            codeTimeout={mobileBind.codeTimeout}
          />
          <Button className={layout.button} type="primary" onClick={this.handleBindButtonClick}>
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

export default withRouter(BindPhoneH5Page);
