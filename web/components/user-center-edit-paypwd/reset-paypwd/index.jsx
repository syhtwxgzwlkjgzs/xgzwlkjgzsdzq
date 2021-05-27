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

  initState = () => {
    this.setState({
      newPayPwd: null,
      newPayPwdRepeat: null,
    })
    this.props.payBox.newPayPwd = null
    this.props.payBox.newPayPwdRepeat = null
  }

  componentDidMount() {
    this.initState()
  }

  componentWillUnmount() {
    this.initState()
  }

  // 设置新密码
  handleChangeNewPwd = (e) => {
    this.setState({
      newPayPwd: e.target.value
    }, () => {
      this.props.payBox.newPayPwd = e.target.value
    })
  }

  // 确认新密码
  handleChangeRepeatPwd = (e) => {
    this.setState({
      newPayPwdRepeat: e.target.value
    }, () => {
      this.props.payBox.newPayPwdRepeat = e.target.value
    })
  }

  handleSubmit = throttle(() => {
    const { newPayPwd, newPayPwdRepeat } = this.state
    if (newPayPwd !== newPayPwdRepeat) {
      Toast.error({
        content: '两次密码输入有误',
        hasMask: false,
        duration: 1000,
      })
      this.initState()
      return
    }
    this.props.payBox.resetPayPwd().then(res => {
      Toast.success({
        content: '修改密码成功',
        hasMask: false,
        duration: 1000,
      })
      Router.push({ url: `/my` })
    }).catch((err) => {
      Toast.error({
        content: '修改密码失败',
        hasMask: false,
        duration: 1000,
      })
      this.initState()
    })
  }, 300)

  render() {
    const { newPayPwd, newPayPwdRepeat } = this.state
    let isSubmit = !newPayPwd || !newPayPwdRepeat
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
          <Button full disabled={isSubmit} onClick={this.handleSubmit} type={"primary"} className={styles.btn}>提交</Button>
        </div>
      </div>
    )
  }
}
