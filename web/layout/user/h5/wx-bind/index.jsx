import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import WeiXinOrCode from '@common/module/h5/WeixinOrCode';
import HeaderLogin from '@common/module/h5/HeaderLogin';
@inject('site')
@inject('user')
@inject('thread')
@observer
class WeixinBindH5Page extends React.Component {
  render() {
    return (
      <div className={layout.container}>
          <HeaderLogin/>
          <div className={layout.content}>
              <div className={layout.title}>绑定微信号</div>
              <div className={layout.tips}>
              <img src="/user.png" alt=""/>
              小虫，请绑定您的微信
              </div>
              {/* 二维码 start */}
              <WeiXinOrCode orCodeImg='/login-ORcode.png' orCodeTips='长按保存二维码，并在微信中识别此二维码，即可绑定微信，并继续访问'/>
              {/* 二维码 end */}
          </div>
      </div>
    );
  }
}

export default withRouter(WeixinBindH5Page);
