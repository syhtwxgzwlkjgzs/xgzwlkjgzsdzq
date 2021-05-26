import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss';
import HOCFetchSiteData from '../../../middleware/HOCFetchSiteData';
import CaptchaInput from '../../user-center-edit-mobile/captcha-input';
import VerifyCode from '../../user-center-edit-mobile/verify-code';
import throttle from '@common/utils/thottle.js';
import Router from '@discuzq/sdk/dist/router';

@inject('site')
@inject('user')
@inject('payBox')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      current_step: 'second', // 表示当前步骤
      is_blur: true, // 表示是否失焦
      isKeyBoardVisible: false, // 是否显示键盘
      initTimeValue: null,
      payPassword: null,
      payPasswordConfirmation: null
    };
  }

  initState = () => {
    this.setState({
      list: [],
      current_step: 'second', // 表示当前步骤
      is_blur: true, // 表示是否失焦
      isKeyBoardVisible: false, // 是否显示键盘
      initTimeValue: null,
      payPassword: null,
      payPasswordConfirmation: null
    })
  }

  updatePwd = (set_num, type) => {
    const { list = [] } = this.state;
    if (type == 'add') {
      let list_ = [...list];
      if (list.length >= 6) {
        list_ = list_.join('').substring(0, 5)
          .split('');
      }
      this.setState(
        {
          list: [].concat(list_, [set_num]),
        },
        () => {
          if (this.state.list.length === 6) {
            // this.submitPwa();
            this.setState({
              isKeyBoardVisible: false
            })
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
    const { list = [], payPassword, payPasswordConfirmation } = this.state
    const mobile = this.props?.user.originalMobile;
    const code = list.join("")
    this.props.payBox.forgetPayPwd({
      mobile,
      code,
      payPassword,
      payPasswordConfirmation
    }).then(res => {
      Toast.success({
        content: "重置密码成功",
        hasMask: false,
        duration: 1000,
      })
      Router.push({ url: `/my` })
    }).catch((err) => {
      console.log(err);
      Toast.error({
        content: err.Msg || "重置密码失败",
        hasMask: false,
        duration: 1000,
      })
    })
  }

  handleInputChange = (e) => {
    this.setState({
      payPassword: e.target.value,
      is_blur: false,
    });
  }

  handleInputChange1 = (e) => {
    this.setState({
      payPasswordConfirmation: e.target.value,
      is_blur: false,
    });
  }

  handleInputFocus = (e) => {
    this.setState({
      is_blur: false,
    });
  }

  handleInputBlur = (e) => {
    this.setState({
      payPassword: e.target.value,
      is_blur: true,
    });
  }

  handleInputFocus1 = () => {
    this.setState({
      is_blur: false,
    });
  }

  handleInputBlur1 = (e) => {
    this.setState({
      payPasswordConfirmation: e.target.value,
      is_blur: true,
    });
  }

  getVerifyCode = throttle(({ calback }) => {
    const mobile = this.props?.user.originalMobile;
    this.props.payBox.sendSmsVerifyCode({ mobile }).then(res => {
      this.setState({
        initTimeValue: res.interval,
      }, () => {
        if (calback && typeof calback === 'function') calback();
      });
    }).catch((err) => {
      Toast.error({
        content: err.Message || '获取验证码失败',
        hasMask: false,
        duration: 1000,
      })
      this.setState({
        list: [],
        initTimeValue: null
      });
      if (calback && typeof calback === 'function') calback(err);
    })
  }, 300)

  // 点击切换弹出键盘事件
  handleKeyBoardVisible = () => {
    this.setState({
      isKeyBoardVisible: !this.state.isKeyBoardVisible
    })
  }

  render() {
    const { current_step, list = [], is_blur, isKeyBoardVisible, initTimeValue, payPassword, payPasswordConfirmation } = this.state;
    const mobile = this.props?.user.mobile;
    const disabled = !payPassword || !payPasswordConfirmation || list.length !== 6
    return (
      <div>
        <Header />
        <div className={styles.content}>
          <h3>找回支付密码</h3>
          <div className={styles.labelInfo}>
            <div>
              <span className={styles.labelName}>手机号</span>
              <span className={styles.labelValue} style={{ border: 'none' }}>{mobile}</span>
            </div>
            <div>
              <VerifyCode key={initTimeValue} initTimeValue={initTimeValue} key={current_step} text={'发送验证码'} getVerifyCode={this.getVerifyCode} />
            </div>
          </div>
          <div className={styles.bindCode}>
            <span>请输入短信验证码</span>
            <CaptchaInput handleKeyBoardVisible={this.handleKeyBoardVisible} isKeyBoardVisible={isKeyBoardVisible} current_step={current_step} updatePwd={this.updatePwd} list={list} is_blur={is_blur} />
          </div>
        </div>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input value={payPassword} onChange={this.handleInputChange} onFocus={this.handleInputFocus} onBlur={this.handleInputBlur} mode="password" placeholder="请输入新密码" type="number" maxLength={6} /></div>
        </div>
        <div className={styles.labelInfo}>
          <div className={styles.labelValue}><Input value={payPasswordConfirmation} onFocus={this.handleInputFocus1} onChange={this.handleInputChange1} onBlur={this.handleInputBlur1} mode="password" placeholder="请重复输入新密码" type="number" maxLength={6} /></div>
        </div>
        <div className={`${styles.bottom} ${isKeyBoardVisible && styles.bootom2}`}>
          <Button disabled={disabled} full onClick={this.handleStepBtn} type={'primary'} className={styles.btn}>提交</Button>
        </div>
      </div>
    );
  }
}

export default index;
