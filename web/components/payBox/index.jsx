import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import EventEmitter from 'eventemitter3';
import H5PayBox from './h5/amount-recognized';
import PCPayBox from './pc/amount-recognized';

class PayBoxEmitter extends EventEmitter {}

const payBoxEmitter = new PayBoxEmitter();

@inject('site')
@inject('payBox')
@observer
export default class PayBox extends Component {
  constructor(props) {
    super(props);
    this.createPayBox = this.createPayBox.bind(this);
    payBoxEmitter.on('createPayBox', this.createPayBox);
  }

  createPayBox(options) {
    this.props.payBox.options = {
      ...options,
      visible: true
    };
  }
  
  render() {
    console.log(this.props.payBox)
    const { platform } = this.props.site;
    if (platform === 'pc') {
      return <PCPayBox />;
    }
    return <H5PayBox options={this.props.payBox.options}/>;
  }
}

PayBox.createPayBox = (options) => payBoxEmitter.emit('createPayBox', options);