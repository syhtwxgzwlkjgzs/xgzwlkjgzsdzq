import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Button from '@discuzq/design/dist/components/button/index';
import Input from '@discuzq/design/dist/components/input/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Header from '@components/header';
import styles from '../../index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import { View, Text } from '@tarojs/components';

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
    })
  }

  // 确认新密码
  handleChangeRepeatPwd = (e) => {
    this.setState({
      newPayPwdRepeat: e.target.value
    })
  }

  handleSubmit = () => {
    const { newPayPwd, newPayPwdRepeat } = this.state
    if (newPayPwd !== newPayPwdRepeat) {
      Toast.error({
        content: '两次密码输入有误',
        hasMask: false,
        duration: 1000,
      })
      return
    }
    this.props.payBox.newPayPwd = newPayPwd
    this.props.payBox.newPayPwdRepeat = newPayPwdRepeat
    this.props.payBox.resetPayPwd().then(res => {
      Toast.success({
        content: '修改密码成功',
        hasMask: false,
        duration: 1000,
      })
      Router.push({url: `/my/index`})
    }).catch((err) => {
      Toast.error({
        content: '修改密码失败',
        hasMask: false,
        duration: 1000,
      })
      this.initState()
    })
  }

  render() {
    const { newPayPwd, newPayPwdRepeat } = this.state
    let isSubmit = !newPayPwd || !newPayPwdRepeat
    return (
      <View>
        <View className={styles.content}>
          <Text className={styles.setTtile}>设置新密码</Text>
          <View className={styles.labelInfo}>
            <View className={styles.labelValue}>
              <Input value={newPayPwd} onChange={this.handleChangeNewPwd} mode="password" placeholder="请输入新密码" />
            </View>
          </View>
          <View className={styles.labelInfo}>
            <View className={styles.labelValue}>
              <Input value={newPayPwdRepeat} onChange={this.handleChangeRepeatPwd} mode="password" placeholder="请重复输入新密码" />
            </View>
          </View>
        </View>
        <View className={styles.bottom}>
          <Button disabled={isSubmit} onClick={this.handleSubmit} type={"primary"} className={styles.btn}>提交</Button>
        </View>
      </View>
    )
  }
}
