import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Header from '@components/header';
import UserCenterFllows from '@components/user-center-follow';
import { Divider, Toast } from '@discuzq/design';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';

@inject('user')
@observer
export default class index extends Component {

  // 点击关注
  followHandler = async ({id}) => {
    try {
      await this.props.user.postFollow(id)
      Toast.success({
        content: '关注成功',
        hasMask: false,
        duration: 1000,
      })
      this.props.user.setUserFollowerBeFollowed(id)
    } catch (error) {

    }
  }

  // 取消关注
  unFollowHandler = async ({ id }) => {
    try {
      await this.props.user.cancelFollow({ id, type: 1 })
      this.props.user.setUserFollowerBeUnFollowed(id);
      Toast.success({
        content: '取消成功',
        hasMask: false,
        duration: 1000,
      })
    } catch (error) {

    }
  }

  onContainerClick = ({id}) => {
    Router.push({url: `/my/others?otherId=${id}`})
  }

  splitElement = () => {
    return (
      <div className={styles.splitEmelent}>
        <Divider />
      </div>
    )
  }

  render() {
    return (
      <div>
        <Header />
        <UserCenterFllows
          friends={this.props.user.userFollows}
          loadMorePage={true}
          loadMoreAction={this.props.user.getUserFollow}
          hasMorePage={this.props.user.userFollowsTotalPage < this.props.user.userFollowsPage}
          followHandler={this.followHandler}
          unFollowHandler={this.unFollowHandler}
          splitElement={this.splitElement()}
          onContainerClick={this.onContainerClick}
        />
      </div>
    )
  }
}
