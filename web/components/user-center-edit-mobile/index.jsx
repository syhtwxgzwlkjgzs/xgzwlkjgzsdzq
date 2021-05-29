import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss';
import HOCFetchSiteData from '../../middleware/HOCFetchSiteData';
import CaptchaInput from './captcha-input/index';
import VerifyCode from './verify-code/index';
import Router from '@discuzq/sdk/dist/router';
import throttle from '@common/utils/thottle.js';
import classNames from 'classnames';

@inject('site')
@inject('user')
@observer
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      currentStep: 'first', // 表示当前步骤
      bindMobile: null,
      isBlur: false, // 表示是否失焦
      isKeyBoardVisible: false, // 表示是否显示键盘
    };
  }

  initState = () => {
    this.setState({
      list: [],
      currentStep: 'first', // 表示当前步骤
      bindMobile: null,
      isBlur: false, // 表示是否失焦
      isKeyBoardVisible: false, // 表示是否显示键盘
    })
  }

  // 点击切换弹出键盘事件
  handleKeyBoardVisible = () => {
    this.setState({
      isKeyBoardVisible: !this.state.isKeyBoardVisible
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
            this.handleKeyBoardVisible()
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
  handleStepBtn = throttle(async () => {
    if (this.getDisabledWithButton()) return
    const { list = [], currentStep, bindMobile } = this.state;
    if (list.length !== 6) return;
    if (currentStep === 'first') {
      this.props.user.oldMobileVerifyCode = list.join('');
      this.props.user.verifyOldMobile().then((res) => {
        if (this.state.interval != null) {
          clearInterval(this.state.interval);
        }
        this.setState({
          currentStep: 'second',
          list: [],
          initTimeValue: null,
          initTime: 60,
          interval: null,
          initTimeText: '发送验证码',
          buttonDisabled: false,
          isKeyBoardVisible: false
        });
      })
        .catch((err) => {
          Toast.error({
            content: err.Message || '验证失败',
            hasMask: false,
            duration: 1000,
          });
          this.initState()
          this.props.user.oldMobileVerifyCode = null;
        });
    } else if (currentStep === 'second') {
      this.props.user.newMobile = bindMobile;
      this.props.user.newMobileVerifyCode = list.join('');
      await this.props.user.rebindMobile().then((res) => {
        Toast.success({
          content: '绑定成功',
          hasMask: false,
          duration: 1000,
        })
        Router.push({ url: '/my' });
        setTimeout(() => {
          this.initState()
        }, 1000)
      })
        .catch((err) => {
          Toast.error({
            content: err.Message || '修改失败',
            hasMask: false,
            duration: 1000,
          });
          this.setState({
            list: []
          })
        });
    }
  }, 300)

  handleInputChange = (e) => {
    this.setState({
      bindMobile: e.target.value,
    });
  }

  handleInputFocus = (e) => {
    this.setState({
      isBlur: false,
    });
  }

  handleInputBlur = (e) => {
    this.setState({
      isBlur: true,
    });
  }

  getVerifyCode = throttle(async ({ calback }) => {
    const { originalMobile } = this.props.user;
    const { currentStep } = this.state;
    if (currentStep === 'first') {
      let { captchaRandStr, captchaTicket } = await this.props.showCaptcha()
      this.props.user.sendSmsVerifyCode({ mobile: originalMobile, captchaRandStr, captchaTicket })
        .then((res) => {
          this.setState({
            initTimeValue: res.interval,
          });
          if (calback && typeof calback === 'function') calback();
        })
        .catch((err) => {
          console.log(err);
          Toast.error({
            content: '发送验证码失败',
            hasMask: false,
            duration: 1000,
          });
          this.setState({
            list: [],
          });
          if (calback && typeof calback === 'function') calback(err);
        });

    } else if (currentStep === 'second') {
      const { bindMobile } = this.state;
      let { captchaRandStr, captchaTicket } = await this.props.showCaptcha()
      this.props.user.sendSmsUpdateCode({ mobile: bindMobile, captchaRandStr, captchaTicket })
        .then((res) => {
          this.setState({
            initTimeValue: res.interval,
          });
          if (calback && typeof calback === 'function') calback();
        })
        .catch((err) => {
          console.log(err);
          Toast.error({
            content: err.Message || '发送验证码失败',
            hasMask: false,
            duration: 1000,
          });
          this.setState({
            bindMobile: null
          });
          if (calback && typeof calback === 'function') calback(err);
        });
    }
  }, 300)

  validateTel = value => (/^[1][3-9]\d{9}$/.test(value))

  /**
* 获取按钮禁用状态
* @returns true 表示禁用 false表示不禁用
*/
  getDisabledWithButton = () => {
    const { currentStep, list = [], bindMobile } = this.state;
    let isSubmit = false;
    if (currentStep === 'first') {
      isSubmit = list.length !== 6;
    } else if (currentStep === 'second') {
      isSubmit = (list.length !== 6 || !this.validateTel(bindMobile));
    }
    return isSubmit
  }

  render() {
    const { currentStep, list = [], isBlur, bindMobile, initTimeValue, isKeyBoardVisible } = this.state;
    const { mobile } = this.props?.user;
    const value_pass_check = currentStep === 'second' ? this.validateTel(bindMobile) : true;
    return (
      <div id={styles.editMobileContent}>
        <Header />
        <div className={styles.content}>
          {currentStep === 'first' && <h3>验证旧手机</h3>}
          <div className={styles.labelInfo}>
            {
              currentStep === 'first' ? (
                <div>
                  <span className={styles.labelName}>原手机号</span>
                  <span className={styles.labelValue}>{mobile}</span>
                </div>
              ) : (
                <div className={styles.labelInput}>
                  <Input placeholder="请输入新手机号" onChange={this.handleInputChange} focus={true} onBlur={this.handleInputBlur} onFocus={this.handleInputFocus} value={bindMobile} />
                </div>
              )
            }
            <div>
              <VerifyCode initTimeValue={this.state.initTimeValue} value_pass_check={value_pass_check} key={currentStep} text={'发送验证码'} getVerifyCode={this.getVerifyCode} />
            </div>
          </div>
          <div className={styles.bindCode}>
            <span>请输入验证码</span>
            <CaptchaInput handleKeyBoardVisible={this.handleKeyBoardVisible} isKeyBoardVisible={isKeyBoardVisible} currentStep={currentStep} updatePwd={this.updatePwd} list={list} isBlur={isBlur} />
          </div>
        </div>
        <div
          className={classNames(styles.bottom, {
            [styles.btnPosition]: !!isKeyBoardVisible,
            [styles.bgBtnColor]: !this.getDisabledWithButton(),
          })}
        >
          <Button full disabled={this.getDisabledWithButton()} onClick={this.handleStepBtn} type={'primary'} className={styles.btn}>提交</Button>
        </div>
      </div>
    );
  }
}

export default index;
