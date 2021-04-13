import React, { Fragment } from 'react';
import layout from './index.module.scss';
import { Input } from '@discuzq/design';
import '@discuzq/design/styles/index.scss';


class PhoneInput extends React.Component {
  render() {
    return (
      <Fragment>
        {/* 手机号输入 start */}
        <div className={layout.phoneInput}>
          <Input className={layout.input} value='' placeholder="请输入手机号码" onChange={(e) => {
            console.log(e.target.value);
          }} />
          <div className={layout.sendCaptcha} onChange={() => {
            console.log('发送验证码');
          }}>发送验证码</div>
        </div>
        {/* 手机号输入 end */}
        {/* 验证码 start */}
        <div className={layout.captchaInput}>
          <div className={layout['captchaInput-title']}>短信验证码</div>
          <div>
            <Input className={layout['captchaInput-input']} value='' maxLength={1} onChange={(e) => {
              console.log(e.target.value);
            }} />
            <Input className={layout['captchaInput-input']} value='' maxLength={1} onChange={(e) => {
              console.log(e.target.value);
            }} />
            <Input className={layout['captchaInput-input']} value='' maxLength={1} onChange={(e) => {
              console.log(e.target.value);
            }} />
            <Input className={layout['captchaInput-input']} value='' maxLength={1} onChange={(e) => {
              console.log(e.target.value);
            }} />
            <Input className={layout['captchaInput-input']} value='' maxLength={1} onChange={(e) => {
              console.log(e.target.value);
            }} />
            <Input className={layout['captchaInput-input']} value='' maxLength={1} onChange={(e) => {
              console.log(e.target.value);
            }} />
          </div>
        </div>
        {/* 验证码 end */}
      </Fragment>
    );
  }
}

export default PhoneInput;
