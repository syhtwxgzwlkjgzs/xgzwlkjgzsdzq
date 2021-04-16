import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import WeiXinOrCode from '@common/module/h5/WeixinOrCode';
import HeaderLogin from '@common/module/h5/HeaderLogin';

@inject('site')
@inject('user')
@inject('h5QrCode')
@observer
class WeixinOuter extends React.Component {
  async componentDidMount() {
    await this.props.h5QrCode.generate({ params: { type: 'mobile_browser_login', redirectUri: `${this.props.site}/user/weixin-register` } });
  }

  render() {
    return (
      <div className={layout.container}>
          <HeaderLogin/>
          <div className={layout.content}>
              <div className={layout.title}>绑定微信号</div>
              <div className={layout.tips}>
              <img src="/user.png" alt=""/>
              {/* todo 小虫替换为用户名*/}
              小虫，请绑定您的微信
              </div>
              {/* 二维码 start */}
              <WeiXinOrCode orCodeImg={this.props.h5QrCode.qrCode} orCodeTips='长按保存二维码，并在微信中识别此二维码，即可绑定微信，并继续访问'/>
              {/* 二维码 end */}
          </div>
      </div>
    );
  }
}

export default withRouter(WeixinOuter);
