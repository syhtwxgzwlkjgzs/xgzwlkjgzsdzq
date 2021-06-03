import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Dialog, Input, Toast, Icon } from '@discuzq/design';
import styles from '../index.module.scss';
import throttle from '@common/utils/thottle.js';

@inject('payBox')
@observer
class index extends Component {

  componentDidMount() {
    this.props.payBox.clearPayPassword()
  }

  // 设置新密码 newPayPwd
  handleChangeNewPwd = (e) => {
    this.props.payBox.newPayPwd = e.target.value
  }

  // 确认新密码 newPayPwdRepeat
  handleChangeRepeatPwd = (e) => {
    this.props.payBox.newPayPwdRepeat = e.target.value
  }

  // 点击确认 ---> 清空对应密码状态
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
      this.props.payBox.clearPayPassword()
      this.props.onClose()
    }).catch((err) => {
      console.log(err);
      Toast.error({
        content: err.Msg || '修改密码失败',
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
    return !newPayPwd || !newPayPwdRepeat
  }

  render() {
    const newPayPwd = this.props.payBox?.newPayPwd
    const newPayPwdRepeat = this.props.payBox?.newPayPwdRepeat
    return (
      <>
        <div className={styles.inputItem}>
          <Input maxLength={6} trim value={newPayPwd} onChange={this.handleChangeNewPwd} mode="password" placeholder="请输入新密码" />
        </div>
        <div className={styles.inputItem}>
          <Input maxLength={6} trim value={newPayPwdRepeat} onChange={this.handleChangeRepeatPwd} mode="password" placeholder="请重复输入新密码" />
        </div>
        <div className={styles.bottom}>
          <Button disabled={this.getDisabledWithButton()} onClick={this.handleSubmit} type={"primary"} className={styles.btn}>提交</Button>
        </div>
      </>
    )
  }
}

export default index
