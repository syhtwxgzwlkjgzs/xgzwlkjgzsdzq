import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Dialog, Input, Toast, Icon } from '@discuzq/design';
import styles from './index.module.scss';
import CaptchaInput from '../../user-center-edit-mobile-pc/captcha-input/index'

@inject('user')
@observer
export default class index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newPayPwd: null,
      newPayPwdRepeat: null,
      list: [],
      current_step: 'second', // 表示当前步骤
      bind_mobile: null,
      is_blur: true, // 表示是否失焦
      initTimeValue: null,
      initTime: 60,
      interval: null,
      initTimeText: '发送验证码'
    }
  }

  componentDidMount() {
  }

  updatePwd = (set_num, type) => {
    console.log('进来了');
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
    
  }

  handleInputChange = (e) => {
    this.setState({
      newPayPwd: e.target.value,
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

  handleInputChange1 = (e) => {
    this.setState({
      newPayPwdRepeat: e.target.value
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
    const { newPayPwd, newPayPwdRepeat, list = [], is_blur, initTimeValue, initTimeText } = this.state
    let isSubmit = !newPayPwd || !newPayPwdRepeat
    const mobile = this.props.user?.mobile
    console.log(mobile,'ss_01');
    return (
      <div className={styles.userMobileWrapper}>
        <div className={styles.userMobileContent}>
          <div className={styles.title}>
            <span className={styles.titleValue}>找回支付密码</span>
            <Icon onClick={this.handleClose} name="CloseOutlined" />
          </div>
          <div className={styles.inputItem}>
            <Input value={mobile} />
            <div className={styles.labelValue}>
              <div onClick={this.handleGetVerifyCode} className={styles.sendCaptcha}>
                {initTimeValue ? `${initTimeText}` : '发送验证码'}
              </div>
            </div>
          </div>
          <div className={styles.inputItem}>
            <div className={styles.labelName}>请输入短信验证码</div>
            <CaptchaInput current_step={'second'} updatePwd={this.updatePwd} list={list} is_blur={is_blur} />
          </div>
          <div className={styles.inputItem}>
            <Input onChange={this.handleInputChange} onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} mode="password" placeholder="请输入新支付密码" />
          </div>
          <div className={styles.inputItem}>
            <Input onFocus={this.handleInputFocus1} onChange={this.handleInputChange1} onBlur={this.handleInputBlur1} mode="password" placeholder="请重复输入新支付密码" />
          </div>
          <div className={styles.bottom}>
            <Button disabled={isSubmit} onClick={this.handleStepBtn} type={"primary"} className={styles.btn}>设置新支付密码</Button>
          </div>
        </div>
      </div>
    )
  }
}
