import React from 'react';
import UserCenterFriends from '../user-center-friends';
import { Spin } from '@discuzq/design';
import { followerAdapter } from './adapter';
import styles from './index.module.scss';
import { createFollow, deleteFollow, getUserFollow } from '@server';
import { get } from '@common/utils/get';
import deepClone from '@common/utils/deep-clone';
import NoData from '@components/no-data';

class UserCenterFollows extends React.Component {
  firstLoaded = false;
  containerRef = React.createRef(null);

  static defaultProps = {
    // 用户id，如果不传，认为是自己的粉丝
    userId: null,
    // 加载数量限制
    limit: 1000,
    // 加载更多页面
    loadMorePage: true,
    splitElement: <div></div>,
    isPc: false,
    friends: [],
    loadMoreAction: async () => {},
    followHandler: async () => {},
    unFollowHandler: async () => {},
    onContainerClick: async ({ id }) => {},
    hasMorePage: false,
    className: '',
    style: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      follows: {},
    };
  }

  page = 1;
  totalPage = 1;

  fetchFollows = async () => {
    const opts = {
      params: {
        page: this.page,
        perPage: 20,
        filter: {
          userId: this.props.userId,
        },
      },
    };

    const followRes = await getUserFollow(opts);

    if (followRes.code !== 0) {
      console.error(followRes);
      return;
    }

    const pageData = get(followRes, 'data.pageData', []);
    const totalPage = get(followRes, 'data.totalPage', 1);

    this.totalPage = totalPage;

    const newFollows = Object.assign({}, this.state.follows);

    newFollows[this.page] = pageData;

    this.setState({
      follows: newFollows,
    });

    if (this.page <= this.totalPage) {
      this.page += 1;
    }
  };

  setFansBeFollowed({ id, isMutual }) {
    const targetFollows = deepClone(this.state.follows);
    Object.keys(targetFollows).forEach((key) => {
      targetFollows[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isMutual = isMutual;
        user.userFollow.isFollow = true;
      });
    });
    this.setState({
      follows: targetFollows,
    });
  }

  setFansBeUnFollowed(id) {
    const targetFollows = deepClone(this.state.follows);
    Object.keys(targetFollows).forEach((key) => {
      targetFollows[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isFollow = false;
      });
    });
    this.setState({
      follows: targetFollows,
    });
  }

  followUser = async ({ id: userId }) => {
    const res = await createFollow({ data: { toUserId: userId } });
    if (res.code === 0 && res.data) {
      this.setFansBeFollowed({
        id: userId,
        isMutual: res.data.isMutual,
      });
      return {
        msg: '操作成功',
        data: res.data,
        success: true,
      };
    }
    return {
      msg: res.msg,
      data: null,
      success: false,
    };
  };

  unFollowUser = async ({ id }) => {
    const res = await deleteFollow({ data: { id, type: 1 } });
    if (res.code === 0 && res.data) {
      this.setFansBeUnFollowed(id);
      return {
        msg: '操作成功',
        data: res.data,
        success: true,
      };
    }
    return {
      msg: res.msg,
      data: null,
      success: false,
    };
  };

  async componentDidMount() {
    // 第一次加载完后，才允许加载更多页面
    await this.fetchFollows();
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
    const hasMorePage = this.totalPage >= this.page;
    if (this.state.loading) return false;
    if (!this.props.loadMorePage) {
      return false;
    }
    if (!hasMorePage) return false;

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
      await this.fetchFollows();
      this.setState({
        loading: false,
      });
    }
  };

  // 判断关注状态
  judgeFollowsStatus = (user) => {
    if (user.isMutual) {
      return 'friend';
    }
    if (user.isFollow) {
      return 'followed';
    }
    return 'follow';
  };

  render() {
    const isNoData = followerAdapter(this.state.follows).length === 0 && !this.state.loading;
    return (
      <div
        className={this.props.className}
        ref={this.containerRef}
        style={{
          height: '100%',
          overflow: 'scroll',
          ...this.props.style,
        }}
      >
        {followerAdapter(this.state.follows).map((user, index) => {
          if (index + 1 > this.props.limit) return null;
          return (
            <div key={user.id}>
              <UserCenterFriends
                id={user.id}
                type={this.judgeFollowsStatus(user)}
                imgUrl={user.avatar}
                withHeaderUserInfo={this.props.isPc}
                onContainerClick={this.props.onContainerClick}
                userName={user.userName}
                userGroup={user.groupName}
                followHandler={this.followUser}
                unFollowHandler={this.unFollowUser}
              />
              {this.props.splitElement}
            </div>
          );
        })}
        {isNoData && <NoData />}
        <div className={styles.loadMoreContainer}>{this.state.loading && <Spin type={'spinner'}>加载中 ...</Spin>}</div>
      </div>
    );
  }
}

export default UserCenterFollows;
