
import React from 'react';
import styles from './index.module.scss';
import Header from '@components/header';
import {Button} from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';
import isServer from '@common/utils/is-server';
import Copyright from '@components/copyright';

@inject('site')
@observer
class PCCloseSite extends React.Component {
  render() {
    const { site } = this.props;
    const { closeSiteConfig } = site;
    const height = isServer() ? '100vh' : `${window.innerHeight - 160}px`;
    return (
      <>
        <Header/>
        <div className={styles.page} style={{height: height}}>
          <img className={styles.img} src='/dzq-img/close.png'/>
          <h1 className={styles.main}>关闭已站点</h1>
          {closeSiteConfig && <p className={styles.sub}>{closeSiteConfig.detail}</p>}
          {false && <Button onClick={() => {Router.push({url: '/user/login'});}} size='large' className={styles.btn} type='primary'>管理员登录</Button>}
        </div>
        <Copyright center line/>
      </>
      
    );
  }
}


export default PCCloseSite;