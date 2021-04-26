import React, { Component } from 'react'
import H5PayoffPwd from '../../../components/payBox/h5/payPwd'
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
