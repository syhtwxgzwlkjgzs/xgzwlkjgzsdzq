import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import styles from './index.module.scss';
import SectionTitle from '@components/section-title';
import BaseLayout from '@components/base-layout';
import List from '@components/list';
import Users from '@layout/search/h5/components/active-users';
import Copyright from '@components/copyright';
import ShieldList from './components/shield-list';
import UserCenterFansPc from '@components/user-center/fans-pc';
import UserCenterFollowsPc from '@components/user-center/follows-pc';
import SidebarPanel from '@components/sidebar-panel';

@inject('site')
@inject('user')
@observer
class BlockPcPage extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await this.props.user.getUserShieldList();
  }

  componentWillUnmount() {
    this.props.user.clearUserShield();
  }

  redirectToSearchResultPost = () => {
    this.props.router.push(`/search/result-post?keyword=${this.state.value || ''}`);
  };

  // 加载更多函数
  loadMore = async () => {
    await this.props.user.getUserShieldList();
    return;
  };

  // 右侧 - 潮流话题 粉丝 版权信息
  renderRight = () => (
    <div className={styles.right}>
      <UserCenterFansPc />
      <UserCenterFollowsPc />
      <Copyright />
    </div>
  );

  render() {
    const { user } = this.props;
    const { userShieldPage, userShieldTotalPage, userShield, userShieldTotalCount } = user;

    return (
      <BaseLayout 
        right={this.renderRight}
        immediateCheck={false}
        onRefresh={this.loadMore}
        showRefresh={false}
        noMore={userShieldTotalPage < userShieldPage}
      >
        <SidebarPanel 
          title="我的屏蔽" 
          type='normal'
          isShowMore={false}
          noData={!userShield?.length}
          isLoading={!userShield}
          icon={{ type: 3, name: 'LikeOutlined' }}
          rightText={`共有${userShieldTotalCount}位用户`}
        >
          <ShieldList data={userShield} />
        </SidebarPanel>
      </BaseLayout>
    );
  }
}

export default withRouter(BlockPcPage);
