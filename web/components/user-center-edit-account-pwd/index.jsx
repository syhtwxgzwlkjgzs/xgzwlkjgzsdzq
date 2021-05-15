import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';

class index extends Component {

  handleResetPwd = () => {
    Router.push({url: '/user/reset-password'})
  }

  render() {
    return (
      <div>
        <Header />
        <div className={styles.content}>
          <h3>设置账户密码</h3>
          <div className={styles.labelInfo}>
            <div className={styles.labelValue}>加菲猫</div>
          </div>
          <div className={styles.labelInfo}>
            <div className={styles.labelValue}><Input mode="password" placeholder="输入原密码" /></div>
          </div>
          <div className={styles.labelInfo}>
            <div className={styles.labelValue}><Input mode="password" placeholder="设置新密码" /></div>
          </div>
          <div className={styles.labelInfo}>
            <div className={styles.labelValue}><Input mode="password" placeholder="确认新密码" /></div>
          </div>
        </div>
        <div onClick={this.handleResetPwd} className={styles.tips}>忘记密码？</div>
        <div className={styles.bottom}>
          <Button type={"primary"} className={styles.btn}>确定</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(index)
