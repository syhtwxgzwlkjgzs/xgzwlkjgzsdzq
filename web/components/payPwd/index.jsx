import React, { Component } from 'react';
import PCPayoffPwd from './pc/payoffPwd';
import H5PayoffPwd from './h5/payoffPwd';
import { inject, observer } from 'mobx-react';

@inject('site')
@inject('payBox')
@observer
export default class index extends Component {
  render() {
    const { platform } = this.props.site;
    if (platform === 'pc') {
      return <PCPayoffPwd />;
    }
    // return <H5PayoffPwd />
  }
}
