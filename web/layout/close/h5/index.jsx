
import React from 'react';
import styles from './index.module.scss';
import Header from '@components/header';
import {Button} from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import Router from '@discuzq/sdk/dist/router';

@inject('site')
@observer
class H5CloseSite extends React.Component {
  render() {
    const { site } = this.props;
    const { closeSiteConfig } = site;
    return (
      <div className={styles.page}>
        <Header/>
        <img className={styles.img} src='/dzq-img/close.png'/>
        <h1 className={styles.main}>关闭已站点</h1>
        {closeSiteConfig && <p className={styles.sub}>{closeSiteConfig.detail}</p>}
        {false && <div className={styles.fixedBox}>
          <Button onClick={() => {Router.push({url: '/user/login'});}} size='large' className={styles.btn} type='primary'>管理员登录</Button>
        </div>}
      </div>
    );
  }
}


export default H5CloseSite;