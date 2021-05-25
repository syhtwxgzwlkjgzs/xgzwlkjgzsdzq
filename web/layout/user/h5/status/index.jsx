import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Input } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import clearLoginStatus from '@common/utils/clear-login-status';
import Header from '@components/header';
import layout from './index.module.scss';
import PcBodyWrap from '../components/pc-body-wrap';


@inject('site')
@inject('user')
@inject('thread')
@inject('commonLogin')
@observer
class StatusH5Page extends React.Component {
  componentDidMount() {
    const { router, commonLogin } = this.props;
    const { statusCode } = router.query;
    if (statusCode === '2') {
      this.timer = setInterval(() => {
        if (commonLogin.statusCountDown === 0) {
          window.location.replace('/');
          clearInterval(this.timer);
          return;
        }
        commonLogin.setStatusCountDown(commonLogin.statusCountDown - 1);
      }, 1000)
    }
  }

  componentWillUnmount() {
    this.props.commonLogin.setStatusCountDown(5);
    clearInterval(this.timer);
  }

  render() {
    const { commonLogin, site, router } = this.props;
    const { platform } = site;
    const { statusCode, statusMsg } = router.query;
    return (
      <PcBodyWrap>
      <div className={platform === 'h5' ? layout.container : layout.pc_container}>
        {
          platform === 'h5'
            ? <HomeHeader hideInfo mode='login'/>
            : <Header/>
        }
        <div className={platform === 'h5' ? layout.content : layout.pc_content}>
          <div className={platform === 'h5' ? layout.icon : layout.pc_icon}>
            <img className={layout.icon__img} src='/dzq-img/login-status.jpg' alt=""/>
          </div>
          <div className={platform === 'h5' ? layout.functionalRegion : layout.pc_functionalRegion}>
              <span>
                { commonLogin.statusMessage || (statusCode && commonLogin.setStatusMessage(statusCode, statusMsg)) }
              </span>
          </div>
          <Button className={platform === 'h5' ? layout.button : layout.pc_button } type="primary" onClick={() => {
            clearLoginStatus(); // 清除登录态
            window.location.replace('/');
          }}>
            {
              statusCode === '2'
                ? `跳转到首页${commonLogin.statusCountDown ? `（倒计时 ${commonLogin.statusCountDown} s）` : ''}`
                : '退出登录'
            }
          </Button>
        </div>
      </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(StatusH5Page);
