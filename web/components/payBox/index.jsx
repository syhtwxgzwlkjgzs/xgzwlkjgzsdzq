// @ts-check
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import EventEmitter from 'eventemitter3';
import H5PayBox from './h5/amount-recognized';
import PCPayBox from './pc/pay-confirmed';

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

  createPayBox = async (options) => {
    this.props.payBox.options = {
      ...options
    };
    this.props.payBox.visible = true;
  };

  render() {
    const { platform } = this.props.site;
    if (platform === 'pc') {
      return <PCPayBox />;
    }
    return <H5PayBox options={this.props.payBox.options} />;
  }
}

PayBox.createPayBox = (options) => payBoxEmitter.emit('createPayBox', options);

/**
 * 订单生成函数
 * @param {{
 *  amount: number;
 *  redAmount: number;
 *  rewardAmount: number;
 *  isAnonymous: number;
 *  type: number;
 *  threadId: number;
 *  groupId: number;
 *  payeeId: number;
 * }} orderOptions
 */
PayBox.orderBuilder = (orderOptions) => {
  return orderOptions;
};
