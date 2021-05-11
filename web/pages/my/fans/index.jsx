import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import Header from '@components/header';
import UserCenterFans from '@components/user-center-fans'

@inject('user')
@observer
export default class index extends Component {
  render() {
    return (
      <div>
        <Header />
        我的天
        <UserCenterFans 
          friends={this.props.user.userFans}
          loadMorePage={true}
          loadMoreAction={this.props.user.getUserFans}
          hasMorePage={this.props.user.userFansTotalPage < this.props.user.userFansPage}
        />
      </div>
    )
  }
}
