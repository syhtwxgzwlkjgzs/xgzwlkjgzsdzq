import React, { Component } from 'react'
import UserCenterEditHeader from '../../user-center-edit-header/index'
import { Button, Icon } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
export default class index extends Component {
  render() {
    return (
      <div>
        {/* 头部 */}
        <div><UserCenterEditHeader /></div>
        {/* middle */}
        <div className={styles.userCenterEditMiddle}>
          <h3>个人信息</h3>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>昵称</label>
              <div>Users</div>
            </div>
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>用户名</label>
              <div>Users</div>
            </div>
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
          <div className={styles.userCenterEditItem} style={{ border: 'none' }}>
            <div className={styles.userCenterEditLabel}>
              <label>微信</label>
              <div className={styles.userCenterEditWeChat}><Avatar size="small" /> <span>Users（解绑）</span></div>
            </div>
          </div>
        </div>
        {/* bottom */}
        <div className={styles.userCenterEditBottom}>
          <h3>实名认证</h3>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>申请实名认证</label>
              <div>去认证</div>
            </div>
            <div><Icon name="RightOutlined" /></div>
          </div>
          <div className={styles.userCenterEditBtn}>
            <Button>取消</Button>
            <Button type="primary">保存</Button>
          </div>
        </div>
      </div>
    )
  }
}
