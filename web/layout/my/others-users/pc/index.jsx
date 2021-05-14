import React from 'react';
import styles from './index.module.scss';
import clearLoginStatus from '@common/utils/clear-login-status';
import { Button } from '@discuzq/design';
import UserCenterPost from '@components/user-center-post-pc';
import UserCenterAction from '@components/user-center-action-pc';
import UserBaseLaout from '@components/user-center-base-laout-pc'
import SidebarPanel from '@components/sidebar-panel';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
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
    const { pageData = []  } = {};
    return (
      <>
      <SidebarPanel 
        title="粉丝"
        noData={pageData.length} 
        onShowMore={this.moreFans}
      >
      </SidebarPanel>
      <div className={styles.hr}></div>
      <SidebarPanel 
        title="关注"
        leftNum="2880"
        noData={pageData.length} 
        onShowMore={this.moreFollow}
      >
      </SidebarPanel>
      <Copyright/>
    </>
    )
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
    )
  }
  render() {
    const { pageData } = {};
    return (
       <UserBaseLaout
          isOtherPerson={true}
          allowRefresh={false}
          onSearch={this.onSearch}
          right={ this.renderRight }
        >
          { this.renderContent(pageData) }
        </UserBaseLaout>
      // <div>
      //   <h1>pc</h1>
      //   <UserCenterPost />
      //   <Button onClick={this.loginOut}>退出登录</Button>
      // </div>
    );
  }
}

export default PCMyPage;
