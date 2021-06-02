import React from 'react';
import styles from './index.module.scss';
import { inject, observer } from 'mobx-react';
import UserBaseLaout from '@components/user-center-base-laout-pc';
import SidebarPanel from '@components/sidebar-panel';
import ThreadContent from '@components/thread';
import Copyright from '@components/copyright';
import { withRouter } from 'next/router';
import UserCenterFansPc from '@components/user-center/fans-pc';
import UserCenterFollowsPc from '@components/user-center/follows-pc';
import UserCenterFansPopup from '@components/user-center-fans-popup';
import UserCenterFollowPopup from '@components/user-center-follow-popup';
import Router from '@discuzq/sdk/dist/router';
import UserCenterThreads from '@components/user-center-threads';
import List from '@components/list';

@inject('site')
@inject('user')
@observer
class PCMyPage extends React.Component {
  targetUserId = null;
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
    const id = this.props.user?.id;
    if (String(id) === query.id) {
      Router.replace({ url: '/my' });
      return;
    }
    if (query.id) {
      this.targetUserId = query.id;
      await this.props.user.getTargetUserInfo(query.id);
      this.setState({
        fetchUserInfoLoading: false,
      });
    }
  };

  componentDidUpdate = async () => {
    const { query } = this.props.router;
    const id = this.props.user?.id;

    if (String(id) === query.id) {
      Router.replace({ url: '/my' });
      return;
    }

    if (String(this.targetUserId) === String(query.id)) return;
    this.targetUserId = query.id;
    if (query.id) {
      this.props.user.removeTargetUserInfo();
      await this.props.user.getTargetUserInfo(query.id);
      await this.fetchTargetUserThreads();
      this.setState({
        fetchUserInfoLoading: false,
      });
    }
  };

  fetchTargetUserThreads = async () => {
    const { query } = this.props.router;
    if (query.id) {
      await this.props.user.getTargetUserThreads(query.id);
    }
    return;
  };

  formatUserThreadsData = (targetUserThreads) => {
    if (Object.keys(targetUserThreads).length === 0) return [];
    return Object.values(targetUserThreads).reduce((fullData, pageData) => [...fullData, ...pageData]);
  };

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

  renderRight = () => {
    const { query } = this.props.router;
    const id = query?.id;
    return (
      <>
        <UserCenterFansPc userId={id} />

        <UserCenterFollowsPc userId={id} />
        <Copyright />
      </>
    );
  };

  renderContent = () => {
    const { user } = this.props;
    const { targetUserThreads, targetUserThreadsTotalCount, targetUserThreadsPage, targetUserThreadsTotalPage } = user;
    return (
      <div className={styles.userContent}>
        <SidebarPanel
          title="主题"
          type="normal"
          bigSize={true}
          isShowMore={false}
          isLoading={!targetUserThreads}
          leftNum={`${targetUserThreadsTotalCount}个主题`}
          noData={!this.formatUserThreadsData(targetUserThreads)?.length}
        >
          {this.formatUserThreadsData(targetUserThreads)
              && this.formatUserThreadsData(targetUserThreads).length > 0 && (
                <UserCenterThreads data={this.formatUserThreadsData(targetUserThreads)} />
          )}
        </SidebarPanel>
      </div>
    );
  };

  render() {
    const { user } = this.props;
    const { targetUserThreadsPage, targetUserThreadsTotalPage, targetUserThreads } = user;
    return (
      <>
        <UserBaseLaout
          isOtherPerson={true}
          allowRefresh={false}
          onRefresh={this.fetchTargetUserThreads}
          noMore={targetUserThreadsTotalPage < targetUserThreadsPage}
          showRefresh={false}
          onSearch={this.onSearch}
          right={this.renderRight}
          immediateCheck={true}
          showLayoutRefresh={!!this.formatUserThreadsData(targetUserThreads)?.length}
        >
          {this.renderContent()}
        </UserBaseLaout>
      </>
    );
  }
}

export default withRouter(PCMyPage);
