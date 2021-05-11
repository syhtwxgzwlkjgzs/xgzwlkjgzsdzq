import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import H5UserCenterEditInfo from './h5/index'

@inject('site')
@observer
export default class index extends Component {
  render() {
    const { site } = this.props;
    const { platform } = site;
    return (
      <div>
        {
          platform === 'h5' && (
            <H5UserCenterEditInfo />
          )
        }
      </div>
    )
  }
}
