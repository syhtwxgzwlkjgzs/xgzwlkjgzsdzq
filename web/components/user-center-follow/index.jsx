import React from 'react';
import UserCenterFriends from '../user-center-friends';
import { inject, observer } from 'mobx-react';
import { followerAdapter } from './adapter';
import styles from './index.module.scss';

@inject('user')
@observer
class UserCenterFollow extends React.Component {
  static defaultProps = {
    // 加载数量限制
    limit: 5,
    // 加载更多页面
    loadMorePage: false,
    splitElement: <div>123</div>,
  }

  componentDidMount() {
    this.props.user.getUserFollow();
    this.props.user.getUserFans();
  }

  render() {
    return (
      <div>
        {followerAdapter(this.props.user.userFollows).map((user, index) => {
          if (index + 1 > this.props.limit) return null;
          return <UserCenterFriends
            key={user.id}
            id={user.id}
            type={user.isMutual ? 'friend' : 'followed'}
            imgUrl={user.avatar}
            withHeaderUserInfo={true}
            userName={user.userName}
            userGroup={user.groupName}
          />;
        })}
      </div>
    );
  }
}

export default UserCenterFollow;
