import React, { Component } from 'react'
import H5PayoffPwd from '../../../components/payPwd/h5/payoffPwd/index'
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

class Index extends Component {
  render() {
    return (
      <div>
        <H5PayoffPwd />
      </div>
    )
  }
}

export default HOCFetchSiteData(Index)
