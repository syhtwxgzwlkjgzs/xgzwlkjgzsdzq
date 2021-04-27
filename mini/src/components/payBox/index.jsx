// @ts-check
import React, { Component } from 'react';
import { Popup, Icon } from '@discuzq/design';
import { inject, observer } from 'mobx-react';
import EventEmitter from 'eventemitter3';
import { View } from '@tarojs/components';
import { STEP_MAP } from '../../../../common/constants/payBoxStoreConstants';
import AmountRecognized from './amount-recognized';
import PayConfirmed from './pay-confirmed';
import PayPwd from './payPwd'

class PayBoxEmitter extends EventEmitter {}

const payBoxEmitter = new PayBoxEmitter();

@inject('payBox')
@inject('user')
@observer
export default class PayBox extends Component {
  constructor(props) {
    super(props);
    this.createPayBox = this.createPayBox.bind(this);
    payBoxEmitter.on('createPayBox', this.createPayBox);
  }

  createPayBox = async (
    options = {
      data: {},
    },
  ) => {
    // 每次新的付费创建，需要清空前一次的付费信息
    this.props.payBox.clear();
    this.props.payBox.options = {
      ...options.data,
    };
    const noop = () => {};
    this.props.payBox.onSuccess = options.success || noop;
    this.props.payBox.onFailed = options.failed || noop;
    this.props.payBox.onCompleted = options.completed || noop;
    this.props.payBox.visible = true;
  };

  render() {
    return (
      <View>
        <Popup
          position="bottom"
          maskClosable={true}
          visible={this.props.payBox.visible}
          onClose={() => {
            this.props.payBox.visible = false;
          }}
        >
          {this.props.payBox.step === STEP_MAP.SURE && <AmountRecognized />}
          {this.props.payBox.step === STEP_MAP.PAYWAY && <PayConfirmed />}
        </Popup>
        {(this.props.payBox.step === STEP_MAP.WALLET_PASSWORD || this.props.payBox.step === STEP_MAP.SET_PASSWORD) && (
          <PayPwd />
        )}
      </View>
    );
  }
}

/**
 * 订单生成函数
 * @param {{
 *  data: {
 *    amount: number;
 *    redAmount: number;
 *    rewardAmount: number;
 *    isAnonymous: number;
 *    type: number;
 *    threadId: number;
 *    groupId: number;
 *    payeeId: number;
 * }
 * success: (orderInfo: any) => any
 * failed: (orderInfo: any) => any
 * completed: (orderInfo: any) => any
 * }} options
 */
PayBox.createPayBox = (options) => payBoxEmitter.emit('createPayBox', options);
