import React from 'react';
import SidebarPanel from '@components/sidebar-panel';
import UserCenterFollowPopup from '@components/user-center-follow-popup';
import { inject, observer } from 'mobx-react';
import { getUserFollow } from '@server';
import styles from './index.module.scss';
import { get } from '@common/utils/get';
import { withRouter } from 'next/router';
import { Spin, Avatar } from '@discuzq/design';
import NoData from '@components/no-data';
import { followerAdapter } from './adapter';

@inject('user')
@observer
class UserCenterFriendPc extends React.Component {
  static defaultProps = {
    // 用户id，如果不传，认为是自己的粉丝
    userId: null,
    // 加载数量限制
    limit: 5,
    hasMorePage: false,
    className: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      showFriendPopup: false,
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

  async componentDidMount() {
    // 第一次加载完后，才允许加载更多页面
    await this.fetchFollows();
    this.firstLoaded = true;
    this.setState({
      loading: false,
    });
  }

  // 点击好友更多
  moreFriend = () => {
    this.setState({ showFriendPopup: true });
  };

  render() {
    const followCount = this.props.userId ? this.props.user.targetUserFollowCount : this.props.user.followCount;
    const isNoData = followerAdapter(this.state.follows).length === 0 && !this.state.loading;
    return (
      <>
        <SidebarPanel
          type="normal"
          noData={Number(followCount) === 0}
          title="好友"
          leftNum={followCount}
          onShowMore={this.moreFriend}
          className={this.props.className}
        >
          {Number(followCount) !== 0 && (
            <div
              className={styles.friendWrap}
            >
            {followerAdapter(this.state.follows).map((user, index) => {
              if (index + 1 > this.props.limit) return null;
              return (
                <div key={user.id} className={styles.friendItem}>
                  <div className={styles.friendAvatar}>
                    <Avatar
                      image={user.avatar}
                      userId={user.id}
                      circle
                      name={user.userName}
                    />
                  </div>
                  <div className={styles.friendTextInfo}>
                    {user.userName}
                  </div>
                </div>
              );
            })}
            {isNoData && <NoData />}
            <div className={styles.loadMoreContainer}>{this.state.loading && <Spin type={'spinner'}>加载中 ...</Spin>}</div>
          </div>
          )}
        </SidebarPanel>

        <UserCenterFollowPopup
          id={this.props.userId}
          title='好友'
          visible={this.state.showFriendPopup}
          onContainerClick={({ id }) => {
            this.props.router.push({
              pathname: '/user/[id]',
              query: {
                id,
              },
            });
          }}
          onClose={() => this.setState({ showFriendPopup: false })}
        />
      </>
    );
  }
}

export default withRouter(UserCenterFriendPc);
