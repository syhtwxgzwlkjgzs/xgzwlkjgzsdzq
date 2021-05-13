import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from '../index.module.scss';

export default class index extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className={styles.content}>
          <h3>设置新密码</h3>
          <div className={styles.labelInfo}>
            <div className={styles.labelValue}>
              <Input mode="password" placeholder="请输入新密码" />
            </div>
          </div>
          <div className={styles.labelInfo}>
            <div className={styles.labelValue}>
              <Input mode="password" placeholder="请再次确认新密码" />
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <Button type={"primary"} className={styles.btn}>确定</Button>
        </div>
      </div>
    )
  }
}
