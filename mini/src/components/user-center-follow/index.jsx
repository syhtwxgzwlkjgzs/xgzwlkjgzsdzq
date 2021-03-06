import React from 'react';
import Spin from '@discuzq/design/dist/components/spin/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import { createFollow, deleteFollow, getUserFollow } from '@server';
import { get } from '@common/utils/get';
import deepClone from '@common/utils/deep-clone';
import NoData from '@components/no-data';
import { View } from '@tarojs/components';
import List from '@components/list';

import UserCenterFriends from '../user-center-friends';
import styles from './index.module.scss';
import { followerAdapter } from './adapter';
import throttle from '@common/utils/thottle.js';

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
    splitElement: <View></View>,
    isPc: false,
    dataSource: null,
    setDataSource: null,
    sourcePage: null,
    sourceTotalPage: null,
    updateSourcePage: null,
    updateSourceTotalPage: null,
    friends: [],
    loadMoreAction: async () => {},
    followHandler: async () => {},
    unFollowHandler: async () => {},
    onContainerClick: async ({ id }) => {},
    hasMorePage: false,
    className: '',
    style: {},
    itemStyle: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      follows: {},
      height: '100vh',
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

    if (this.props.updateSourceTotalPage) {
      this.props.updateSourceTotalPage(totalPage);
    }
    this.totalPage = totalPage;

    const newFollows = Object.assign({}, this.props.dataSource || this.state.follows);

    newFollows[this.page] = pageData;

    if (this.props.setDataSource) {
      this.props.setDataSource(newFollows);
    }
    this.setState({
      follows: newFollows,
    });

    if (this.page <= this.totalPage) {
      if (this.props.updateSourcePage) {
        this.props.updateSourcePage(this.props.sourcePage + 1);
      }
      this.page += 1;
    }
  };

  setFansBeFollowed({ id, isMutual }) {
    const targetFollows = deepClone(this.props.dataSource || this.state.follows);
    Object.keys(targetFollows).forEach((key) => {
      targetFollows[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isMutual = isMutual;
        user.userFollow.isFollow = true;
      });
    });
    if (this.props.setDataSource) {
      this.props.setDataSource(targetFollows);
    }
    this.setState({
      follows: targetFollows,
    });
  }

  setFansBeUnFollowed(id) {
    const targetFollows = deepClone(this.props.dataSource || this.state.follows);
    Object.keys(targetFollows).forEach((key) => {
      targetFollows[key].forEach((user) => {
        if (get(user, 'user.pid') !== id) return;
        user.userFollow.isFollow = false;
      });
    });
    if (this.props.setDataSource) {
      this.props.setDataSource(targetFollows);
    }
    this.setState({
      follows: targetFollows,
    });
  }

  followUser = throttle(async ({ id: userId }) => {
    const res = await createFollow({ data: { toUserId: userId } });
    if (res.code === 0 && res.data) {
      Toast.success({
        content: '操作成功',
        hasMask: false,
        duration: 1000,
      });
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
    Toast.error({
      content: res.msg || '关注失败',
      hasMask: false,
      duration: 2000,
    });
    return {
      msg: res.msg,
      data: null,
      success: false,
    };
  }, 1000);

  unFollowUser = throttle(async ({ id }) => {
    const res = await deleteFollow({ data: { id, type: 1 } });
    if (res.code === 0 && res.data) {
      Toast.success({
        content: '操作成功',
        hasMask: false,
        duration: 1000,
      });
      this.setFansBeUnFollowed(id);
      return {
        msg: '操作成功',
        data: res.data,
        success: true,
      };
    }
    Toast.error({
      content: res.msg || '取消关注失败',
      hasMask: false,
      duration: 2000,
    });
    return {
      msg: res.msg,
      data: null,
      success: false,
    };
  }, 1000);

  async componentDidMount() {
    // 第一次加载完后，才允许加载更多页面
    await this.fetchFollows();
    this.firstLoaded = true;
    this.setState({
      loading: false,
    });
    if (!this.containerRef.current) return;
    this.containerRef.current.addEventListener('scroll', this.loadMore);
  }

  // 清理，防止内存泄露
  componentWillUnmount() {
    if (!this.containerRef.current) return;
    this.containerRef.current.removeEventListener('scroll', this.loadMore);
  }

  // TODO: 增加这里对于 ID 的处理，感应 ID 变化时发生及时更新
  async componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.page = 1;
      this.totalPage = 1;
      if (this.props.updateSourcePage) {
        this.props.updateSourcePage(1);
      }
      if (this.props.updateSourceTotalPage) {
        this.props.updateSourceTotalPage(1);
      }
      if (this.props.setDataSource) {
        this.props.setDataSource({});
      }
      this.setState({
        follows: {},
      });
      await this.loadMore();
    }
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
    await this.fetchFollows();
    return;
  };

  // 判断关注状态
  judgeFollowsStatus = (user) => {
    if (!user.isFollow) {
      return 'follow';
    }
    if (user.isMutual) {
      return 'friend';
    }
    if (user.isFollow) {
      return 'followed';
    }
  };

  render() {
    return (
      <View>
        <List
          onRefresh={this.loadMore}
          noMore={this.totalPage < this.page}
          hasOnScrollToLower={true}
          height={this.state.height}
          className={styles.userCenterFriends}
        >
          <View className={styles.followBody}>
            {followerAdapter(this.props.dataSource || this.state.follows).map((user, index) => {
              if (index + 1 > this.props.limit) return null;
              return (
                <View key={user.id}>
                  <UserCenterFriends
                    id={user.id}
                    type={this.judgeFollowsStatus(user)}
                    imgUrl={user.avatar}
                    withHeaderUserInfo={this.props.isPc}
                    onContainerClick={this.props.onContainerClick}
                    nickName={user.nickName}
                    userGroup={user.groupName}
                    followHandler={this.followUser}
                    unFollowHandler={this.unFollowUser}
                    itemStyle={this.props.itemStyle}
                  />
                  {this.props.splitElement}
                </View>
              );
            })}
          </View>
        </List>
      </View>
    );
  }
}

export default UserCenterFollows;
