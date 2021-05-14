import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
@inject('user')
@observer
class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      oldPassword: null, // 旧密码
      newPassword: null, // 新密码
      newPasswordRepeat: null, // 确认密码
    }
  }

  initState = () => {
    this.setState({
      oldPassword: null, // 旧密码
      newPassword: null, // 新密码
      newPasswordRepeat: null, // 确认密码
    })
  }

  componentDidMount() {
    this.initState()
  }

  componentWillUnmount() {
    this.initState()
  }

  // 点击忘记密码
  handleResetPwd = () => {
    Router.push({ url: '/user/reset-password' })
  }

  // 设置账户密码
  handleSetPwd = (e) => {
    this.setState({
      newPassword: e.target.value
    })
  }

  // 确认新密码
  hadleNewPasswordRepeat = (e) => {
    this.setState({
      newPasswordRepeat: e.target.value
    })
  }

  // 点击提交
  handleSubmit = async () => {
    const { newPassword, newPasswordRepeat } = this.state
    if (newPassword !== newPasswordRepeat) {
      Toast.error({
        content: '两次密码输入有误',
        hasMask: false,
        duration: 1000,
      })
      return
    }
    this.props.user.newPassword = newPassword
    this.props.user.newPasswordRepeat = newPasswordRepeat
    this.props.user.setUserPassword().then(res => {
      Toast.success({
        content: '设置密码成功',
        hasMask: false,
        duration: 1000,
      })
      Router.back()
    }).catch((err) => {
      Toast.error({
        content: '设置密码失败, 请重新设置',
        hasMask: false,
        duration: 1000,
      })
      this.props.user.newPassword = null
      this.props.user.newPasswordRepeat = null
      this.initState()
    })

  }

  // 渲染未设置密码
  renderHasNoPassword = () => {
    const { username } = this.props.user
    const { newPassword, newPasswordRepeat } = this.state
    console.log('重新渲染了 render');
    return (
      <>
        <h3>设置密码</h3>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}>{username}</div>
        </div>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input maxLength={20} onChange={this.handleSetPwd} mode="password" placeholder="请设置密码" value={newPassword} /></div>
        </div>
        <div className={styles.labelInfo}>
          <div onChange={this.hadleNewPasswordRepeat} className={styles.labelValue}><Input mode="password" maxLength={20} placeholder="请确认密码" value={newPasswordRepeat} /></div>
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
          <div className={styles.labelValue}>{username}</div>
        </div>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input mode="password" placeholder="请输入旧密码" /></div>
        </div>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input mode="password" placeholder="请输入新密码" /></div>
        </div>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input mode="password" placeholder="请重复输入新密码" /></div>
        </div>
      </>
    )
  }

  render() {
    const { hasPassword } = this.props.user
    const { newPassword, newPasswordRepeat } = this.state
    let isSubmit = !newPassword || !newPasswordRepeat
    return (
      <div>
        <Header />
        <div className={styles.content}>
          {hasPassword ? this.renderHasPassword() : this.renderHasNoPassword()}
        </div>
        <div onClick={this.handleResetPwd} className={styles.tips}>忘记旧密码？</div>
        <div className={styles.bottom}>
          <Button onClick={this.handleSubmit} disabled={isSubmit} type={"primary"} className={styles.btn}>提交</Button>
        </div>
      </div>
    )
  }
}

export default withRouter(index)
