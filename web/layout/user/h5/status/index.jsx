import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Input } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HeaderLogin from '@common/module/h5/HeaderLogin';
import Index from '@common/components/thread/home-header';


@inject('site')
@inject('user')
@inject('thread')
@inject('userRegister')
@observer
class StatusH5Page extends React.Component {
  render() {
    return (
      <div className={layout.container}>
        {/* <Index /> */}
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.icon}>
            <img className={layout.icon__img} src='https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201408%2F30%2F20140830180834_XuWYJ.png&refer=http%3A%2F%2Fcdn.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620908425&t=673ddda42973b103faf179fc02818b41' alt=""/>
          </div>
          <div className={layout.functionalRegion}>
              <span>小虫，您的账号注册正在审核中，请耐心等待</span>
          </div>
          <Button className={layout.button} type="primary" onClick={() => {
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
