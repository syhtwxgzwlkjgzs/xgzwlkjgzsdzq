import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import Button from '@discuzq/design/dist/components/button/index';
import Input from '@discuzq/design/dist/components/input/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Header from '@components/header';
import styles from './index.module.scss';
import CaptchaInput from '../../../user-center-edit-mobile/captcha-input';
import VerifyCode from '../../../user-center-edit-mobile/verify-code';
import { View, Text } from '@tarojs/components';

@inject('site')
@observer
class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      current_step: 'second', // 表示当前步骤
      bind_mobile: null,
      is_blur: true, // 表示是否失焦
    }
  }

  updatePwd = (set_num, type) => {
    const { list = [] } = this.state;
    if (type == 'add') {
      let list_ = [...list];
      if (list.length >= 6) {
        list_ = list_.join('').substring(0, 5).split('');
      }
      this.setState(
        {
          list: [].concat(list_, [set_num]),
        },
        () => {
          if (this.state.list.length === 6) {
            // this.submitPwa();
          }
        },
      );
    } else if (type == 'delete') {
      this.setState({
        list: list.slice(0, list.length - 1),
      });
    }
  };

  // 点击下一步
  handleStepBtn = () => {
    this.setState({
      current_step: 'second',
      list: []
    })
  }

  handleInputChange = (e) => {
    this.setState({
      bind_mobile: e.target.value,
      is_blur: false
    })
  }

  handleInputFocus = (e) => {
    this.setState({
      is_blur: false
    })
  }

  handleInputBlur = (e) => {
    this.setState({
      is_blur: true
    })
  }

  handleInputFocus1 = () => {
    this.setState({
      is_blur: false
    })
  }

  handleInputBlur1 = (e) => {
    this.setState({
      is_blur: true
    })
  }

  getVerifyCode = ({ calback }) => {
    if (calback && typeof calback === 'function') calback()
  }

  render() {
    const { current_step, list = [], is_blur } = this.state
    return (
      <View>
        <View className={styles.content}>
          <Text className={styles.setTtile}>找回密码</Text>
          <View className={styles.labelInfo}>
            <View>
              <Text className={styles.labelName}>手机号</Text>
              <Text className={styles.labelValue} style={{ border: 'none' }}>18270****420</Text>
            </View>
            <View>
              <VerifyCode key={current_step} text={"发送验证码"} getVerifyCode={this.getVerifyCode} />
            </View>
          </View>
          <View className={styles.bindCode}>
            <Text>请输入短信验证码</Text>
            <CaptchaInput current_step={current_step} updatePwd={this.updatePwd} list={list} is_blur={is_blur} />
          </View>
        </View>
        <View className={styles.labelInfo}>
          <View className={styles.labelValue}><Input onChange={this.handleInputChange} onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} mode="password" placeholder="请输入新密码" /></View>
        </View>
        <View className={styles.labelInfo}>
          <View className={styles.labelValue}><Input onFocus={this.handleInputFocus1} onChange={this.handleInputChange1} onBlur={this.handleInputBlur1} mode="password" placeholder="请重复输入新密码" /></View>
        </View>
        <View className={styles.bottom}>
          <Button onClick={this.handleStepBtn} type={"primary"} className={styles.btn}>提交</Button>
        </View>
      </View>
    )
  }
}

export default index
