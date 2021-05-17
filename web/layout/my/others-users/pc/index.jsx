import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react'
import UserBaseLaout from '@components/user-center-base-laout-pc';
import SidebarPanel from '@components/sidebar-panel';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
import { withRouter } from 'next/router';
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
    const { query } = this.props.router;
    if (query.otherId) {
      this.props.user.getTargetUserInfo(query.otherId);
    }
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
  }
  renderRight = () => {
    const { pageData = []  } = {};
    return (
      <>
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
        <Copyright/>
    </>
    );
  }
  renderContent = (pageData) => {
    const num = 0;
    return (
      <div className={styles.userContent}>
        <SidebarPanel
          title="主题"
          type='normal'
          bigSize={true}
          isShowMore={!pageData}
          leftNum ={`${num}个主题`}
          noData={!pageData?.length}
        >
          {
            pageData?.map((item, index) => (
              <div>
                  <ThreadContent className={styles.wrapper} showBottom={false} data={item} key={index} />
                  <div className={styles.hr}></div>
              </div>
            ))
          }
        </SidebarPanel>
      </div>
    );
  }
  render() {
    const { pageData } = {};
    return (
      <>
        <UserBaseLaout
          isOtherPerson={true}
          allowRefresh={false}
          onSearch={this.onSearch}
          right={ this.renderRight }
        >
          { this.renderContent(pageData) }
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

export default withRouter(PCMyPage);
