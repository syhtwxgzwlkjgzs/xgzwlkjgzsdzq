import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import Button from '@discuzq/design/dist/components/button/index';
import Input from '@discuzq/design/dist/components/input/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Header from '@components/header';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import { View, Text } from '@tarojs/components';

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
    Router.push({ url: '/user/reset-password/index' })
  }

  // 输入旧密码
  handleSetOldPwd = (e) => {
    this.setState({
      oldPassword: e.target.value
    })
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
    const { oldPassword, newPassword, newPasswordRepeat } = this.state
    if (newPassword !== newPasswordRepeat) {
      Toast.error({
        content: '两次密码输入有误',
        hasMask: false,
        duration: 1000,
      })
      return
    }
    this.props.user.oldPassword = oldPassword
    this.props.user.newPassword = newPassword
    this.props.user.newPasswordRepeat = newPasswordRepeat
    if (this.props.user.hasPassword) {
      this.props.user.resetUserPassword().then(res => {
        Toast.success({
          content: '修改密码成功',
          hasMask: false,
          duration: 1000,
        })
        Router.back()
      }).catch((err) => {
        Toast.error({
          content: err.Message || '修改密码失败, 请重新设置',
          hasMask: false,
          duration: 1000,
        })
        this.props.user.newPassword = null
        this.props.user.newPasswordRepeat = null
        this.initState()
      })
    } else {
      this.props.user.setUserPassword().then(res => {
        Toast.success({
          content: '设置密码成功',
          hasMask: false,
          duration: 1000,
        })
        Router.back()
      }).catch((err) => {
        Toast.error({
          content: err.Message || '设置密码失败, 请重新设置',
          hasMask: false,
          duration: 1000,
        })
        this.props.user.oldPassword = null
        this.props.user.newPassword = null
        this.props.user.newPasswordRepeat = null
        this.initState()
      })
    }


  }

  // 渲染未设置密码
  renderHasNoPassword = () => {
    const { newPassword, newPasswordRepeat } = this.state
    return (
      <>
        <h3>设置密码</h3>
        <View className={styles.labelInfo}>
          <View className={styles.labelValue}>{this.props.user?.username}</View>
        </View>
        <View className={styles.labelInfo}>
          <View className={styles.labelValue}><Input onChange={this.handleSetPwd} mode="password" placeholder="请设置密码" value={newPassword} /></View>
        </View>
        <View className={styles.labelInfo}>
          <View onChange={this.hadleNewPasswordRepeat} className={styles.labelValue}><Input mode="password" placeholder="请确认密码" value={newPasswordRepeat} /></View>
        </View>
      </>
    )
  }

  // 渲染已设置密码
  renderHasPassword = () => {
    const { newPassword, newPasswordRepeat } = this.state
    return (
      <>
        <Text className={styles.setTitle}>修改密码</Text>
        <View className={styles.labelInfo}>
          <View className={styles.labelValue}>{this.props.user?.username}</View>
        </View>
        <View className={styles.labelInfo}>
          <View className={styles.labelValue}><Input onChange={this.handleSetOldPwd} mode="password" placeholder="请输入旧密码" /></View>
        </View>
        <View className={styles.labelInfo}>
          <View className={styles.labelValue}><Input value={newPassword} onChange={this.handleSetPwd} mode="password" placeholder="请输入新密码" /></View>
        </View>
        <View className={styles.labelInfo}>
          <View className={styles.labelValue}><Input onChange={this.hadleNewPasswordRepeat} mode="password" value={newPasswordRepeat} placeholder="请重复输入新密码" /></View>
        </View>
      </>
    )
  }

  render() {
    const { oldPassword, newPassword, newPasswordRepeat } = this.state
    let isSubmit = false
    if (this.props.user?.hasPassword) {
      isSubmit = !oldPassword || !newPassword || !newPasswordRepeat
    } else {
      isSubmit = (!newPassword || !newPasswordRepeat)
    }
    return (
      <View>
        <View className={styles.content}>
          {this.props.user?.hasPassword ? this.renderHasPassword() : this.renderHasNoPassword()}
        </View>
        <View onClick={this.handleResetPwd} className={styles.tips}>忘记旧密码？</View>
        <View className={styles.bottom}>
          <Button onClick={this.handleSubmit} disabled={isSubmit} type={"primary"} className={styles.btn}>提交</Button>
        </View>
      </View>
    )
  }
}

export default index
