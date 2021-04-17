import React, { Fragment } from 'react';
import layout from './index.module.scss';
import { Input } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import CaptchaInput from '@common/module/h5/CaptchaInput';


class PhoneInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNum: '', // 手机号
      inputValue: '', // 验证码
    };
  }

  setCaptcha = (code) => {
    const { phoneCodeCallback = () => {} } = this.props;
    this.setState({
      inputValue: code,
    });
    phoneCodeCallback(code);
  }
  setPhoneNum = (e) => {
    const { phoneNumCallback = () => {} } = this.props;
    const val = e.target.value;
    this.setState({
      phoneNum: val,
    });
    phoneNumCallback(val);
  }

  render() {
    const { phoneNum } = this.state;
    const { codeTimeout, sendCodeCallback = () => {} } = this.props;
    return (
      <Fragment>
        {/* 手机号输入 start */}
        <div className={layout.phoneInput}>
          <Input mode='number' className={layout.input} value={phoneNum} placeholder="请输入手机号码" onChange={this.setPhoneNum} />
          {
            codeTimeout
              ? <div className={layout.countDown } >{codeTimeout}</div>
              : <div className={layout.sendCaptcha} onClick={sendCodeCallback}>发送验证码</div>
          }
        </div>
        {/* 手机号输入 end */}
        {/* 验证码 start */}
        <div className={layout.captchaInput}>
          <div className={layout['captchaInput-title']}>短信验证码</div>
            <CaptchaInput inputCallback={this.setCaptcha} />
         </div>
        {/* 验证码 end */}
      </Fragment>
    );
  }
}

export default PhoneInput;
