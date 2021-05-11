import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import Header from '@components/header';
import UserCenterFllows from '@components/user-center-follow'

@inject('user')
@observer
export default class index extends Component {
  render() {
    return (
      <div>
        <Header />
        <UserCenterFllows 
          friends={this.props.user.userFollows}
          loadMorePage={true}
          loadMoreAction={this.props.user.getUserFollow}
          hasMorePage={this.props.user.userFollowsTotalPage < this.props.user.userFollowsPage}
        />
      </div>
    )
  }
}
