import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import H5PayBox from './h5/amount-recognized';
import PCPayBox from './pc/amount-recognized';
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
