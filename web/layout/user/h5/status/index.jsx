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
    const { commonLogin, site } = this.props;
    const { platform } = site;
    return (
      <div className={platform === 'h5' ? layout.container : layout.pc_container}>
        {
          platform === 'h5'
            ? <HomeHeader hideInfo/>
            : <Header/>
        }
        <div className={platform === 'h5' ? layout.content : layout.pc_content}>
          <div className={platform === 'h5' ? layout.icon : layout.pc_icon}>
            <img className={layout.icon__img} src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201408%2F30%2F20140830180834_XuWYJ.png&refer=http%3A%2F%2Fcdn.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620908425&t=673ddda42973b103faf179fc02818b41' alt=""/>
          </div>
          <div className={platform === 'h5' ? layout.functionalRegion : layout.pc_functionalRegion}>
              <span>{commonLogin.statusMessage}</span>
          </div>
          <Button className={platform === 'h5' ? layout.button : layout.pc_button } type="primary" onClick={() => {
            console.log('退出登录');
          }}>
            退出登录
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(StatusH5Page);
