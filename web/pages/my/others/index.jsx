import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import H5OthersUserCenter from '@layout/my/others-users/h5'
import HOCFetchSiteData from '../../../middleware/HOCFetchSiteData';

@inject('site')
@observer
class Index extends Component {
  render() {
    const { platform } = this.props.site
    if (platform === 'h5') {
      return <H5OthersUserCenter />
    } else return <></>
  }
}

export default HOCFetchSiteData(Index);
