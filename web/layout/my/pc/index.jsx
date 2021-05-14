import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import clearLoginStatus from '@common/utils/clear-login-status';
import UserCenterPost from '@components/user-center-post-pc';
import UserCenterAction from '@components/user-center-action-pc';
import UserBaseLaout from '@components/user-center-base-laout-pc'
import SidebarPanel from '@components/sidebar-panel';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
@inject('site')
@inject('user')
@observer
class PCMyPage extends React.Component {
  loginOut() {
    clearLoginStatus();
    window.location.replace('/');
  }
  moreFans = () => {}
  moreFollow = () => {}
  onSearch = (value) => {
    this.props.router.replace(`/search?keyword=${value}`);
  }
  renderRight = () => {
    const { pageData } = {};
    return (
      <>
      <SidebarPanel 
        title="粉丝"
        onShowMore={this.moreFans}
      >
      </SidebarPanel>
      <div className={styles.hr}></div>
      <SidebarPanel 
        title="关注"
        leftNum="2880"
        onShowMore={this.moreFollow}
      >
      </SidebarPanel>
      <Copyright/>
    </>
    )
  }
  renderContent = () => {
    const { user } = this.props;
    const { userThreads, userThreadsTotalCount, userThreadsPage, userThreadsTotalPage } = user;
    console.log(this.props, 'userThreads');
    return (
      <div className={styles.userContent}>
        <div className={styles.section}>
          <UserCenterPost/>
        </div>
        <div className={styles.section}>
          <UserCenterAction/>
        </div>
        <SidebarPanel 
          title="主题" 
          type='normal'
          bigSize={true}
          isShowMore={!userThreads}
          leftNum ={`${userThreadsTotalCount}个主题`}
          noData={!userThreads?.length}
        >
          {
            userThreads?.map((item, index) => (
              <div>
                  <ThreadContent className={styles.wrapper} showBottom={false} data={item} key={index} />
                  <div className={styles.hr}></div>
              </div>
            ))
          }
        </SidebarPanel>
      </div>
    )
  }
  render() {
    return (
       <UserBaseLaout
          allowRefresh={false}
          onSearch={this.onSearch}
          right={ this.renderRight }
        >
          { this.renderContent() }
        </UserBaseLaout>
    );
  }
}

export default PCMyPage;
