import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import H5PayBox from './h5/pay-confirmed';
import PCPayBox from './pc/pay-confirmed';
@inject('site')
@observer
export default class index extends Component {
  render() {
    const { platform } = this.props.site;
    if (platform === 'pc') {
      return <PCPayBox />;
    }
    return <H5PayBox />;
  }
}
