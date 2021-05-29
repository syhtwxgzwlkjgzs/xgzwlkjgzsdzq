import React from 'react';
import { Button } from '@discuzq/design';
import styles from './index.module.scss';
import classNames from 'classnames';
export default class VerificationCode extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      initTimeText: props.text ? props.text : '获取验证码',
      buttonDisabled: false, //初始设置按钮是可以点击的
      interval: null,
      initTimeValue: props.initTimeValue || 60,
      initTime: 60
    }
  }

  componentDidMount() {
    this.setState({
      initTimeValue: this.props.initTimeValue || 60
    })
  }

  buttonClick = () => {
    this.buttonClickAction()
  }

  buttonClickAction = () => {
    const that = this
    if (this.state.buttonDisabled) {
      return false
    }
    that.setState(
      {
        buttonDisabled: true
      },
      function () {
        this.props.getVerifyCode({
          calback: function (err) {
            if (err) {
              that.setState({
                buttonDisabled: false
              })
              return
            }
            const { initTimeValue } = that.state
            that.setState({
              interval: setInterval(function () {
                const { initTime } = that.state
                that.setState({
                  initTime: initTime - 1,
                  initTimeText: initTime - 1,
                  buttonDisabled: true
                })
                if (initTime === 0) {
                  that.setState({
                    initTime: initTimeValue,
                    initTimeText: '重新获取',
                    buttonDisabled: false
                  })
                  if (that.state.interval != null) {
                    clearInterval(that.state.interval)
                  }
                }
              }, 1000)
            })
          }
        })
      }
    )
  }
  render() {
    const { value_pass_check } = this.props
    const { buttonDisabled } = this.state
    return (
      <div
        className={classNames(styles.verifyCodeBtn, {
          [styles.verifyCodeBgColor]: !(buttonDisabled || !value_pass_check),
        })}
      >
        <Button
          className={styles.btn}
          type={!buttonDisabled ? 'primary' : 'text'}
          disabled={buttonDisabled || !value_pass_check}
          onClick={this.buttonClickAction.bind(this)}
        >
          {this.state.initTimeText}
        </Button>
      </div>
    )
  }
}
VerificationCode.defaultProps = {
  getVerifyCode: function () { },
  value_pass_check: true, //校验是否可以点击
  initTimeValue: 60, // 默认倒计时间
}
VerificationCode.propTypes = {}
