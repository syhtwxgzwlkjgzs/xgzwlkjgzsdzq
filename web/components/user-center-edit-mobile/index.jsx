import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss'
import HOCFetchSiteData from '../../middleware/HOCFetchSiteData'
import CaptchaInput from './captcha-input/index'
import VerifyCode from './verify-code/index'
import Router from '@discuzq/sdk/dist/router';

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
        if (this.state.interval != null) {
          clearInterval(this.state.interval)
        }
        this.setState({
          current_step: 'second',
          list: [],
          initTimeValue: null,
          initTime: 60,
          interval: null,
          initTimeText: '发送验证码',
          buttonDisabled: false
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
        Router.push({url: '/my'})
      }).catch((err) => {
        Toast.error({
          content: err.Message || '修改失败',
          hasMask: false,
          duration: 1000,
        })
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
      <div>
        <Header />
        <div className={styles.content}>
          <h3>{current_step === 'first' ? '验证旧手机' : '设置新手机'}</h3>
          <div className={styles.labelInfo}>
            {
              current_step === 'first' ? (
                <div>
                  <span className={styles.labelName}>原手机号</span>
                  <span className={styles.labelValue}>{mobile}</span>
                </div>
              ) : (
                <div className={styles.labelInput}>
                  <Input placeholder="输入新手机号码" onChange={this.handleInputChange} focus={true} onBlur={this.handleInputBlur} onFocus={this.handleInputFocus} value={bind_mobile} />
                </div>
              )
            }
            <div>
              <VerifyCode initTimeValue={this.state.initTimeValue} value_pass_check={value_pass_check} key={current_step} text={"发送验证码"} getVerifyCode={this.getVerifyCode} />
            </div>
          </div>
          <div className={styles.bindCode}>
            <span>请输入短信验证码</span>
            <CaptchaInput current_step={current_step} updatePwd={this.updatePwd} list={list} is_blur={is_blur} />
          </div>
        </div>
        <div className={styles.bottom}>
          <Button full disabled={isSubmit} onClick={this.handleStepBtn} type={"primary"} className={styles.btn}>{this.state.current_step === 'first' ? "下一步" : '提交'}</Button>
        </div>
      </div>
    )
  }
}

export default HOCFetchSiteData(index)
