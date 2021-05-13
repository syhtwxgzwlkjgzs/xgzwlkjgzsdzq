import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss'
import HOCFetchSiteData from '../../middleware/HOCFetchSiteData'
import CaptchaInput from './captcha-input/index'
import VerifyCode from './verify-code/index'

@inject('site')
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
  handleStepBtn = () => {
    this.setState({
      current_step: 'second',
      list: []
    })
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
    if (calback && typeof calback === 'function') calback()
  }

  render() {
    const { current_step, list = [], is_blur } = this.state
    return (
      <div>
        <Header />
        <div className={styles.content}>
          <h3>{current_step === 'first' ? '验证原手机号码' : '请输入新绑定手机号'}</h3>
          <div className={styles.labelInfo}>
            {
              current_step === 'first' ? (
                <div>
                  <span className={styles.labelName}>原手机号</span>
                  <span className={styles.labelValue}>18270****420</span>
                </div>
              ) : (
                <div className={styles.labelInput}>
                  <Input placeholder="请输入绑定手机号" onChange={this.handleInputChange} focus={true} onBlur={this.handleInputBlur} onFocus={this.handleInputFocus} />
                </div>
              )
            }
            <div>
              <VerifyCode key={current_step} text={"发送验证码"} getVerifyCode={this.getVerifyCode} />
            </div>
          </div>
          <div className={styles.bindCode}>
            <span>验证码</span>
            <CaptchaInput current_step={current_step} updatePwd={this.updatePwd} list={list} is_blur={is_blur} />
          </div>
        </div>
        <div className={styles.bottom}>
          <Button onClick={this.handleStepBtn} type={"primary"} className={styles.btn}>{this.state.current_step === 'first' ? "下一步" : '确定'}</Button>
        </div>
      </div>
    )
  }
}

export default HOCFetchSiteData(index)
