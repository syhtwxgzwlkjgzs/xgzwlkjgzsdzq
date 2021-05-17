import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss'
import HOCFetchSiteData from '../../../middleware/HOCFetchSiteData'
import CaptchaInput from '../../user-center-edit-mobile/captcha-input'
import VerifyCode from '../../user-center-edit-mobile/verify-code'

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
      <div>
        <Header />
        <div className={styles.content}>
          <h3>找回密码</h3>
          <div className={styles.labelInfo}>
            <div>
              <span className={styles.labelName}>手机号</span>
              <span className={styles.labelValue} style={{ border: 'none' }}>18270****420</span>
            </div>
            <div>
              <VerifyCode key={current_step} text={"发送验证码"} getVerifyCode={this.getVerifyCode} />
            </div>
          </div>
          <div className={styles.bindCode}>
            <span>请输入短信验证码</span>
            <CaptchaInput current_step={current_step} updatePwd={this.updatePwd} list={list} is_blur={is_blur} />
          </div>
        </div>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input onChange={this.handleInputChange} onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} mode="password" placeholder="请输入新密码" /></div>
        </div>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input onFocus={this.handleInputFocus1} onChange={this.handleInputChange1} onBlur={this.handleInputBlur1} mode="password" placeholder="请重复输入新密码" /></div>
        </div>
        <div className={styles.bottom}>
          <Button onClick={this.handleStepBtn} type={"primary"} className={styles.btn}>提交</Button>
        </div>
      </div>
    )
  }
}

export default HOCFetchSiteData(index)
