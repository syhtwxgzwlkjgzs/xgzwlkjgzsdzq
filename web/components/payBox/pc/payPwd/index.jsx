import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
// import CommonPayoffPwd from '../../components/common-paypwd-content';
import { STEP_MAP } from '../../../../../common/constants/payBoxStoreConstants';
import { Toast, Icon, Input, Button } from '@discuzq/design';

@inject('user')
@inject('payBox')
@observer
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      payPassword: null
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  // 匹配输入的数字
  toMarryNumber = (num) => {
    let value;
    switch (num) {
      case 48:
      case 96:
        value = '0';
        break;
      case 49:
      case 97:
        value = '1';
        break;
      case 50:
      case 98:
        value = '2';
        break;
      case 51:
      case 99:
        value = '3';
        break;
      case 52:
      case 100:
        value = '4';
        break;
      case 53:
      case 101:
        value = '5';
        break;
      case 54:
      case 102:
        value = '6';
        break;
      case 55:
      case 103:
        value = '7';
        break;
      case 56:
      case 104:
        value = '8';
        break;
      case 57:
      case 105:
        value = '9';
        break;
      default:
        break;
    }
    return value;
  };

  // 监听键盘事件
  handleKeyDown = (e) => {
    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
      // 表示输入数字
      let set_num = this.toMarryNumber(e.keyCode);
      this.props.updatePwd && this.props.updatePwd(set_num, 'add');
    } else if (e.keyCode == 13) {
      // 表示输入回车
    } else if (e.keyCode == 8) {
      // 表示回退事件
      this.props.updatePwd && this.props.updatePwd('', 'delete');
    } else {
      // 其他非数字情况
    }
  };

  initState = () => {
    this.setState({
      list: [],
      payPassword: null
    })
  }

  componentWillUnmount() {
    this.setState({
      list: []
    })
  }

  // 点击取消或者关闭---回到上个页面
  handleCancel = () => {
    this.props.payBox.step = STEP_MAP.PAYWAY
    this.initState()
  }

  // 初次设置密码
  handleSetPwd = (e) => {
    this.setState({
      payPassword: e.target.value,
    });
  };

  // 点击提交
  handleSubmit = async () => {
    const { payPassword } = this.state;
    const { id } = this.props.user;
    this.props.payBox.password = payPassword;
    this.props.payBox
      .setPayPassword(id)
      .then((res) => {
        Toast.success({
          content: '设置密码成功',
          hasMask: false,
          duration: 1000,
        });
        this.props.user.updateUserInfo(id);
        this.props.payBox.step = STEP_MAP.PAYWAY;
        this.props.payBox.visible = true;
        this.initState();
      })
      .catch((err) => {
        console.log(err);
        Toast.error({
          content: '设置失败请重新设置',
          hasMask: false,
          duration: 1000,
        });
        this.initState();
      });
  };

  render() {
    const { list = [], payPassword } = this.state;
    return (
      <div className={styles.payPwdWrapper}>
        {/* <CommonPayoffPwd whetherIsShowPwdBox={true} list={list} updatePwd={this.updatePwd} /> */}
        <div className={styles.payTop}>
          <div className={styles.payTitle}>设置支付密码</div>
          {/* 关闭按钮 */}
          <div className={styles.payBoxCloseIcon} onClick={this.handleCancel}>
            <Icon name="CloseOutlined" size={12} />
          </div>
        </div>
        <Input type="number" maxLength={6} value={payPassword} onChange={this.handleSetPwd} mode="password" className={styles.payInput} placeholder="请输入支付密码" />
        <Button onClick={this.handleSubmit} disabled={!payPassword || payPassword.length !== 6} type={'primary'} className={styles.payBtn}>设置支付密码</Button>
      </div>
    );
  }
}
