import React, { Component } from 'react'
import UserCenterEditHeader from '../../user-center-edit-header/index'
import { Button, Icon } from '@discuzq/design';
import styles from './index.module.scss';
import Avatar from '@components/avatar';
import { inject, observer } from 'mobx-react';
@inject('user')
@observer
export default class index extends Component {

  constructor(props) {
    super(props)
    this.user = this.props.user || {}
  }

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
              <div>{this.user.nickname}</div>
            </div>
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>用户名</label>
              <div>{this.user.username}</div>
            </div>
          </div>
          <div className={styles.userCenterEditItem}>
            <div className={styles.userCenterEditLabel}>
              <label>手机号码</label>
              <div>{this.user.mobile}</div>
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
              <div className={styles.userCenterEditWeChat}>{
                this.user.unionid ? <>
                  <Avatar size="small" image={this.user.avatarUrl} name={this.user.username} /> <span>{this.user.nickname}（解绑）</span>
                </> : '暂未绑定'
              }</div>
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
