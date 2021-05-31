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
import UserCenterFollow from '@components/user-center-follow';
import Router from '@discuzq/sdk/dist/router';
import UserCenterFollowPopup from '@components/user-center-follow-popup';
import UserCenterThreads from '@components/user-center-threads';
import NoData from '@components/no-data';
import UserCenterFansPc from '@components/user-center/fans-pc';

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
  componentDidMount() {
    // this.props.user.getUserThreads();
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
    Router.push({ url: `/my/others?isOtherPerson=${true}&otherId=${id}` });
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
        <div className={styles.hr}></div>
        <UserCenterFansPc />
        <div className={styles.hr}></div>
        <SidebarPanel
          type="normal"
          noData={Number(this.props.user.followCount) === 0}
          title="关注"
          leftNum={this.props.user.followCount}
          onShowMore={this.moreFollow}
        >
          {Number(this.props.user.followCount) !== 0 && (
            <UserCenterFollow
              style={{
                overflow: 'hidden',
              }}
              className={styles.friendsWrapper}
              limit={5}
            />
          )}
        </SidebarPanel>
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
        <SidebarPanel
          title="主题"
          type="normal"
          bigSize={true}
          isShowMore={!userThreads}
          showRefresh={false}
          leftNum={`${userThreadsTotalCount}个主题`}
          noData={!formattedUserThreads?.length}
        >
          {/* FIXME: PC 切换至新逻辑 */}
          {formattedUserThreads && formattedUserThreads.length > 0 ? (
            <UserCenterThreads data={formattedUserThreads} />
          ) : (
            <NoData />
          )}
        </SidebarPanel>
      </div>
    );
  };

  render() {
    const { user } = this.props;
    const { userThreadsPage, userThreadsTotalPage } = user;
    return (
      <>
        <UserBaseLaout
          noMore={userThreadsTotalPage <= userThreadsPage}
          onRefresh={user.getUserThreads}
          allowRefresh={false}
          onSearch={this.onSearch}
          right={this.renderRight}
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
