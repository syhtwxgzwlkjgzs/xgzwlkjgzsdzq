import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import layout from './index.module.scss';
import { Button } from '@discuzq/design';
import '@discuzq/design/styles/index.scss';
import HeaderLogin from '@common/module/h5/HeaderLogin';


@inject('site')
@inject('user')
@inject('thread')
@observer
class WeixinWithin extends React.Component {
  render() {
    return (
        <div className={layout.container}>
            <HeaderLogin/>
            <div className={layout.content}>
                <div className={layout.title}>绑定微信号</div>
                <div className={layout.tips}>
                微信用户
                <img src="/user.png" alt=""/>
                小虫，请选择您要进行的操作
                </div>
                <Button className={layout.button} type="primary" onClick={() => {
                  console.log('使用用户名密码登录，并绑定微信');
                }}>
                  使用用户名密码登录，并绑定微信
                </Button>
                <Button className={layout.button} type="primary" onClick={() => {
                  console.log('创建新账号');
                }}>
                  创建新账号
                </Button>
            </div>
        </div>
    );
  }
}

export default withRouter(WeixinWithin);
