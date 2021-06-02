import React, { Component } from 'react';
import styles from './index.module.scss';
import { Avatar, Input, Icon, Dialog, Toast, Button } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import CaptchaInput from './captcha-input/index';
import Router from '@discuzq/sdk/dist/router';

@inject('user')
@observer
export default class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      list: [],
      currentStep: 'first', // 表示当前步骤
      bindMobile: null,
      isBlur: false, // 表示是否失焦
      initTimeValue: null,
      initTime: 60,
      interval: null,
      initTimeText: '发送验证码'
    }
  }

  initState = () => {
    this.setState({
      list: [],
      currentStep: 'first', // 表示当前步骤
      bindMobile: null,
      isBlur: false, // 表示是否失焦
      initTimeValue: null,
      initTime: 60,
      interval: null,
      initTimeText: '发送验证码'
    })
  }

  componentDidMount() {
    this.initState()
  }

  componentWillUnmount() {
    this.initState()
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
    const { list = [], currentStep, bindMobile } = this.state
    if (list.length !== 6) return
    if (currentStep === 'first') {
      this.props.user.oldMobileVerifyCode = list.join("")
      this.props.user.verifyOldMobile().then(res => {
        if (this.state.interval != null) {
          clearInterval(this.state.interval)
        }
        this.setState({
          currentStep: 'second',
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
        this.initState()
        this.props.user.oldMobileVerifyCode = null
      })
    } else if (currentStep === 'second') {
      this.props.user.newMobile = bindMobile
      this.props.user.newMobileVerifyCode = list.join("")
      await this.props.user.rebindMobile().then(res => {
        this.initState()
        // FIXME_:还差关闭弹窗回调
      }).catch((err) => {
        Toast.error({
          content: err.Message || '修改失败',
          hasMask: false,
          duration: 1000,
        })
        this.initState()
      })
    }
  }

  handleInputChange = (e) => {
    this.setState({
      bindMobile: e.target.value,
      isBlur: false
    })
  }

  handleInputFocus = (e) => {
    this.setState({
      isBlur: false
    })
  }

  handleInputBlur = (e) => {
    this.setState({
      isBlur: true
    })
  }

  getVerifyCode = ({ calback }) => {
    const { originalMobile } = this.props.user
    const { currentStep } = this.state
    if (currentStep === 'first') {
      this.props.user.sendSmsVerifyCode({ mobile: originalMobile })
        .then(res => {
          this.setState({
            initTimeValue: res.interval,
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
    } else if (currentStep === 'second') {
      const { bindMobile } = this.state
      console.log(bindMobile);
      this.props.user.sendSmsUpdateCode({ mobile: bindMobile })
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

  // 点击发送验证码
  handleGetVerifyCode = () => {
    const { buttonDisabled, currentStep, bindMobile } = this.state
    console.log(buttonDisabled,'ssss_buttonDisabled');
    if (buttonDisabled || (currentStep === 'second' && !this.validateTel(bindMobile))) return
    const calback = (err) => {
      if (err) {
        this.setState({
          buttonDisabled: false
        })
        return
      }
      const { initTimeValue } = this.state
      this.setState({
        interval: setInterval(() => {
          const { initTime } = this.state
          this.setState({
            initTime: initTime - 1,
            initTimeText: initTime - 1,
            buttonDisabled: true
          })
          if (initTime === 0) {
            this.setState({
              initTime: initTimeValue,
              initTimeText: '重新获取',
              buttonDisabled: false
            })
            if (this.state.interval != null) {
              clearInterval(this.state.interval)
            }
          }
        }, 1000)
      })
    }
    this.getVerifyCode({ calback })
  }

  // 点击关闭
  handleClose = () => {
    this.initState();
    this.props.onClose();
  }

  render() {
    const mobile = this.props.user?.mobile
    const { currentStep, list = [], isBlur, bindMobile, initTimeValue, initTimeText } = this.state
    let value_pass_check = currentStep === 'second' ? this.validateTel(bindMobile) : true
    let isSubmit = false
    if (currentStep === 'first') {
      isSubmit = list.length !== 6
    } else if (currentStep === 'second') {
      isSubmit = (list.length !== 6 || !this.validateTel(bindMobile))
    }
    return (
      <div className={styles.userMobileWrapper}>
        <Dialog visible={this.props.visible} onClose={this.props.onClose}>
          <div className={styles.userMobileContent}>
            <div className={styles.title}>
              <span className={styles.titleValue}>修改手机号</span>
              <Icon onClick={this.handleClose} name="CloseOutlined"/>
            </div>
            <div className={styles.inputItem}>
              <div className={styles.labelName}>{currentStep === 'first' ? '验证旧手机' : '设置新手机'}</div>
              {
                currentStep === 'first' ? (
                  <Input value={mobile} />
                ) : (
                  <Input key={currentStep} placeholder="输入新手机号码" onChange={this.handleInputChange} focus={true} onBlur={this.handleInputBlur} onFocus={this.handleInputFocus} value={bindMobile} />
                )
              }
              <div className={styles.labelValue}>
                <div onClick={this.handleGetVerifyCode} className={styles.sendCaptcha}>
                  {initTimeValue ? `${initTimeText}` : '发送验证码'}
                </div>
              </div>
            </div>
            <div className={styles.inputItem}>
              <div className={styles.labelName}>请输入短信验证码</div>
              <CaptchaInput currentStep={currentStep} updatePwd={this.updatePwd} list={list} isBlur={isBlur} />
            </div>
            <div className={styles.bottom}>
              <Button disabled={isSubmit} onClick={this.handleStepBtn} type={"primary"} className={styles.btn}>{this.state.currentStep === 'first' ? "下一步" : '提交'}</Button>
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}
