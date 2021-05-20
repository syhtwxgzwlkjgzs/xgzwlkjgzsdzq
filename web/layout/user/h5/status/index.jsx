import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Input } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HomeHeader from '@components/home-header';
import Header from '@components/header';


@inject('site')
@inject('user')
@inject('thread')
@inject('commonLogin')
@observer
class StatusH5Page extends React.Component {
  render() {
    const { commonLogin, site, router } = this.props;
    const { platform } = site;
    const { statusCode, statusMsg } = router.query;
    return (
      <div className={platform === 'h5' ? '' : layout.pc_body_background}>
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
            this.props.router.push('login');
          }}>
            退出登录
          </Button>
        </div>
      </div>
      </div>
    );
  }
}

export default withRouter(StatusH5Page);
