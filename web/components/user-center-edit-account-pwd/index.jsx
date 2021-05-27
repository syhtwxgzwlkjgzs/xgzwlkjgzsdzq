import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
import throttle from '@common/utils/thottle.js';
@inject('user')
@observer
class index extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.user.clearUserAccountPassword()
  }

  // 点击忘记密码
  handleResetPwd = () => {
    Router.push({ url: '/user/reset-password' })
  }

  // 输入旧密码
  handleSetOldPwd = (e) => {
    this.props.user.oldPassword = e.target.value
  }

  // 设置账户密码
  handleSetPwd = (e) => {
    this.props.user.newPassword = e.target.value
  }

  // 确认新密码
  hadleNewPasswordRepeat = (e) => {
    this.props.user.newPasswordRepeat = e.target.value
  }

  // 点击提交
  handleSubmit = throttle(async () => {
    if (this.getDisabledWithButton()) return
    const newPassword = this.props.user?.newPassword
    const newPasswordRepeat = this.props.user?.newPasswordRepeat
    if (newPassword !== newPasswordRepeat) {
      Toast.error({
        content: '两次密码输入有误',
        hasMask: false,
        duration: 1000,
      })
      this.props.user.clearUserAccountPassword()
      return
    }
    if (this.props.user.hasPassword) {
      this.props.user.resetUserPassword().then(res => {
        Toast.success({
          content: '修改密码成功',
          hasMask: false,
          duration: 1000,
        })
        Router.back()
        this.props.user.clearUserAccountPassword()
      }).catch((err) => {
        Toast.error({
          content: err.Message || '修改密码失败, 请重新设置',
          hasMask: false,
          duration: 1000,
        })
        this.props.user.clearUserAccountPassword()
      })
    } else {
      this.props.user.setUserPassword().then(res => {
        Toast.success({
          content: '设置密码成功',
          hasMask: false,
          duration: 1000,
        })
        Router.back()
        this.props.user.clearUserAccountPassword()
      }).catch((err) => {
        Toast.error({
          content: err.Message || '设置密码失败, 请重新设置',
          hasMask: false,
          duration: 1000,
        })
        this.props.user.clearUserAccountPassword()
      })
    }
  }, 300)

  // 渲染未设置密码
  renderHasNoPassword = () => {
    return (
      <>
        <h3>设置密码</h3>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input onChange={this.handleSetPwd} mode="password" placeholder="请设置密码" value={this.props.user?.newPassword} /></div>
        </div>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input mode="password" placeholder="请确认密码" value={this.props.user?.newPasswordRepeat} onChange={this.hadleNewPasswordRepeat} /></div>
        </div>
      </>
    )
  }

  // 渲染已设置密码
  renderHasPassword = () => {
    return (
      <>
        <h3>修改密码</h3>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input value={this.props.user?.oldPassword} onChange={this.handleSetOldPwd} mode="password" placeholder="请输入旧密码" /></div>
        </div>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input value={this.props.user?.newPassword} onChange={this.handleSetPwd} mode="password" placeholder="请输入新密码" /></div>
        </div>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input onChange={this.hadleNewPasswordRepeat} mode="password" value={this.props.user?.newPasswordRepeat} placeholder="请重复输入新密码" /></div>
        </div>
      </>
    )
  }

  /**
   * 获取禁用按钮状态
   * @returns true 表示禁用 false 表示不禁用
   */
  getDisabledWithButton = () => {
    const oldPassword = this.props.user?.oldPassword
    const newPassword = this.props.user?.newPassword
    const newPasswordRepeat = this.props.user?.newPasswordRepeat
    let isSubmit = false
    if (this.props.user?.hasPassword) {
      isSubmit = !oldPassword || !newPassword || !newPasswordRepeat || newPassword !== newPasswordRepeat
    } else {
      isSubmit = (!newPassword || !newPasswordRepeat)
    }
    return isSubmit
  }

  render() {
    return (
      <div id={styles.accountPwdContent}>
        <Header />
        <div className={styles.content}>
          {this.props.user?.hasPassword ? this.renderHasPassword() : this.renderHasNoPassword()}
        </div>
        {
          this.props.user?.hasPassword && (
            <div onClick={this.handleResetPwd} className={styles.tips}>忘记旧密码？</div>
          )
        }
        <div className={styles.bottom}>
          <Button full onClick={this.handleSubmit} disabled={this.getDisabledWithButton()} type={"primary"} className={styles.btn}>提交</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(index)
