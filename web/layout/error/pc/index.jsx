import React from 'react';
import styles from './index.module.scss';
import {Icon,Button} from '@discuzq/design'
import Header from '@components/header';
import Copyright from '@components/copyright';
import Router from '@discuzq/sdk/dist/router';

export default function ErrorPage() {

  const onReflush = ()=>{
    window.location.reload()
  }

  return (
    <div className={styles.page}>
      <Header></Header>

      <div className={styles.body}>
      <img className={styles.icon} src='/dzq-img/error.png'/>
      <span className={styles.text}>服务器错误 SERVER ERROR</span>
      <Button onClick={onReflush} className={styles.button} type='primary'>点我刷新</Button>
      </div>

      <div className={styles.footer}>
        <Copyright></Copyright>
      </div>
    </div>
  );
}
