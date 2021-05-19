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
      current_step: 'first', // 表示当前步骤
      bind_mobile: null,
      is_blur: false, // 表示是否失焦
      initTimeValue: null,
      initTime: 60,
      interval: null,
      initTimeText: '发送验证码'
    }
  }

  initState = () => {
    this.setState({
      list: [],
      current_step: 'first', // 表示当前步骤
      bind_mobile: null,
      is_blur: false, // 表示是否失焦
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
        this.initState()
        this.props.user.oldMobileVerifyCode = null
      })
    } else if (current_step === 'second') {
      this.props.user.newMobile = bind_mobile
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

  getVerifyCode = ({ calback }) => {
    const { originalMobile } = this.props.user
    const { current_step } = this.state
    if (current_step === 'first') {
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
    } else if (current_step === 'second') {
      const { bind_mobile } = this.state
      console.log(bind_mobile);
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

  // 点击发送验证码
  handleGetVerifyCode = () => {
    const { buttonDisabled, current_step, bind_mobile } = this.state
    console.log(buttonDisabled,'ssss_buttonDisabled');
    if (buttonDisabled || (current_step === 'second' && !this.validateTel(bind_mobile))) return
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
    this.initState()
  }

  render() {
    const mobile = this.props.user?.mobile
    const { current_step, list = [], is_blur, bind_mobile, initTimeValue, initTimeText } = this.state
    let value_pass_check = current_step === 'second' ? this.validateTel(bind_mobile) : true
    let isSubmit = false
    if (current_step === 'first') {
      isSubmit = list.length !== 6
    } else if (current_step === 'second') {
      isSubmit = (list.length !== 6 || !this.validateTel(bind_mobile))
    }
    return (
      <div className={styles.userMobileWrapper}>
        <Dialog visible={true}>
          <div className={styles.userMobileContent}>
            <div className={styles.title}>
              <span className={styles.titleValue}>修改手机号</span>
              <Icon onClick={this.handleClose} name="CloseOutlined" />
            </div>
            <div className={styles.inputItem}>
              <div className={styles.labelName}>{current_step === 'first' ? '验证旧手机' : '设置新手机'}</div>
              {
                current_step === 'first' ? (
                  <Input value={mobile} />
                ) : (
                  <Input key={current_step} placeholder="输入新手机号码" onChange={this.handleInputChange} focus={true} onBlur={this.handleInputBlur} onFocus={this.handleInputFocus} value={bind_mobile} />
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
              <CaptchaInput current_step={current_step} updatePwd={this.updatePwd} list={list} is_blur={is_blur} />
            </div>
            <div className={styles.bottom}>
              <Button disabled={isSubmit} onClick={this.handleStepBtn} type={"primary"} className={styles.btn}>{this.state.current_step === 'first' ? "下一步" : '提交'}</Button>
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}
