import React from 'react';
import UserCenterFriends from '../user-center-friends';
import { Spin, Toast, Input, Button, Icon, Avatar } from '@discuzq/design';
import { followerAdapter } from './adapter';
import friendsStyle from '@components/user-center/friend-pc/index.module.scss';
import styles from './index.module.scss';
import { createFollow, deleteFollow, getUserFollow } from '@server';
import { get } from '@common/utils/get';
import deepClone from '@common/utils/deep-clone';
import NoData from '@components/no-data';
import { inject, observer } from 'mobx-react';
import { debounce } from '@common/utils/throttle-debounce';
import Router from '@discuzq/sdk/dist/router';
import throttle from '@common/utils/thottle.js';

@inject('user')
@observer
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
    customActionArea: null,
    hasMorePage: false,
    className: '',
    style: {},
    itemStyle: {},
    messageMode: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      follows: {},
      searchValue: '',
    };
  }

  page = 1;
  totalPage = 1;

  fetchFollows = async () => {
    try {
      const opts = {
        params: {
          page: this.page,
          perPage: 20,
          filter: {
            userId: this.props.userId,
          },
        },
      };

      if (this.state.searchValue) {
        opts.params.filter['nickName'] = this.state.searchValue;
      }

      const followRes = await getUserFollow(opts);

      if (followRes.code !== 0) {
        console.error(followRes);
        Toast.error({
          content: followRes.msg,
          duration: 2000,
        });
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
    } catch (error) {
      console.error(error);
      if (error.code) {
        Toast.error({
          content: error.msg,
          duration: 2000,
        });
      }
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

    this.props.user.userInfo.followCount += 1;
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
    this.props.user.userInfo.followCount -= 1;
    this.setState({
      follows: targetFollows,
    });
  }

  followUser = async ({ id: userId }) => {
    try {
      const res = await createFollow({ data: { toUserId: userId } });
      if (res.code === 0 && res.data) {
        Toast.success({
          content: '操作成功',
          hasMask: false,
          duration: 2000,
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
    } catch (error) {
      console.error(error);
      Toast.error({
        content: '网络错误',
        duration: 2000,
      });
    }
  };

  unFollowUser = async ({ id }) => {
    try {
      const res = await deleteFollow({ data: { id, type: 1 } });
      if (res.code === 0 && res.data) {
        Toast.success({
          content: '操作成功',
          hasMask: false,
          duration: 2000,
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
    } catch (error) {
      console.error(error);
      Toast.error({
        content: '网络错误',
        duration: 2000,
      });
    }
  };

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
    this.containerRef &&
      this.containerRef.current &&
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
    let hasMorePage = null;
    if (this.dataSource) {
      hasMorePage = this.sourceTotalPage >= this.sourcePage;
    } else {
      hasMorePage = this.totalPage >= this.page;
    }
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

  searchDispatch = debounce(async () => {
    if (this.props.updateSourcePage) {
      this.props.updateSourcePage(1);
    }
    if (this.props.updateSourceTotalPage) {
      this.props.updateSourceTotalPage(1);
    }

    this.page = 1;
    this.totalPage = 1;

    this.setState({
      loading: true,
    });

    this.setState({
      follows: [],
    });
    if (this.props.setDataSource) {
      this.props.setDataSource({});
    }
    await this.fetchFollows();

    this.setState({
      loading: false,
    });
  }, 500);

  handleSearchValueChange = async (e) => {
    this.setState({
      searchValue: e.target.value,
    });
    this.searchDispatch();
  };

  render() {
    return (
      <>
        {this.props.messageMode && (
          <div className={styles.searchInputWrapper}>
            <Input
              value={this.state.searchValue}
              onChange={this.handleSearchValueChange}
              placeholder={'搜索联系人'}
              icon={'SearchOutlined'}
            />
          </div>
        )}
        <div
          className={this.props.className + ' user-center-follow-list'}
          ref={this.containerRef}
          style={{
            height: '100%',
            overflowY: 'scroll',
            ...this.props.style,
          }}
        >
          {followerAdapter(this.props.dataSource || this.state.follows).map((user, index) => {
            if (index + 1 > this.props.limit) return null;
            return (
              <div key={user.id} className="user-center-follow-item">
                <UserCenterFriends
                  id={user.id}
                  customActionArea={this.props.customActionArea}
                  type={this.judgeFollowsStatus(user)}
                  imgUrl={user.avatar}
                  withHeaderUserInfo={this.props.isPc}
                  onContainerClick={this.props.onContainerClick}
                  nickName={user.nickName}
                  userGroup={user.groupName}
                  followHandler={this.followUser}
                  unFollowHandler={this.unFollowUser}
                  itemStyle={this.props.itemStyle}
                  customActionArea={
                    this.props.messageMode ? (
                      <Button
                        className={styles.messageButton}
                        type={'primary'}
                        onClick={(e) => {
                          e.stopPropagation();
                          Router.replace({
                            url: `/message?page=chat&username=${user.userName}&nickname=${user.nickName}`,
                          });
                        }}
                      >
                        <div className={styles.messageButtonContent}>
                          <Icon size={12} name={'CommentOutlined'} />
                          <span>立即聊天</span>
                        </div>
                      </Button>
                    ) : null
                  }
                />
                {this.props.splitElement}
              </div>
            );
