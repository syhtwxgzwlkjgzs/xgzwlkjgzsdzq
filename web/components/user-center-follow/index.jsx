import React from 'react';
import UserCenterFriends from '../user-center-friends';
import { Spin } from '@discuzq/design';
import { followerAdapter } from './adapter';
import styles from './index.module.scss';

class UserCenterFollow extends React.Component {
  firstLoaded = false;
  containerRef = React.createRef(null);

  static defaultProps = {
    // 加载数量限制
    limit: 100,
    // 加载更多页面
    loadMorePage: true,
    splitElement: <div></div>,
    friends: [],
    loadMoreAction: async () => {},
    followHandler: async () => {},
    unFollowHandler: async () => {},
    hasMorePage: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    // 第一次加载完后，才允许加载更多页面
    await this.props.loadMoreAction();
    this.firstLoaded = true;
    this.setState({
      loading: false,
    });

    this.containerRef.current.addEventListener('scroll', this.loadMore);
  }

  // 清理，防止内存泄露
  componentWillUnmount() {
    if (!this.containerRef.current) return;
    this.containerRef.current.removeEventListener('scroll', this.loadMore);
  }

  // 检查是否满足触底加载更多的条件
  checkLoadCondition() {
    if (this.state.loading) return false;
    if (!this.props.loadMorePage) {
      return false;
    }
    if (this.props.hasMorePage) return false;

    return true;
  }

  // 加载更多函数
   loadMore = async () => {
     const scrollDom = this.containerRef.current;
     if (scrollDom.clientHeight + scrollDom.scrollTop === scrollDom.scrollHeight) {
       if (!this.checkLoadCondition()) return;
       this.setState({
         loading: true,
       });
       await this.props.loadMoreAction();
       this.setState({
         loading: false,
       });
     }
   }

   render() {
     return (
      <div ref={this.containerRef} style={{
        height: '100%',
        overflow: 'scroll',
      }}>
        {followerAdapter(this.props.friends).map((user, index) => {
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
                followHandler={this.props.followHandler}
                unFollowHandler={this.props.unFollowHandler}
              />
              {this.props.splitElement}
            </div>
          );
        })}
        <div className={styles.loadMoreContainer}>
            {this.state.loading && <Spin type={'spinner'}>加载中 ...</Spin>}
        </div>
      </div>
     );
   }
}

export default UserCenterFollow;
