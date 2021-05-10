import React from 'react';
import UserCenterFriends from '../user-center-friends';
import { inject, observer } from 'mobx-react';
import { followerAdapter } from './adapter';
import styles from './index.module.scss';

@inject('user')
@observer
class UserCenterFollow extends React.Component {
  firstLoaded = false;
  containerRef = React.createRef(null);

  static defaultProps = {
    // 加载数量限制
    limit: 5,
    // 加载更多页面
    loadMorePage: false,
    splitElement: <div>123</div>,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    // 第一次加载完后，才允许加载更多页面
    await this.props.user.getUserFollow();
    this.firstLoaded = true;
    this.setState({
      loading: false,
    });
  }

  // 检查是否满足触底加载更多的条件
  checkLoadCondition() {
    if (!this.props.loadMorePage) {
      return false;
    }

    return true;
  }

  // 加载更多函数
  async loadMore() {
    if (!this.checkLoadCondition()) return;
    await this.props.user.getUserFollow();
  }

  render() {
    return (
      <div ref={this.containerRef}>
        {followerAdapter(this.props.user.userFollows).map((user, index) => {
          if (index + 1 > this.props.limit) return null;
          return (
            <div key={user.id}>
              <UserCenterFriends
                id={user.id}
                type={user.isMutual ? 'friend' : 'followed'}
                imgUrl={user.avatar}
                withHeaderUserInfo={true}
                userName={user.userName}
                userGroup={user.groupName}
              />
              {this.props.splitElement}
            </div>
          );
        })}
      </div>
    );
  }
}

export default UserCenterFollow;
