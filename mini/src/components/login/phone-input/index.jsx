import React from 'react';
// import Input from '@discuzq/design/dist/components/input/index';
import Input from '@discuzq/design/dist/components/input/index';
import { View } from '@tarojs/components';
import layout from './index.module.scss';
import CaptchaInput from './captcha-input';

class PhoneInput extends React.Component {
  setCaptcha = (code) => {
    const { phoneCodeCallback = () => {} } = this.props;
    phoneCodeCallback(code);
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
        <View className={layout.phoneInput}>
          <Input
            mode="number"
            htmlType="number"
            className={layout.input}
            value={phoneNum}
            placeholder="请输入手机号码"
            onChange={this.setPhoneNum}
          />
          {codeTimeout ? (
            <View className={layout.countDown}>{codeTimeout}秒后再发送</View>
          ) : (
            <View className={layout.sendCaptcha} onClick={sendCodeCallback}>
              发送验证码
            </View>
          )}
        </View>
        {/* 手机号输入 end */}
        {/* 验证码 start */}
        <View className={layout.captchaInput}>
          <View className={layout['captchaInput-title']}>短信验证码</View>
          <CaptchaInput captcha={captcha} inputCallback={this.setCaptcha} />
        </View>
        {/* 验证码 end */}
      </>
    );
  }
}

export default PhoneInput;
