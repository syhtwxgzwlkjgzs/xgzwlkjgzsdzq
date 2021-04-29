import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Popup } from '@discuzq/design';
import { STEP_MAP } from '../../../../common/constants/payBoxStoreConstants';
import AmountRecognized from './amount-recognized';
import PayConfirmed from './pay-confirmed';
import PayPwd from './payPwd';

@inject('payBox')
@observer
export default class index extends Component {
  onClose = () => {
    // FIXME: 延时回调的修复
    setTimeout(() => {
      this.props.payBox.clear();
    },1000)
  }

  render() {
    const { step } = this.props.payBox;
    return (
      <>
        <Popup
          position="bottom"
          maskClosable={true}
          visible={this.props.payBox.visible}
          onClose={this.onClose}
        >
          {step === STEP_MAP.SURE && <AmountRecognized />}
          {step === STEP_MAP.PAYWAY && <PayConfirmed />}
        </Popup>
        {(step === STEP_MAP.WALLET_PASSWORD||step === STEP_MAP.SET_PASSWORD) && <PayPwd />}
      </>
    );
  }
}
