import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HeaderLogin from '../../../../components/login/h5/header-login';
import PhoneInput from '../../../../components/login/h5/phone-input';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import { get } from '@common/utils/get';


@inject('site')
@inject('user')
@inject('thread')
@inject('mobileBind')
@inject('commonLogin')
@observer
class BindPhoneH5Page extends React.Component {
  handlePhoneNumCallback = (phoneNum) => {
    const { mobileBind } = this.props;
    mobileBind.mobile = phoneNum;
  }

  handlePhoneCodeCallback = (code) => {
    const { mobileBind } = this.props;
    mobileBind.code = code;
  }

  handleBindButtonClick = async () => {
    try {
      const { query } = this.props.router;
      const { sessionToken } = query;
      const resp = await this.props.mobileBind.bind(sessionToken);
      const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
      });
      setTimeout(() => {
        this.props.router.push('/index');
      }, 1000);
    } catch (e) {
      // 跳转状态页
      if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(e.Code, e.Message);
        this.props.router.push('/user/status');
        return;
      }
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  handleSendCodeButtonClick = async () => {
    try {
      await this.props.mobileBind.sendCode();
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
            phoneNum={mobileBind.mobile}
            captcha={mobileBind.code}
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
