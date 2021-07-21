import React from 'react';
import { inject, observer } from 'mobx-react';
import { STEP_MAP } from '@common/constants/payBoxStoreConstants';
import AmountRecognized from './amount-recognized';
import PayConfirmed from './pay-confirmed';
import PayPwd from './payPwd';
import { Dialog } from '@discuzq/design';
import isServer from '@common/utils/is-server';
import styles from './index.module.scss';
@inject('payBox')
@observer
class PayBoxPc extends React.Component {
  onClose = () => {
    if (!this.props.payBox.visible) return;
    this.props.payBox.visible = false;
    // FIXME: 延时回调的修复
    // setTimeout(() => {
    //   this.props.payBox.clear();
    // }, 500);
  };

  // 拉起支付弹窗后阻止回退操作
  handleKeyDown = (e) => {
    if (e.keyCode === 8) {
      if (e.returnValue) {
        e.returnValue = false;
      }
      if (e.preventDefault) {
        e.preventDefault();
      }
      return false;
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    return (
      !isServer() && (
        <Dialog
          visible={this.props.payBox.visible}
          position="center"
          maskClosable={true}
          onClose={this.onClose}
          className={styles.pc}
        >
          {this.props.payBox.step === STEP_MAP.SURE && <AmountRecognized />}
          {this.props.payBox.step === STEP_MAP.PAYWAY && <PayConfirmed />}
          {(this.props.payBox.step === STEP_MAP.WALLET_PASSWORD ||
            this.props.payBox.step === STEP_MAP.SET_PASSWORD) && <PayPwd />}
        </Dialog>
      )
    );
  }
}

export default PayBoxPc;
