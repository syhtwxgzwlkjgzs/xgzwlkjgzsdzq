import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import Header from '@components/header';
import {Button} from '@discuzq/design';
import isServer from '@common/utils/is-server';
import Router from '@discuzq/sdk/dist/router';
import Copyright from '@components/copyright';

@observer
class PCCloseSite extends React.Component {
  render() {
    const height = isServer() ? '100vh' : `${window.innerHeight - 160}px`;
    return (
      <div className={styles.body}>
        <Header/>
        <div className={styles.page} style={{height: height}}>
          <img className={styles.img} src='/dzq-img/404.png'/>
          <p className={styles.text}>您要访问的页面可能已被删除、已更改名称或暂时不可用</p>
          <Button onClick={() => {Router.back()}} size='large' className={styles.btn} type='primary'>返回上一页</Button>
        </div>
        <Copyright center line/>
      </div>
    );
  }
}


export default PCCloseSite;
