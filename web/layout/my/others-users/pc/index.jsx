import React from 'react';
import styles from './index.module.scss';
import clearLoginStatus from '@common/utils/clear-login-status';
import { inject, observer } from 'mobx-react';
import { Button } from '@discuzq/design';
import UserBaseLaout from '@components/user-center-base-laout-pc';
import SidebarPanel from '@components/sidebar-panel';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
import { withRouter } from 'next/router';

@inject('site')
@inject('user')
@observer
class PCMyPage extends React.Component {
  loginOut() {
    clearLoginStatus();
    window.location.replace('/');
  }

  componentDidMount() {
    const { query } = this.props.router;
    if (query.otherId) {
      this.props.user.getTargetUserInfo(query.otherId);
    }
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
       <UserBaseLaout
          isOtherPerson={true}
          allowRefresh={false}
          onSearch={this.onSearch}
          right={ this.renderRight }
        >
          { this.renderContent(pageData) }
        </UserBaseLaout>
    );
  }
}

export default withRouter(PCMyPage);
