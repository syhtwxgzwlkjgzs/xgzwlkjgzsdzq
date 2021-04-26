import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Popup } from '@discuzq/design';
import { STEP_MAP } from '../../../../common/constants/payBoxStoreConstants';
import AmountRecognized from './amount-recognized';
import PayConfirmed from './pay-confirmed';
import PayPwd from './payPwd'

@inject('payBox')
@observer
export default class index extends Component {
  render() {
    const { step } = this.props.payBox;
    return (
      <Popup
        position="bottom"
        maskClosable={true}
        visible={this.props.payBox.visible}
        onClose={() => {
          this.props.payBox.visible = false;
        }}
      >
        {step === STEP_MAP.SURE && <AmountRecognized />}
        {step === STEP_MAP.PAYWAY && <PayConfirmed />}
      </Popup>
    );
  }
}
