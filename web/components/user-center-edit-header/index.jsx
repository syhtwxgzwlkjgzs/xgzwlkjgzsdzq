import React, { Component } from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import UserCenterHeaderImage from '@components/user-center-header-images';
import { Icon } from '@discuzq/design';

export default class index extends Component {
  render() {
    return (
      <>
        <div className={styles.userCenterEditHeader}>
          <UserCenterHeaderImage />
          <div className={styles.headImgBox}>
            <Avatar size='big' />
          </div>
          {/* 编辑修改说明 */}
          <div className={styles.userCenterEditDec}>
            <Icon name="CompileOutlined" />
            <span className={styles.text}>不会开飞机的程序员，不是一个好的摄影师不会开飞机的程序员，不是一个好的摄影师不会开飞机的程序员，不是一个好的摄影师不会开飞机的程序员，不是一个好的摄影师</span>
          </div>
        </div>
      </>
    )
  }
}
