import React, { Component } from 'react';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import UserCenterHeaderImage from '@components/user-center-header-images';
import { Button, Icon } from '@discuzq/design';

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
        {/* middle */}
        <div className={styles.userCenterEditMiddle}>
          <h3>个人信息</h3>
          <div className={styles.userCenterEditLabel}>
            <label>昵称</label>
            <div>Users</div>
          </div>
          <div className={styles.userCenterEditLabel}>
            <label>用户名</label>
            <div>Users</div>
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>手机号码</label>
              <div>182****420</div>
            </div>
            <div><Icon name="RightOutlined" /></div>
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>账户密码</label>
              <div>修改</div>
            </div>
            <div><Icon name="RightOutlined" /></div>
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>支付密码</label>
              <div>修改</div>
            </div>
            <div><Icon name="RightOutlined" /></div>
          </div>
          <div className={styles.userCenterEditLabel} style={{border:'none'}}>
            <label>微信</label>
            <div><img /> Users（解绑）</div>
          </div>
        </div>
        {/* bottom */}
        <div className={styles.userCenterEditBottom}>

        </div>
      </>
    )
  }
}
