import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import throttle from '@common/utils/thottle.js';
@inject('payBox')
@observer
export default class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newPayPwd: null,
      newPayPwdRepeat: null,
    }
  }

  componentDidMount() {
    this.props.payBox.clearPayPassword()
  }

  // 设置新密码
  handleChangeNewPwd = (e) => {
    this.props.payBox.newPayPwd = e.target.value
  }

  // 确认新密码
  handleChangeRepeatPwd = (e) => {
    this.props.payBox.newPayPwdRepeat = e.target.value
  }

  handleSubmit = throttle(() => {
    if (this.getDisabledWithButton()) return
    const newPayPwd = this.props.payBox?.newPayPwd
    const newPayPwdRepeat = this.props.payBox?.newPayPwdRepeat
    if (newPayPwd !== newPayPwdRepeat) {
      Toast.error({
        content: '两次密码输入有误',
        hasMask: false,
        duration: 1000,
      })
      this.props.payBox.clearPayPassword()
      return
    }
    this.props.payBox.resetPayPwd().then(res => {
      Toast.success({
        content: '修改密码成功',
        hasMask: false,
        duration: 1000,
      })
      Router.push({ url: `/my` })
      this.props.payBox.clearPayPassword()
    }).catch((err) => {
      Toast.error({
        content: '修改密码失败',
        hasMask: false,
        duration: 1000,
      })
      this.props.payBox.clearPayPassword()
    })
  }, 300)

  /**
  * 获取按钮禁用状态
  * @returns true 表示禁用 false表示不禁用
  */
  getDisabledWithButton = () => {
    const newPayPwd = this.props.payBox?.newPayPwd
    const newPayPwdRepeat = this.props.payBox?.newPayPwdRepeat
    return !newPayPwd || !newPayPwdRepeat || newPayPwd !== newPayPwdRepeat
  }

  render() {
    const newPayPwd = this.props.payBox?.newPayPwd
    const newPayPwdRepeat = this.props.payBox?.newPayPwdRepeat
    return (
      <div id={styles.resetPayPwdContent}>
        <Header />
        <div className={styles.content}>
          <h3>设置新密码</h3>
          <div className={styles.labelInfo}>
            <div className={styles.labelValue}>
              <Input value={newPayPwd} onChange={this.handleChangeNewPwd} mode="password" placeholder="请输入新密码" type="number" maxLength={6} />
            </div>
          </div>
          <div className={styles.labelInfo}>
            <div className={styles.labelValue}>
              <Input type="number" maxLength={6} value={newPayPwdRepeat} onChange={this.handleChangeRepeatPwd} mode="password" placeholder="请重复输入新密码" />
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <Button full disabled={this.getDisabledWithButton()} onClick={this.handleSubmit} type={"primary"} className={styles.btn}>提交</Button>
        </div>
      </div>
    )
  }
}
