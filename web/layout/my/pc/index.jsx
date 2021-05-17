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
import { Icon, Popup} from '@discuzq/design';
import Router from '@discuzq/sdk/dist/router';
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
    this.props.user.getUserThreads();
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
  renderRight = () => {
    return (
      <>
        <SidebarPanel
          type="normal"
          title="个人资料"
          isShowMore={true}
          moreText={'编辑资料'}
          onShowMore={() => { Router.push({ url: '/my/edit' }); }} 
      >
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
              <div className={styles.threadHr}></div>
            </div>
          ))}
        </SidebarPanel>
      </div>
    );
  };

  render() {
    return (
      <>
        <UserBaseLaout allowRefresh={false} onSearch={this.onSearch} right={this.renderRight}>
          {this.renderContent()}
        </UserBaseLaout>
        <Popup position="center" visible={this.state.showFansPopup} onClose={() => this.setState({ showFansPopup: false })}>
          <div className={styles.contaner}>
            <div className={styles.popupWrapper}>
              <div className={styles.title}>
                粉丝
                <Icon
                  name="CloseOutlined"
                  className={styles.closeIcon}
                  size={12}
                  onClick={() => this.setState({ showFansPopup: false })}
                />
              </div>
              <div className={styles.titleHr}></div>
              <UserCenterFans onContainerClick={this.onContainerClick} />
            </div>
          </div>
        </Popup>

        <Popup position="center" visible={this.state.showFollowPopup} onClose={() => this.setState({ showFollowPopup: false })}>
          <div className={styles.contaner}>
            <div className={styles.popupWrapper}>
              <div className={styles.title}>
                关注
                <Icon
                  name="CloseOutlined"
                  className={styles.closeIcon}
                  size={12}
                  onClick={() => this.setState({ showFollowPopup: false })}
                />
              </div>
              <div className={styles.titleHr}></div>
              <UserCenterFollow onContainerClick={this.onContainerClick} />
            </div>
          </div>
        </Popup>
      </>
    );
  }
}

export default PCMyPage;
