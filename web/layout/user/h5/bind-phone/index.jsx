import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HeaderLogin from '@common/module/h5/HeaderLogin';
import PhoneInput from '@common/module/h5/PhoneInput/index';


@inject('site')
@inject('user')
@inject('thread')
@inject('userRegister')
@observer
class BindPhoneH5Page extends React.Component {
  render() {
    return (
      <div className={layout.container}>
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.title}>绑定手机号</div>
          <div className={layout.tips}>
            请绑定您的手机号
          </div>
          <PhoneInput/>
          <Button className={layout.button} type="primary" onClick={() => {
            console.log('下一步');
          }}>
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
