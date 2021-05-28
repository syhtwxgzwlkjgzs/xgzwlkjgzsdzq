import React from 'react';
import { inject } from 'mobx-react';

export default function HOCTencentCaptcha(Component) {
  @inject('site')
  class HOCTencentCaptchaComponent extends React.Component {
    captcha = null;
    constructor(props) {
      super(props);
    }

    showCaptcha = () => new Promise((resolve) => {
      // 验证码实例为空，则创建实例
      const { webConfig } = this.props.site;
      const qcloudCaptcha = webConfig?.qcloud?.qcloudCaptcha;
      const qcloudCaptchaAppId = webConfig?.qcloud?.qcloudCaptchaAppId;

      if (qcloudCaptcha) {
        import('@discuzq/sdk/dist/common_modules/sliding-captcha').then(({
          TencentCaptcha,
        }) => {
          if (!this.captcha) {
            this.captcha = new TencentCaptcha(qcloudCaptchaAppId, (res) => {
              if (res.ret === 0) {
                resolve({
                  captchaRandStr: res.randstr,
                  captchaTicket: res.ticket,
                });
              }
            });
          }
          // 显示验证码
          this.captcha.show();
        });
      }

      resolve({
        captchaRandStr: null,
        captchaTicket: null,
      });
    })

    render() {
      return <Component {...this.props} showCaptcha={this.showCaptcha} /> ;
    }
  }

  return HOCTencentCaptchaComponent;
}
