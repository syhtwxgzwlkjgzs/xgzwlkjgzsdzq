import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss';
import CaptchaInput from './captcha-input/index';
import VerifyCode from './verify-code/index';
import Router from '@discuzq/sdk/dist/router';
import { View, Text } from '@tarojs/components';

@inject('site')
@inject('user')
@observer
class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      current_step: 'first', // 表示当前步骤
      bind_mobile: null,
      is_blur: false, // 表示是否失焦
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
  handleStepBtn = async () => {
    const { list = [], current_step, bind_mobile } = this.state
    if (list.length !== 6) return
    if (current_step === 'first') {
      this.props.user.oldMobileVerifyCode = list.join("")
      this.props.user.verifyOldMobile().then(res => {
        this.setState({
          current_step: 'second',
          list: []
        })
      }).catch((err) => {
        Toast.error({
          content: err.Message || '验证失败',
          hasMask: false,
          duration: 1000,
        })
        this.props.user.oldMobileVerifyCode = null
      })
    } else if (current_step === 'second') {
      this.props.user.newMobile = bind_mobile
      this.props.user.newMobileVerifyCode = list.join("")
      await this.props.user.rebindMobile().then(res => {
        Router.back()
      }).catch({
        content: err.Message || '修改失败',
        hasMask: false,
        duration: 1000,
      })
    }


  }

  handleInputChange = (e) => {
    this.setState({
      bind_mobile: e.target.value
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

  getVerifyCode = ({ calback }) => {
    const { originalMobile } = this.props.user
    const { current_step } = this.state
    if (current_step === 'first') {
      this.props.user.sendSmsVerifyCode({ mobile: originalMobile })
        .then(res => {
          this.setState({
            initTimeValue: res.interval
          })
          if (calback && typeof calback === 'function') calback()
        })
        .catch((err) => {
          console.log(err);
          Toast.error({
            content: '发送验证码失败',
            hasMask: false,
            duration: 1000,
          })
          this.setState({
            list: []
          })
          if (calback && typeof calback === 'function') calback(err)
        })
    } else if (current_step === 'second') {
      const { bind_mobile } = this.state
      this.props.user.sendSmsUpdateCode({ mobile: bind_mobile })
        .then(res => {
          this.setState({
            initTimeValue: res.interval
          })
          if (calback && typeof calback === 'function') calback()
        })
        .catch((err) => {
          console.log(err);
          Toast.error({
            content: err.Message || '发送验证码失败',
            hasMask: false,
            duration: 1000,
          })
          if (calback && typeof calback === 'function') calback(err)
        })
    }
  }

  validateTel = (value) => {
    return (/^[1][3-9]\d{9}$/.test(value))
  }

  render() {
    const { current_step, list = [], is_blur, bind_mobile, initTimeValue } = this.state
    const { mobile } = this.props?.user
    let value_pass_check = current_step === 'second' ? this.validateTel(bind_mobile) : true
    let isSubmit = false
    if (current_step === 'first') {
      isSubmit = list.length !== 6
    } else if (current_step === 'second') {
      isSubmit = (list.length !== 6 || !this.validateTel(bind_mobile))
    }
    return (
      <View>
        <View className={styles.content}>
          <Text className={styles.setTtile}>{current_step === 'first' ? '验证旧手机' : '设置新手机'}</Text>
          <View className={styles.labelInfo}>
            {
              current_step === 'first' ? (
                <View>
                  <Text className={styles.labelName}>原手机号</Text>
                  <Text className={styles.labelValue}>{mobile}</Text>
                </View>
              ) : (
                <View className={styles.labelInput}>
                  <Input placeholder="输入新手机号码" onChange={this.handleInputChange} focus={true} onBlur={this.handleInputBlur} onFocus={this.handleInputFocus} value={bind_mobile} />
                </View>
              )
            }
            <View>
              <VerifyCode initTimeValue={this.state.initTimeValue} value_pass_check={value_pass_check} key={current_step} text={"发送验证码"} getVerifyCode={this.getVerifyCode} />
            </View>
          </View>
          <View className={styles.bindCode}>
            <Text>请输入短信验证码</Text>
            <CaptchaInput current_step={current_step} updatePwd={this.updatePwd} list={list} is_blur={is_blur} />
          </View>
        </View>
        <View className={styles.bottom}>
          <Button disabled={isSubmit} onClick={this.handleStepBtn} type={"primary"} className={styles.btn}>{this.state.current_step === 'first' ? "下一步" : '提交'}</Button>
        </View>
      </View>
    )
  }
}

export default index
