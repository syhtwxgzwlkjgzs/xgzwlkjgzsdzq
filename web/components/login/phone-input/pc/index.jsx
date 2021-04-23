import React from 'react';
import layout from './index.module.scss';
import { Input } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';

class PhoneInputPC extends React.Component {
  setCaptcha = (e) => {
    const { phoneCodeCallback = () => {} } = this.props;
    const val = e.target.value;
    phoneCodeCallback(val);
  };
  setPhoneNum = (e) => {
    const { phoneNumCallback = () => {} } = this.props;
    const val = e.target.value;
    phoneNumCallback(val);
  };

  render() {
    const { phoneNum, captcha, codeTimeout, sendCodeCallback = () => {} } = this.props;
    return (
      <>
        {/* 手机号输入 start */}
        <div className={layout.tips}>手机号</div>
        <div className={layout.phoneInputPC}>
          <Input
            mode="number"
            className={layout.input}
            value={phoneNum}
            placeholder="请输入您的手机号码"
            onChange={this.setPhoneNum}
          />
        </div>
        {/* 手机号输入 end */}
        {/* 验证码 start */}
        <div className={layout.tips}>手机验证码</div>
        <div className={layout.captchaInput}>
          <Input
            mode="number"
            className={layout.input}
            value={captcha}
            placeholder="请输入手机验证码"
            onChange={this.setCaptcha}
            maxLength={6}
          />
          {codeTimeout ? (
            <div className={layout.countDown}>{codeTimeout}秒后再发送</div>
          ) : (
            <div className={layout.sendCaptcha} onClick={sendCodeCallback}>
              发送验证码
            </div>
          )}
        </div>
        {/* 验证码 end */}
      </>
    );
  }
}

export default PhoneInputPC;
