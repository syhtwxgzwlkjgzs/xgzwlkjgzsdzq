import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import clearLoginStatus from '@common/utils/clear-login-status';
import UserCenterPost from '@components/user-center-post-pc';
import UserCenterAction from '@components/user-center-action-pc';
import UserBaseLaout from '@components/user-center-base-laout-pc';
import SidebarPanel from '@components/sidebar-panel';
import Avatar from '@components/avatar';
import Copyright from '@components/copyright';
import List from '@components/list';
import Router from '@discuzq/sdk/dist/router';
import UserCenterFollowPopup from '@components/user-center-follow-popup';
import UserCenterThreads from '@components/user-center-threads';
import NoData from '@components/no-data';
import UserCenterFansPc from '@components/user-center/fans-pc';
import UserCenterFollowsPc from '../../../components/user-center/follows-pc';
import Thread from '@components/thread';
import SectionTitle from '@components/section-title'


@inject('site')
@inject('user')
@observer
class PCMyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFansPopup: false, // 是否弹出粉丝框
      showFollowPopup: false, // 是否弹出关注框
    };
  }
  async componentDidMount() {
    await this.props.user.getUserThreads();
  }

  loginOut() {
    clearLoginStatus();
    window.location.replace('/');
  }

  // 点击粉丝更多
  moreFans = () => {
    this.setState({ showFansPopup: true });
  };
  // 点击粉丝关注更多
  moreFollow = () => {
    this.setState({ showFollowPopup: true });
  };

  onSearch = (value) => {
    this.props.router.replace(`/search?keyword=${value}`);
  };

  onContainerClick = ({ id }) => {
    Router.push({ url: `/user/${id}` });
  };

  formatUserThreadsData = (userThreads) => {
    if (Object.keys(userThreads).length === 0) return [];
    return Object.values(userThreads).reduce((fullData, pageData) => [...fullData, ...pageData]);
  };

  renderRight = () => {
    // 条件都满足时才显示微信
    const IS_WECHAT_ACCESSABLE = this.props.site.wechatEnv !== 'none' && !!this.props.user.wxNickname;
    return (
      <>
        <SidebarPanel
          type="normal"
          title="个人资料"
          isShowMore={true}
          noData={false}
          moreText={'编辑资料'}
          onShowMore={() => {
            Router.push({ url: '/my/edit' });
          }}
        >
          <div className={styles.userInfoWrapper}>
            <div className={styles.userInfoKey}>手机号码</div>
            <div className={styles.userInfoValue}>{this.props.user.mobile}</div>
          </div>

          {IS_WECHAT_ACCESSABLE && (
            <div className={styles.userInfoWrapper}>
              <div className={styles.userInfoKey}>微信</div>
              <div className={styles.userInfoValue}>
                <Avatar size="small" image={this.props.user.wxHeadImgUrl} name={this.props.user.wxNickname} />
                <span className={styles.wecahtNickname}>{this.props.user.wxNickname}</span>
              </div>
            </div>
          )}

          <div className={styles.userInfoWrapper}>
            <div className={styles.userInfoKey}>实名认证</div>
            <div className={styles.userInfoValue}>去认证</div>
          </div>

          <div className={styles.userInfoWrapper}>
            <div className={styles.userInfoKey}>签名</div>
            <div className={styles.userInfoValue}>{this.props.user.signature}</div>
          </div>
        </SidebarPanel>

        <UserCenterFansPc />

        <UserCenterFollowsPc />
        <Copyright />
      </>
    );
  };

  renderContent = () => {
    const { user } = this.props;
    const { userThreads, userThreadsTotalCount } = user;
    const formattedUserThreads = this.formatUserThreadsData(userThreads);
   
    return (
      <div className={styles.userContent}>
        <div className={styles.section}>
          <UserCenterPost />
        </div>
        <div className={styles.section}>
          <UserCenterAction />
        </div>

        <div className={styles.postTitle}>
          <SectionTitle
            title="主题"
            isShowMore={false}
            leftNum={`${userThreadsTotalCount}个主题`}
          />
        </div>
        <div className={styles.postContent}>
          {
            formattedUserThreads?.length ? formattedUserThreads.map(
              (item, index) => <Thread data={item} key={index} className={index === 0 && styles.threadStyle} />
            ) : null
          }
        </div>
      </div>
    );
  };

  render() {
    const { user } = this.props
    const { userThreadsPage, userThreadsTotalPage, getUserThreads, userThreads } = user;
    const formattedUserThreads = this.formatUserThreadsData(userThreads);

    // store中，userThreadsPage会比真实页数多1
    let currentPageNum = userThreadsPage
    if (userThreadsTotalPage > 1) {
      currentPageNum -= 1
    }

    return (
      <>
        <UserBaseLaout
          showRefresh={false}
          onSearch={this.onSearch}
          right={this.renderRight}
          immediateCheck={false}
          noMore={userThreadsTotalPage <= currentPageNum}
          onRefresh={getUserThreads}
        >
          {this.renderContent()}
        </UserBaseLaout>

        {/* 两个粉丝 popup */}
        <>
          <UserCenterFollowPopup
            visible={this.state.showFollowPopup}
            onClose={() => this.setState({ showFollowPopup: false })}
          />
        </>
      </>
    );
  }
}

export default PCMyPage;
