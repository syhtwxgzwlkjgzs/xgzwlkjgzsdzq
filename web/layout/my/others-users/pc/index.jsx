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
import UserCenterFansPopup from '@components/user-center-fans-popup';
import UserCenterFollowPopup from '@components/user-center-follow-popup';


@inject('site')
@inject('user')
@observer
class PCMyPage extends React.Component {
  constructor(props) {
    super(props);
    this.props.user.cleanTargetUserThreads();
    this.state = {
      showFansPopup: false, // 是否弹出粉丝框
      showFollowPopup: false, // 是否弹出关注框
    };
  }
  componentDidMount = async () => {
    const { query } = this.props.router;
    if (query.otherId) {
      await this.props.user.getTargetUserInfo(query.otherId);
    }
  }
  fetchTargetUserThreads = async () => {
    const { query } = this.props.router;
    if (query.otherId) {
      await this.props.user.getTargetUserThreads(query.otherId);
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
    const { query } = this.props.router;
    const { targetUser } = this.props.user;
    const user = targetUser || {} ;
    console.log(this.props.user, 'targetUser');
    return (
      <>
        <SidebarPanel
          type="normal"
          isNoData={Number(user.fansCount) === 0}
          title="粉丝"
          leftNum={user.fansCount || 0}
          onShowMore={this.moreFans}
        >
          {Number(user.fansCount) !== 0 && (
            <UserCenterFans
              style={{
                overflow: 'hidden',
              }}
              userId={query.otherId}
              className={styles.friendsWrapper}
              limit={5}
            />
          )}
        </SidebarPanel>
        <div className={styles.hr}></div>
        <SidebarPanel
          type="normal"
          isNoData={Number(user.followCount) === 0}
          title="关注"
          leftNum={user.followCount}
          onShowMore={this.moreFollow}
        >
          {Number(user.followCount) !== 0 && (
            <UserCenterFollow
              style={{
                overflow: 'hidden',
              }}
              userId={query.otherId}
              className={styles.friendsWrapper}
              limit={5}
            />
          )}
        </SidebarPanel>
        <Copyright/>
    </>
    );
  }
  renderContent = () => {
    const { user } = this.props;
    const { targetUserThreads, targetUserThreadsTotalCount} = user;
    return (
      <div className={styles.userContent}>
        <SidebarPanel
          title="主题"
          type='normal'
          bigSize={true}
          isShowMore={!targetUserThreads}
          leftNum ={`${targetUserThreadsTotalCount}个主题`}
          noData={!targetUserThreads?.length}
        >
          {
            targetUserThreads?.map((item, index) => (
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
    const { user } = this.props;
    const { targetUserThreadsPage, targetUserThreadsTotalPage } = user;
    const {pageData } = [];
    const { query } = this.props.router;
    return (
      <>
        <UserBaseLaout
          isOtherPerson={true}
          allowRefresh={false}
          onRefresh={this.fetchTargetUserThreads}
          noMore={targetUserThreadsTotalPage < targetUserThreadsPage}
          showRefresh={false}
          onSearch={this.onSearch}
          right={ this.renderRight }
        >
          { this.renderContent() }
        </UserBaseLaout>

        <UserCenterFansPopup 
          visible={this.state.showFansPopup}
          onClose={() => this.setState({ showFansPopup: false })}
          isOtherFans={true}
          id={query.otherId}
        />
        <UserCenterFollowPopup
          visible={this.state.showFollowPopup}
          onClose={() => this.setState({ showFollowPopup: false })}
          isOtherFans={true}
          id={query.otherId}
        />
      </>
    );
  }
}

export default withRouter(PCMyPage);
