import React from 'react';
import styles from './index.module.scss';
import Header from '@components/header';
import {Button} from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';
class H5500Page extends React.Component {
  render() {
    return (
      <div className={styles.page}>
        <Header/>
        <img className={styles.img} src='/dzq-img/error.png'/>
        <p className={styles.text}>服务器错误 SERVER ERROR</p>
        <div className={styles.fixedBox}>
          <Button onClick={() => {Router.redirect({url: '/500'});}} size='large' className={styles.btn} type='primary'>回到首页</Button>
        </div>
      </div>
    );
  }
}


export default H5500Page;
