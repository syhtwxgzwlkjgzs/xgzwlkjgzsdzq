import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import clearLoginStatus from '@common/utils/clear-login-status';
import UserCenterPost from '@components/user-center-post-pc';
import UserCenterAction from '@components/user-center-action-pc';
import UserBaseLaout from '@components/user-center-base-laout-pc';
import SidebarPanel from '@components/sidebar-panel';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
import UserCenterFans from '@components/user-center-fans';
import UserCenterFollow from '@components/user-center-follow';

@inject('site')
@inject('user')
@observer
class PCMyPage extends React.Component {
  componentDidMount() {
    this.props.user.getUserThreads();
  }

  loginOut() {
    clearLoginStatus();
    window.location.replace('/');
  }

  moreFans = () => {};

  moreFollow = () => {};

  onSearch = (value) => {
    this.props.router.replace(`/search?keyword=${value}`);
  };

  renderRight = () => {
    const { pageData } = {};
    return (
      <>
        <SidebarPanel type="normal" title="个人资料" isShowMore={true} moreText={'编辑资料'}>
          <div className={styles.userInfoWrapper}>
            <div className={styles.userInfoKey}>手机号码</div>
            <div className={styles.userInfoValue}>{this.props.user.mobile}</div>
          </div>

          <div className={styles.userInfoWrapper}>
            <div className={styles.userInfoKey}>微信</div>
            <div className={styles.userInfoValue}>{this.props.user.nickname}</div>
          </div>

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
        <SidebarPanel
          type="normal"
          isNoData={Number(this.props.user.fansCount) === 0}
          title="粉丝"
          leftNum={this.props.user.fansCount}
          onShowMore={this.moreFans}
        >
          {Number(this.props.user.fansCount) !== 0 && (
            <UserCenterFans
              style={{
                overflow: 'hidden',
              }}
              className={styles.friendsWrapper}
              limit={5}
            />
          )}
        </SidebarPanel>
        <div className={styles.hr}></div>
        <SidebarPanel
          type="normal"
          isNoData={Number(this.props.user.followCount) === 0}
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
          leftNum={`${userThreadsTotalCount}个主题`}
          noData={!userThreads?.length}
        >
          {userThreads?.map((item, index) => (
            <div key={index}>
              <ThreadContent className={styles.wrapper} showBottom={false} data={item} key={index} />
            </div>
          ))}
        </SidebarPanel>
      </div>
    );
  };

  render() {
    return (
      <UserBaseLaout allowRefresh={false} onSearch={this.onSearch} right={this.renderRight}>
        {this.renderContent()}
      </UserBaseLaout>
    );
  }
}

export default PCMyPage;
