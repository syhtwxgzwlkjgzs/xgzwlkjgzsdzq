// @ts-check
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import EventEmitter from 'eventemitter3';
import { get } from '@common/utils/get';
import H5PayBox from './h5';
import PCPayBox from './pc';
import { Toast } from '@discuzq/design';

class PayBoxEmitter extends EventEmitter {}

const payBoxEmitter = new PayBoxEmitter();

@inject('site')
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
    if (Number(get(options, 'data.amount', 0)) < 0.1) {
      Toast.error({
        content: '最小支付金额必须大于 0.1 元',
      });
      return;
    }
    this.props.payBox.options = {
      ...options.data,
    };
    const noop = () => {};
    this.props.payBox.isAnonymous = options.isAnonymous || false;
    this.props.payBox.onSuccess = options.success || noop;
    this.props.payBox.onFailed = options.failed || noop;
    this.props.payBox.onCompleted = options.completed || noop;
    this.props.payBox.visible = true;
  };

  render() {
    const { platform } = this.props.site;
    if (platform === 'pc') {
      return <PCPayBox />;
    } else if (platform === 'h5') {
      return <H5PayBox options={this.props.payBox.options} />;
    } else {
      return null;
    }
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
